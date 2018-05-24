package org.ilaborie.altcfp.service

import feign.Feign
import feign.Param
import feign.RequestLine
import org.ilaborie.altcfp.models.Speaker
import org.ilaborie.altcfp.models.TalkResponse


internal data class TwitterCount(
        val age_gated: Boolean,
        val followers_count: Int,
        val following: Boolean,
        val formatted_followers_count: String,
        val id: String,
        val name: String,
        val protected: Boolean,
        val screen_name: String)

internal interface TwitterCountService {

    @RequestLine("GET /widgets/followbutton/info.json?screen_names={names}")
    fun getTwitterCount(@Param("names") names: String): List<TwitterCount>

    companion object {

        private val service by lazy {
            Feign.builder()
                .asDefault<TwitterCountService>("https://cdn.syndication.twimg.com")
        }

        private fun twitterMapName(s: String): String {
            val idx = s.lastIndexOf('/')
            return when {
                idx >= 0          -> s.substring(idx + 1)
                s.startsWith("@") -> s.substring(1)
                else              -> s
            }
        }

        fun updateSpeaker(talks: List<TalkResponse>): List<TalkResponse> {
            val counts: Map<String, Int> = talks
                .flatMap { talk -> talk.cospeakers + talk.speaker }
                .mapNotNull { it.twitter }
                .joinToString(",")
                .let { service.getTwitterCount(it) }
                .map { it.screen_name to it.followers_count }
                .toMap()

            fun mapSpeaker(speaker: Speaker): Speaker {
                val twitterName = if (speaker.twitter != null) twitterMapName(speaker.twitter) else null

                return if (twitterName != null && counts.containsKey(twitterName))
                    speaker.copy(twitter = twitterName, twitterCount = counts[speaker.twitter])
                else speaker
            }

            return talks
                .map { talk ->
                    talk.copy(speaker = mapSpeaker(talk.speaker),
                              cospeakers = talk.cospeakers.map { mapSpeaker(it) })
                }
        }
    }
}