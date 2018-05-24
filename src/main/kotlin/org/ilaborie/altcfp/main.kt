package org.ilaborie.altcfp

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.benmanes.caffeine.cache.Caffeine
import com.typesafe.config.ConfigFactory
import io.github.config4k.extract
import io.javalin.Javalin
import io.javalin.translator.json.JavalinJacksonPlugin
import org.ilaborie.altcfp.models.TalkRate
import org.ilaborie.altcfp.models.TalksResponse
import org.ilaborie.altcfp.service.Api
import org.ilaborie.altcfp.service.Cachealbe
import org.ilaborie.altcfp.service.createApi
import java.util.concurrent.TimeUnit.MINUTES


fun main(args: Array<String>) {
    // Config
    val config = ConfigFactory.load()
    val serverConfig = config.extract<ServerConfiguration>("server")
    val backendConfiguration = config.extract<BackendConfiguration>("backend")

    // Start server
    server(serverConfig, backendConfiguration)
        .start()
}

fun server(config: ServerConfiguration, backendConfiguration: BackendConfiguration): Javalin {
    JavalinJacksonPlugin.configure(jacksonObjectMapper())

    val apiCache = Caffeine.newBuilder()
        .maximumSize(5)
        .expireAfterWrite(15, MINUTES)
        .refreshAfterWrite(15, MINUTES)
        .build<String, Api> { token ->
            createApi(backendConfiguration, token)
        }

    return Javalin.create().apply {
        port(config.port)
        enableDynamicGzip()
        enableStandardRequestLogging()
        disableStartupBanner()
        defaultContentType("application/json")
        defaultCharacterEncoding("UTF-8")
        enableRouteOverview("/help")
        enableCorsForAllOrigins()

        enableStaticFiles("/public")

        exception(Exception::class.java) { e, _ -> e.printStackTrace() }
        error(404) { ctx -> ctx.json("not found") }

        routes {
            get("api/talks") {
                val token = it.header("Token")
                if (token != null) {
                    val api = apiCache.get(token)
                    if (it.queryParam("clearCache") != null && api is Cachealbe) {
                        api.clearCache()
                    }
                    val talks = api!!.findTalks()
                    it.json(TalksResponse(api.me, talks))
                } else it.status(400).result("Missing 'Token' header")
            }

            post("api/talks/rate/:id") {
                val token = it.header("Token")
                if (token != null) {
                    val id = it.param("id")
                    if (id != null) {
                        val api = apiCache.get(token)
                        if (it.queryParam("clearCache") != null && api is Cachealbe) {
                            api.clearCache()
                        }
                        val rate = it.bodyAsClass(TalkRate::class.java)
                        val talk = api!!.rateTalk(id.toLong(), rate)
                        it.json(talk)
                    } else it.status(400).result("Missing 'id' path param")
                } else it.status(400).result("Missing 'Token' header")
            }
        }
    }
}

