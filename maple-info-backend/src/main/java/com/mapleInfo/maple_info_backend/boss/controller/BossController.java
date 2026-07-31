package com.mapleInfo.maple_info_backend.boss.controller;

import com.mapleInfo.maple_info_backend.boss.entity.MyCharacter;
import com.mapleInfo.maple_info_backend.boss.service.BossService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/boss")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BossController {

    private final BossService bossService;

    // 화면 렌더링에 필요한 통합 데이터 조회 API
    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getBossData() {
        return ResponseEntity.ok(bossService.getWeeklyBossData());
    }

    // 내 캐릭터 추가 API
    @PostMapping("/character")
    public ResponseEntity<MyCharacter> addCharacter(@RequestBody Map<String, String> request) {
        String name = request.get("characterName");
        String job = request.get("job");
        return ResponseEntity.ok(bossService.addCharacter(name, job));
    }

    // 보스 클리어 체크/해제 API
    @PostMapping("/update")
    public ResponseEntity<Void> updateClear(@RequestBody Map<String, Object> request) {
        Long characterId = Long.valueOf(request.get("characterId").toString());
        Long bossId = Long.valueOf(request.get("bossId").toString());
        boolean isCleared = (Boolean) request.get("isCleared");
        int partySize = Integer.parseInt(request.get("partySize").toString());

        bossService.updateBossClear(characterId, bossId, isCleared, partySize);
        return ResponseEntity.ok().build();
    }
}