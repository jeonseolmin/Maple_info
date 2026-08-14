package com.mapleInfo.maple_info_backend.symbol.service;

import com.mapleInfo.maple_info_backend.symbol.dto.SymbolCalcRequest;
import com.mapleInfo.maple_info_backend.symbol.dto.SymbolCalcResponse;
import org.springframework.stereotype.Service;

@Service
public class SymbolService {

    // 아케인 심볼 최대 레벨 (20) 기준 총 요구량
    private static final int MAX_ARCANE_TOTAL = 2679;
    // 어센틱 심볼 최대 레벨 (11) 기준 총 요구량
    private static final int MAX_AUTHENTIC_TOTAL = 4565;

    public SymbolCalcResponse calculateGraduation(SymbolCalcRequest request) {
        boolean isArcane = "ARC".equalsIgnoreCase(request.getType());
        int totalRequired = isArcane ? MAX_ARCANE_TOTAL : MAX_AUTHENTIC_TOTAL;
        int maxLevel = isArcane ? 20 : 11;

        int accumulated = 0;

        // 1. 1레벨부터 (현재 레벨 - 1)까지 먹었던 심볼 누적치 계산 (수학 공식 활용)
        for (int i = 1; i < request.getCurrentLevel() && i < maxLevel; i++) {
            if (isArcane) {
                accumulated += (i * i + 11);
            } else {
                accumulated += (9 * i * i + 20);
            }
        }

        // 2. 현재 보유 중인 개수 합산
        accumulated += request.getCurrentCount();

        // 3. 남은 심볼 개수 및 남은 일수 계산
        int remainingSymbols = Math.max(0, totalRequired - accumulated);
        // 소수점 올림 처리하여 정확한 남은 '일수' 계산
        int remainingDays = request.getDailyYield() > 0
                ? (int) Math.ceil((double) remainingSymbols / request.getDailyYield())
                : 0;

        // 4. 진행도(%) 계산 (소수점 둘째 자리까지 표시하기 위한 처리)
        double progressRate = Math.min(100.0, ((double) accumulated / totalRequired) * 100);
        progressRate = Math.round(progressRate * 100.0) / 100.0;

        return SymbolCalcResponse.builder()
                .totalRequired(totalRequired)
                .accumulated(accumulated)
                .remainingSymbols(remainingSymbols)
                .remainingDays(remainingDays)
                .progressRate(progressRate)
                .build();
    }
}