package com.mapleInfo.maple_info_backend.bossinfo.controller;

import com.mapleInfo.maple_info_backend.bossinfo.entity.BossInfo;
import com.mapleInfo.maple_info_backend.bossinfo.service.BossInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bossinfo")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BossInfoController {

    private final BossInfoService bossInfoService;

    // 리액트에서 데이터를 요청할 엔드포인트
    @GetMapping("/data")
    public ResponseEntity<List<BossInfo>> getBossInfoData() {
        List<BossInfo> data = bossInfoService.getAllBossInfo();
        return ResponseEntity.ok(data);
    }
}