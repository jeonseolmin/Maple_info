package com.mapleInfo.maple_info_backend.starforce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StarForceResponseDto {
    private int itemLevel;
    private String section;
    private long expectedMeso;
    private double destroyedCount;
    private List<ChartDataDto> chartData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartDataDto {
        private String costRange; // "100~110" (단위: 억)
        private int userCount;
    }
}