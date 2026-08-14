package com.mapleInfo.maple_info_backend.bossinfo.repository;

import com.mapleInfo.maple_info_backend.bossinfo.entity.BossInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BossInfoRepository extends JpaRepository<BossInfo, Long> {
}