package com.mapleInfo.maple_info_backend.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class NexonApiConfig {

    @Bean
    public RestClient nexonRestClient(
            @Value("${nexon.api.url}") String baseUrl,
            @Value("${nexon.api.key}") String apiKey
    ) {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-nxopen-api-key", apiKey.trim())
                .build();
    }
}