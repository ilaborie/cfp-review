package org.ilaborie.altcfp.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.github.benmanes.caffeine.cache.Caffeine
import org.ilaborie.altcfp.BackendConfiguration
import org.ilaborie.altcfp.models.Talk
import org.ilaborie.altcfp.models.TalkRate
import org.ilaborie.altcfp.models.TalkResponse
import java.nio.charset.StandardCharsets
import java.util.*
import java.util.concurrent.TimeUnit


interface Api {
    val me: String
    fun findTalks(): List<TalkResponse>
    fun rateTalk(talkId: Long, rate: TalkRate): TalkResponse
}

private data class TokenPayload(val sub: String, val exp: Long)

private fun extractEmail(token: String): String {
    val json = Base64.getDecoder()
        .decode(token.split(".")[1])
        .toString(StandardCharsets.UTF_8)
    val tokenPayload: TokenPayload = jacksonObjectMapper().readValue(json)
    return tokenPayload.sub
}


fun createApi(config: BackendConfiguration, token: String): Api =
    createBackendApi(config.url, token)
        .let { if (config.caching) CachingBackend(it) else it }
        .let { ApiImpl(it, extractEmail(token)) }

interface Cachealbe {

    fun clearCache()
}

private const val cachingTimeout: Long = 15

internal class CachingBackend(private val delegate: CfpBackendApi) : CfpBackendApi by delegate, Cachealbe {

    private val talkCache = Caffeine.newBuilder()
        .maximumSize(5)
        .refreshAfterWrite(cachingTimeout, TimeUnit.MINUTES)
        .build<String, List<Talk>> { _ -> delegate.findTalks() }

    override fun findTalks(): List<Talk> =
        talkCache.get("") ?: emptyList()

    private val rateCache = Caffeine.newBuilder()
        .maximumSize(1000)
        .refreshAfterWrite(cachingTimeout, TimeUnit.MINUTES)
        .build<Long, List<TalkRate>> { id -> delegate.findTalkRates(id) }

    override fun findTalkRates(id: Long): List<TalkRate> =
        rateCache.get(id) ?: emptyList()

    override fun createTalkRate(id: Long, rate: TalkRate): TalkRate {
        talkCache.refresh("")
        rateCache.refresh(id)
        return delegate.createTalkRate(id, rate)
    }

    override fun updateTalkRate(id: Long, rateId: Long, rate: TalkRate): TalkRate {
        talkCache.refresh("")
        rateCache.refresh(id)
        return delegate.updateTalkRate(id, rateId, rate)
    }

    override fun clearCache() {
        talkCache.invalidateAll()
        rateCache.invalidateAll()
    }
}


internal class ApiImpl(private val backend: CfpBackendApi, override val me: String) : Api {

    override fun findTalks(): List<TalkResponse> =
        backend.findTalks()
            .map { talk ->
                val rates = backend.findTalkRates(talk.id)
                TalkResponse(talk, rates)
            }.let { TwitterCountService.updateSpeaker(it) }

    override fun rateTalk(talkId: Long, rate: TalkRate): TalkResponse {
        val talk = backend.findTalk(talkId)
        val rates = backend.findTalkRates(talk.id)
            .filterNot { talkRate -> talkRate.id == rate.id }

        if (rate.id != null) backend.updateTalkRate(talkId, rate.id, rate)
        else backend.createTalkRate(talkId, rate)

        return TalkResponse(talk, rates + rate)
    }
}