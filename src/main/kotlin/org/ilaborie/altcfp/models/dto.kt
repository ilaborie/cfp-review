package org.ilaborie.altcfp.models


data class TalksResponse(val me: String, val talks: List<TalkResponse>)

data class TalkResponse(
        val id: Long,
        val added: Long,
        val cospeakers: List<Speaker>,
        val description: String,
        val difficulty: Int,
        val eventId: String,
        val format: Int,
        val language: String?,
        val name: String,
        val speaker: Speaker,
        val state: String,
        val trackId: Int,
        val trackLabel: String,
        val references: String?,
        val slides: String?,
        val video: String?,
        val mean: Double?,
        val voteUsersEmail: List<String>,
        val rates: Map<String, TalkRate>
) {

    companion object {
        operator fun invoke(talk: Talk, rates: List<TalkRate>): TalkResponse {
            val groups: Map<String, TalkRate> = rates
                .groupBy { talkRate -> talkRate.user?.email ?: "" }
                .toList()
                .mapNotNull { (email, list) ->
                    // XXX remove 'no rate' if have more than one vote
                    if (list.size < 2)
                        email to list[0]
                    else
                        list.firstOrNull { it.rate != 0 }
                            ?.let { email to it }
                }
                .toMap()

            val aux: List<Int> = groups
                .filter { (_, rate) -> rate.rate > 0 }
                .map { (_, rate) -> rate.rate }
            val sum = aux.sumByDouble { it.toDouble() }
            val mean: Double? = if (aux.isEmpty()) null else sum / aux.size

            return TalkResponse(
                id = talk.id,
                added = talk.added,
                cospeakers = talk.cospeakers,
                description = talk.description,
                difficulty = talk.difficulty,
                eventId = talk.eventId,
                format = talk.format,
                language = talk.language,
                name = talk.name,
                speaker = talk.speaker,
                state = talk.state,
                trackId = talk.trackId,
                trackLabel = talk.trackLabel,
                references = talk.references,
                slides = talk.slides,
                video = talk.video,
                mean = mean,
                voteUsersEmail = groups
                    .map { (_, rate) -> rate.user?.email }
                    .filterNotNull(),
                rates = groups.toMap()
            )
        }
    }
}



