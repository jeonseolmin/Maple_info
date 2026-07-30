package com.mapleInfo.maple_info_backend.exp.controller;

import com.mapleInfo.maple_info_backend.exp.entity.LevelExp;
import com.mapleInfo.maple_info_backend.exp.repository.LevelExpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exp")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ExpController {

    private final LevelExpRepository levelExpRepository;

    // 프론트엔드에서 전체 경험치 표를 요청하는 API
    @GetMapping("/table")
    public ResponseEntity<List<LevelExp>> getExpTable() {
        List<LevelExp> expTable = levelExpRepository.findAll();
        return ResponseEntity.ok(expTable);
    }
}