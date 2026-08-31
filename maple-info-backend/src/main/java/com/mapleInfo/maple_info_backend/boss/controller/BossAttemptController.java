package com.mapleInfo.maple_info_backend.boss.controller;

import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptDetailResponse;
import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptRequest;
import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptResponse;
import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptUpdateRequest;
import com.mapleInfo.maple_info_backend.boss.service.BossAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/boss-attempts")
@RequiredArgsConstructor
public class BossAttemptController {

    private final BossAttemptService bossAttemptService;

    @PostMapping
    public ResponseEntity<BossAttemptResponse> createAttempt(
            @RequestBody BossAttemptRequest request
    ) {

        return ResponseEntity.ok(
                bossAttemptService.createAttempt(request)
        );
    }

    // 전체 기록
    @GetMapping
    public ResponseEntity<List<BossAttemptDetailResponse>>
    getAllAttempts() {

        return ResponseEntity.ok(
                bossAttemptService.getAllAttempts()
        );
    }

    // 단일 기록
    @GetMapping("/{attemptId}")
    public ResponseEntity<BossAttemptDetailResponse> getAttempt(
            @PathVariable Long attemptId
    ) {

        return ResponseEntity.ok(
                bossAttemptService.getAttempt(attemptId)
        );
    }

    // 특정 보스
    @GetMapping("/boss/{bossId}")
    public ResponseEntity<List<BossAttemptDetailResponse>>
    getByBoss(
            @PathVariable Long bossId
    ) {

        return ResponseEntity.ok(
                bossAttemptService.getAttemptsByBoss(bossId)
        );
    }

    // 특정 직업
    @GetMapping("/class/{characterClass}")
    public ResponseEntity<List<BossAttemptDetailResponse>>
    getByClass(
            @PathVariable String characterClass
    ) {

        return ResponseEntity.ok(
                bossAttemptService.getAttemptsByClass(characterClass)
        );
    }

    // 특정 보스 + 직업
    @GetMapping("/search")
    public ResponseEntity<List<BossAttemptDetailResponse>>
    search(
            @RequestParam Long bossId,
            @RequestParam String characterClass
    ) {

        return ResponseEntity.ok(
                bossAttemptService.getAttempts(
                        bossId,
                        characterClass
                )
        );
    }

    // 특정 보스 + 배율 범위
    @GetMapping("/ratio")
    public ResponseEntity<List<BossAttemptDetailResponse>>
    searchByRatio(
            @RequestParam Long bossId,
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max
    ) {

        return ResponseEntity.ok(
                bossAttemptService.getAttemptsByRatio(
                        bossId,
                        min,
                        max
                )
        );
    }

    @PutMapping("/{attemptId}")
    public ResponseEntity<Void> updateAttempt(
            @PathVariable Long attemptId,
            @RequestBody BossAttemptUpdateRequest request
    ) {

        bossAttemptService.updateAttempt(
                attemptId,
                request
        );

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{attemptId}")
    public ResponseEntity<Void> deleteAttempt(
            @PathVariable Long attemptId
    ) {

        bossAttemptService.deleteAttempt(attemptId);

        return ResponseEntity.noContent().build();
    }
}