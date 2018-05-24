package org.ilaborie.altcfp.models


data class Talk(
        val added: Long,
        val cospeakers: List<Speaker>,
        val description: String,
        val difficulty: Int,
        val eventId: String,
        val format: Int,
        val id: Long,
        val language: String?,
        val name: String,
        val speaker: Speaker,
        val state: String,
        val trackId: Int,
        val trackLabel: String,
        val voteUsersEmail: List<String>?,
        val references: String?,
        val slides: String?,
        val video: String?,
        val mean: Double?)
