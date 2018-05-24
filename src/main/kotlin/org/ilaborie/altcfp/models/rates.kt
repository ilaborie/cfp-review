package org.ilaborie.altcfp.models


data class TalkId(val id: String)

data class TalkRate(
        val id: Long?,
        val added: Long?,
        val rate: Int, // 1..5
        val hate: Boolean,
        val love: Boolean,
        val talk: TalkId?,
        val user: Speaker?,
        val eventId: String?)