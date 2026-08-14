package com.mapleInfo.maple_info_backend.boss.repository;

import com.mapleInfo.maple_info_backend.boss.entity.Boss;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BossRepository extends JpaRepository<Boss, Long> {
}