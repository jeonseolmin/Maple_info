package com.mapleInfo.maple_info_backend.symbol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SymbolCalcResponse {
    private int totalRequired;    // 졸업까지 필요한 총 심볼 개수
    private int accumulated;      // 현재까지 누적해서 먹은 총 심볼 개수
    private int remainingSymbols; // 앞으로 더 캐야 할 심볼 개수
    private int remainingDays;    // 졸업까지 남은 일수 (D-Day)
    private double progressRate;  // 졸업 진행도 (%)
}