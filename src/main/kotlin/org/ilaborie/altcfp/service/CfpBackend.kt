package org.ilaborie.altcfp.service

import feign.Feign
import feign.Param
import feign.RequestLine
import org.ilaborie.altcfp.models.Talk
import org.ilaborie.altcfp.models.TalkRate


internal interface CfpBackendApi {

    @RequestLine("GET /api/proposals")
    fun findTalks(): List<Talk>

    @RequestLine("GET /api/proposals/{id}")
    fun findTalk(@Param("id") id: Long): Talk

    @RequestLine("GET /api/proposals/{id}/rates")
    fun findTalkRates(@Param("id") id: Long): List<TalkRate>

    @RequestLine("POST /api/proposals/{id}/rates")
    fun createTalkRate(@Param("id") id: Long, rate: TalkRate): TalkRate

    @RequestLine("PUT /api/proposals/{talkId}/rates/{rateId}")
    fun updateTalkRate(@Param("talkId") id: Long, @Param("rateId") rateId: Long, rate: TalkRate): TalkRate

}

internal fun createBackendApi(url: String, token: String): CfpBackendApi =
    Feign.builder()
        .requestInterceptor {
            it
                .header("User-Agent",
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3439.0 Safari/537.36")
                .header("Accept", "application/json, text/plain, */*")
                .header("Accept-Encoding", "gzip, deflate, br")
                .header("Accept-Language", "en-US,en;q=0.9,fr;q=0.8")
                .header("Connection", "keep-alive")
                .header("Cookie", "token=$token")
                .header("Origin", url)
                .header("Referer", url)
                .header("Content-Type", "application/json")
        }
        .asDefault(url)
