package com.mapleInfo.maple_info_backend.security.config;

import com.mapleInfo.maple_info_backend.security.handler.CustomAccessDeniedHandler;
import com.mapleInfo.maple_info_backend.security.handler.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        return http
                .authorizeHttpRequests(auth -> auth

                        // 요청 방식과 관계없이 공개
                        .requestMatchers(
                                SecurityUrls.PUBLIC_URLS
                        ).permitAll()

                        // GET 요청일 때만 공개
                        .requestMatchers(
                                HttpMethod.GET,
                                SecurityUrls.PUBLIC_GET_URLS
                        ).permitAll()

                        // 관리자만 접근
                        .requestMatchers(
                                SecurityUrls.ADMIN_URLS
                        ).hasRole("ADMIN")

                        // 위에서 허용하지 않은 모든 요청은 로그인 필요
                        .anyRequest().authenticated()
                )

                .cors(Customizer.withDefaults())

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                .build();
    }
}