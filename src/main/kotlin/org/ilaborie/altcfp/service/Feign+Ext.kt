package org.ilaborie.altcfp.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import feign.Feign
import feign.Logger
import feign.jackson.JacksonDecoder
import feign.jackson.JacksonEncoder
import feign.slf4j.Slf4jLogger


inline fun <reified T> Feign.Builder.asDefault(url: String,
                                               mapper: ObjectMapper = jacksonObjectMapper()): T =
    this.encoder(JacksonEncoder(mapper))
        .decoder(JacksonDecoder(mapper))
        .logLevel(Logger.Level.BASIC)
        .logger(Slf4jLogger())
        .target(T::class.java, url)


