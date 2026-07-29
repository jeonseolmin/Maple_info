package com.mapleInfo.maple_info_backend.starforce.controller;

import com.mapleInfo.maple_info_backend.starforce.dto.StarForceRequestDto;
import com.mapleInfo.maple_info_backend.starforce.dto.StarForceResponseDto;
import com.mapleInfo.maple_info_backend.starforce.service.StarForceCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/starforce")
@RequiredArgsConstructor // 생성자 주입을 깔끔하게 해줍니다
public class StarForceController {

    private final StarForceCalculatorService calculatorService;

    // 프론트엔드 요청 주소와 일치하도록 /simulate 로 변경
    @PostMapping("/simulate")
    public ResponseEntity<StarForceResponseDto> simulateExpectedMeso(@RequestBody StarForceRequestDto requestDto) {

        // 시뮬레이션 서비스 실행
        StarForceResponseDto responseDto = calculatorService.simulateExpectedMeso(requestDto);

        // 프론트엔드로 성공(200 OK) 상태와 함께 결과 반환
        return ResponseEntity.ok(responseDto);
    }
}