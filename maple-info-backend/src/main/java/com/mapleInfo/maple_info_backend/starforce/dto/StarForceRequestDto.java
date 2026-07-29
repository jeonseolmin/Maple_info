package com.mapleInfo.maple_info_backend.starforce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StarForceRequestDto {
    private int itemLevel;
    private int currentStar;
    private int targetStar;
    private String spareCost;
    private String mvp;
    private boolean safeguard;
    private String event;
}