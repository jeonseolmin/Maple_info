package com.mapleInfo.maple_info_backend.potentialAbility.controller;

import com.mapleInfo.maple_info_backend.potentialAbility.service.CubeProbabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cubes")
@CrossOrigin(origins = "http://localhost:5173")
public class CubeProbabilityController {

    private final CubeProbabilityService service;

    public CubeProbabilityController(CubeProbabilityService service) {
        this.service = service;
    }

    @GetMapping("/probability")
    public ResponseEntity<Map<String, Object>> getProbability(
            @RequestParam String cubeType,
            @RequestParam String part,
            @RequestParam String tier,
            @RequestParam String option) {

        Map<String, Object> result = service.getProbabilityResult(cubeType, part, tier, option);
        return ResponseEntity.ok(result);
    }
}