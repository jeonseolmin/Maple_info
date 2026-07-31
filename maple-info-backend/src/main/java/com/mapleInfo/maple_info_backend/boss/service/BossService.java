package com.mapleInfo.maple_info_backend.boss.service;

import com.mapleInfo.maple_info_backend.boss.entity.Boss;
import com.mapleInfo.maple_info_backend.boss.entity.BossClearLog;
import com.mapleInfo.maple_info_backend.boss.entity.MyCharacter;
import com.mapleInfo.maple_info_backend.boss.repository.BossClearLogRepository;
import com.mapleInfo.maple_info_backend.boss.repository.BossRepository;
import com.mapleInfo.maple_info_backend.boss.repository.MyCharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BossService {

    private final BossRepository bossRepository;
    private final MyCharacterRepository myCharacterRepository;
    private final BossClearLogRepository bossClearLogRepository;

    // 1. 캐릭터 추가
    @Transactional
    public MyCharacter addCharacter(String characterName, String job) {
        MyCharacter newCharacter = MyCharacter.builder()
                .characterName(characterName)
                .job(job)
                .build();
        return myCharacterRepository.save(newCharacter);
    }

    // 2. 프론트엔드가 화면을 그리기 편하게 모든 데이터를 한 번에 포장해서 전달
    // BossService.java 내부

    @Transactional(readOnly = true)
    public Map<String, Object> getWeeklyBossData() {
        List<Boss> allBosses = bossRepository.findAll();
        List<MyCharacter> allCharacters = myCharacterRepository.findAll();
        List<BossClearLog> allLogs = bossClearLogRepository.findAll();

        // 🌟 수정됨: Map<캐릭터ID, Map<보스ID, 파티인원수>> 형태로 포장
        Map<Long, Map<Long, Integer>> characterClearedBossMap = new HashMap<>();
        for (BossClearLog log : allLogs) {
            Long charId = log.getMyCharacter().getId();
            Long bossId = log.getBoss().getId();
            Integer partySize = log.getPartySize();

            characterClearedBossMap
                    .computeIfAbsent(charId, k -> new HashMap<>())
                    .put(bossId, partySize);
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("bosses", allBosses);
        responseData.put("characters", allCharacters);
        responseData.put("clearLogs", characterClearedBossMap);

        return responseData;
    }

    // 🌟 수정됨: 파티 인원수 업데이트 기능 추가 및 로직 통합
    @Transactional
    public void updateBossClear(Long characterId, Long bossId, boolean isCleared, int partySize) {
        MyCharacter character = myCharacterRepository.findById(characterId).orElseThrow();
        Boss boss = bossRepository.findById(bossId).orElseThrow();

        Optional<BossClearLog> existingLog = bossClearLogRepository.findAll().stream()
                .filter(log -> log.getMyCharacter().getId().equals(characterId) && log.getBoss().getId().equals(bossId))
                .findFirst();

        if (!isCleared) {
            // 체크 해제 시 기록 삭제
            existingLog.ifPresent(bossClearLogRepository::delete);
        } else {
            if (existingLog.isPresent()) {
                // 이미 있는데 파티 인원만 바꾼 경우
                existingLog.get().updatePartySize(partySize);
            } else {
                // 새로 체크한 경우 (새로 저장)
                BossClearLog newLog = BossClearLog.builder()
                        .myCharacter(character)
                        .boss(boss)
                        .clearedAt(LocalDateTime.now())
                        .partySize(partySize)
                        .build();
                bossClearLogRepository.save(newLog);
            }
        }
    }
}