package org.ilaborie.altcfp

data class ServerConfiguration(val port: Int = 8080)
data class BackendConfiguration(val url: String, val caching: Boolean = false)
