package com.mapleInfo.maple_info_backend.potentialAbility.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CubeCalculateResponseDto {
    private double totalProbability; // 합산 확률 (%)
    private long expectedCubeCount;  // 예상 소모 큐브 개수
    private long expectedMeso;       // 예상 소모 메소
}