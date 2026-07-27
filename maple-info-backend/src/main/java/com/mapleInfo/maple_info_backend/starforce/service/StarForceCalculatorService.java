package com.mapleInfo.maple_info_backend.starforce.service;

import com.mapleInfo.maple_info_backend.starforce.entity.StarForceLevel;
import org.springframework.stereotype.Service;

@Service
public class StarForceCalculatorService {

    /**
     * 특정 장비를 startStar 에서 targetStar 까지 보내는 데 드는 총 기댓값(메소)을 계산합니다.
     * @param itemLevel 장비 레벨 (예: 150, 160)
     * @param startStar 현재 별 개수
     * @param targetStar 목표 별 개수
     * @param replacementCost 장비 파괴 시 복구에 필요한 '노작' 장비 가격
     */
    public long calculateExpectedMeso(int itemLevel, int startStar, int targetStar, long replacementCost) {
        long totalExpectedMeso = 0;

        // 시작 별부터 목표 별 바로 전까지 반복해서 기댓값을 누적
        for (int currentStar = startStar; currentStar < targetStar; currentStar++) {
            totalExpectedMeso += getExpectedCostForOneStep(itemLevel, currentStar, replacementCost);
        }

        return totalExpectedMeso;
    }

    // 딱 '1성' 올리는데 필요한 기댓값 수학적 연산
    private long getExpectedCostForOneStep(int itemLevel, int currentStar, long replacementCost) {
        StarForceLevel stat = getStarForceLevel(currentStar);

        long tryCost = stat.calculateCost(itemLevel); // 1회 시도 비용
        double pSuccess = stat.getSuccessRate();
        double pDestroy = stat.getDestroyRate();

        if (pDestroy == 0.0) {
            // 파괴가 없는 구간: (1회 비용) / 성공확률
            return (long) (tryCost / pSuccess);
        } else {
            // 파괴가 있는 구간:
            // 파괴 시 12성으로 복구되므로, 12성부터 현재 별(currentStar)까지 다시 오는 기댓값을 계산해야 함
            long recoveryToCurrentCost = 0;
            if (currentStar > 12) {
                recoveryToCurrentCost = calculateExpectedMeso(itemLevel, 12, currentStar, replacementCost);
            }

            // 수식: [1회 비용 + 파괴확률 * (노작값 + 12성에서 복구하는 비용)] / 성공확률
            double expectedCost = (tryCost + pDestroy * (replacementCost + recoveryToCurrentCost)) / pSuccess;
            return (long) expectedCost;
        }
    }

    // 현재 별에 맞는 Enum 데이터를 가져오는 유틸리티 메서드
    private StarForceLevel getStarForceLevel(int star) {
        for (StarForceLevel level : StarForceLevel.values()) {
            if (level.ordinal() == star) {
                return level;
            }
        }
        throw new IllegalArgumentException("지원하지 않는 스타포스 수치입니다.");
    }
}