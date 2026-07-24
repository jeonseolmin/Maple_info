package com.mapleInfo.maple_info_backend.starforce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StarForceResponseDto {
    private int itemLevel;
    private String section;        // 예: "15성 -> 22성"
    private long expectedMeso;     // 예: 15000000000 (총 소모 기댓값)
    private long replacementCost;  // 참고용으로 다시 내려줌
}