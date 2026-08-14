package com.mapleInfo.maple_info_backend.boss.repository;

import com.mapleInfo.maple_info_backend.boss.entity.BossClearLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BossClearLogRepository extends JpaRepository<BossClearLog, Long> {
    // 프론트엔드에 데이터를 넘겨주기 위해 특정 캐릭터의 클리어 기록을 몽땅 찾아오는 메서드
    List<BossClearLog> findAllByMyCharacterId(Long characterId);
}