package com.mapleInfo.maple_info_backend.security.config;

public final class SecurityUrls {
    private SecurityUrls() {
    }

    public static final String[] PUBLIC_URLS = {
            "/error",
            "/oauth2/**",
            "/login/oauth2/**",
            "/api/auth/**",
            "/api/starforce/**",
            "/api/cube/**",
            "/api/exp/**",
            "/api/boss/**",
            "/api/bossinfo/**"

    };

    public static final String[] PUBLIC_GET_URLS = {
            "/api/events",
            "/api/events/**",
            "/api/characters/search",
            "/api/characters/**"
    };

    public static final String[] ADMIN_URLS = {
            "/api/admin/**"
    };
}
