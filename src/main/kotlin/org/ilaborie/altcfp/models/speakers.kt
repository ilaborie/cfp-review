package org.ilaborie.altcfp.models


data class Speaker(
        val id: Int,
        val admin: Boolean,
        val bio: String?,
        val company: String?,
        val email: String,
        val firstname: String?,
        val gender: String,
        val github: String?,
        val googleplus: String?,
        val imageProfilURL: String?,
        val language: String?,
        val lastname: String?,
        val locale: String,
        val owner: Boolean,
        val phone: String?,
        val reviewer: Boolean,
        val roles: List<String>,
        val shortName: String,
        val social: String?,
        val tshirtSize: String,
        val twitter: String?,
        val twitterCount: Int? = null
        )

