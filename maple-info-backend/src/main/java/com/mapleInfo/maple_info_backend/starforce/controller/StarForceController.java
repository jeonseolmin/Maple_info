package com.mapleInfo.maple_info_backend.starforce.controller;

import com.mapleInfo.maple_info_backend.starforce.service.StarForceCalculatorService;
import com.mapleInfo.maple_info_backend.starforce.dto.StarForceRequestDto;
import com.mapleInfo.maple_info_backend.starforce.dto.StarForceResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/starforce")
public class StarForceController {

    private final StarForceCalculatorService calculatorService;

    // Service 의존성 주입
    public StarForceController(StarForceCalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<StarForceResponseDto> calculateExpectedMeso(@RequestBody StarForceRequestDto requestDto) {

        // 1. Service에 계산 지시
        long expectedCost = calculatorService.calculateExpectedMeso(
                requestDto.getItemLevel(),
                requestDto.getStartStar(),
                requestDto.getTargetStar(),
                requestDto.getReplacementCost()
        );

        // 2. 응답 DTO 조립
        String section = requestDto.getStartStar() + "성 -> " + requestDto.getTargetStar() + "성";
        StarForceResponseDto responseDto = new StarForceResponseDto(
                requestDto.getItemLevel(),
                section,
                expectedCost,
                requestDto.getReplacementCost()
        );

        // 3. 프론트엔드로 성공(200 OK) 상태와 함께 결과 반환
        return ResponseEntity.ok(responseDto);
    }
}