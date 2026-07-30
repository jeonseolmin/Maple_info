package com.mapleInfo.maple_info_backend.starforce.service;

import com.mapleInfo.maple_info_backend.starforce.dto.StarForceRequestDto;
import com.mapleInfo.maple_info_backend.starforce.dto.StarForceResponseDto;
import com.mapleInfo.maple_info_backend.starforce.entity.StarForceLevel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class StarForceCalculatorService {

    private static final int SIMULATION_COUNT = 10000;

    public StarForceResponseDto simulateExpectedMeso(StarForceRequestDto request) {
        long totalMesoAll = 0;
        long totalDestroyAll = 0;

        Map<Long, Integer> costDistribution = new TreeMap<>();

        int itemLevel = request.getItemLevel();
        int startStar = request.getCurrentStar();
        int targetStar = request.getTargetStar();
        String event = request.getEvent();
        String mvp = request.getMvp();
        boolean useSafeguard = request.isSafeguard();

        for (int i = 0; i < SIMULATION_COUNT; i++) {
            long currentMeso = 0;
            long currentDestroy = 0;
            int currentStar = startStar;

            while (currentStar < targetStar) {
                StarForceLevel stat = getStarForceLevel(currentStar);

                long tryCost = stat.calculateCost(itemLevel);
                double pSuccess = stat.getSuccessRate();
                double pDestroy = stat.getDestroyRate();

                // 확률 수치 정규화 (예: 30.0 -> 0.3)
                if (pSuccess > 1.0) pSuccess /= 100.0;
                if (pDestroy > 1.0) pDestroy /= 100.0;

                // [할인 1] 비용 30% 할인 및 샤이닝
                if ("COST_THIRTY_DISCOUNT".equals(event) || "SHINING".equals(event)) {
                    tryCost = (long) (tryCost * 0.7);
                }

                // [할인 2] MVP 할인 (17성까지만 적용)
                if (currentStar <= 17) {
                    if ("SILVER".equals(mvp)) tryCost = (long) (tryCost * 0.97);
                    else if ("GOLD".equals(mvp)) tryCost = (long) (tryCost * 0.95);
                    else if ("DIAMOND".equals(mvp)) tryCost = (long) (tryCost * 0.90);
                }

                // [이벤트 1] 파괴 확률 30% 감소 (21성 이하)
                if ("DESTRUCTION_REDUCTION".equals(event) && currentStar <= 21) {
                    pDestroy *= 0.7;
                }

                // [이벤트 2] 샤이닝 스타포스 (25년 3월 개편 반영: 15, 16성 파괴 확률 30% 감소)
                if ("SHINING".equals(event) && (currentStar == 15 || currentStar == 16)) {
                    pDestroy *= 0.7;
                }

                // [옵션] 파괴 방지 (15~17성)
                boolean isSafeguardApplied = useSafeguard && currentStar >= 15 && currentStar <= 17;
                if (isSafeguardApplied) {
                    tryCost += stat.calculateCost(itemLevel); // 기본 강화 비용 100% 추가
                    pDestroy = 0.0;
                }

                // 메소 소모
                currentMeso += tryCost;
                double rand = Math.random();

                if (rand < pSuccess) {
                    // 성공
                    currentStar++;

                    if ("TEN_UNDER_ONE_PLUS_ONE".equals(event) && (currentStar - 1) <= 10) {
                        currentStar++;
                    }
                } else if (rand < pSuccess + pDestroy) {
                    // 파괴
                    currentDestroy++;
                    currentStar = 12; // 파괴 시 12성 복구
                } else {
                    // 실패 (25년 3월 패치 반영: 등급 하락 완전 삭제)
                    // 실패하더라도 currentStar는 깎이지 않고 그대로 유지됩니다.
                }
            }

            totalMesoAll += currentMeso;
            totalDestroyAll += currentDestroy;

            // 차트 데이터 수집 (10억 단위)
            long tenBillionBucket = currentMeso / 1000000000L;
            costDistribution.put(tenBillionBucket, costDistribution.getOrDefault(tenBillionBucket, 0) + 1);
        }

        List<StarForceResponseDto.ChartDataDto> chartDataList = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : costDistribution.entrySet()) {
            long startRange = entry.getKey() * 10;
            long endRange = startRange + 10;

            chartDataList.add(StarForceResponseDto.ChartDataDto.builder()
                    .costRange(startRange + "~" + endRange)
                    .userCount(entry.getValue())
                    .build());
        }

        return StarForceResponseDto.builder()
                .itemLevel(itemLevel)
                .section(startStar + "성 -> " + targetStar + "성")
                .expectedMeso(totalMesoAll / SIMULATION_COUNT)
                .destroyedCount((double) totalDestroyAll / SIMULATION_COUNT)
                .chartData(chartDataList)
                .build();
    }

    private StarForceLevel getStarForceLevel(int star) {
        for (StarForceLevel level : StarForceLevel.values()) {
            if (level.ordinal() == star) {
                return level;
            }
        }
        throw new IllegalArgumentException("지원하지 않는 스타포스 수치입니다.");
    }
}