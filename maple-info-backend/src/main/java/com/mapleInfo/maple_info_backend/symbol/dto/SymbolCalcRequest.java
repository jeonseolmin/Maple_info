package com.mapleInfo.maple_info_backend.symbol.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SymbolCalcRequest {
    private String type; // "ARC" (아케인) 또는 "AUT" (어센틱)
    private int currentLevel; // 현재 심볼 레벨
    private int currentCount; // 현재 보유 중인 심볼 개수
    private int dailyYield;   // 하루에 얻을 수 있는 심볼 개수 (일퀘 + 미니게임 등)
}