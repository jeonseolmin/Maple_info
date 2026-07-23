package com.mapleInfo.maple_info_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MapleInfoBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MapleInfoBackendApplication.class, args);
	}

}
