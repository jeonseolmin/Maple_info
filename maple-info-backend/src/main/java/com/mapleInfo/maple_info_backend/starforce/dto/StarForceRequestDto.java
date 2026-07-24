package com.mapleInfo.maple_info_backend.starforce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StarForceRequestDto {
    private int itemLevel;        // 예: 160
    private int startStar;        // 예: 15
    private int targetStar;       // 예: 22
    private long replacementCost; // 예: 500000000 (5억 메소, 노작값)
}