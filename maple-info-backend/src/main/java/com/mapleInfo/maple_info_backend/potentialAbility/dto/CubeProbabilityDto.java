package com.mapleInfo.maple_info_backend.potentialAbility.dto;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;

public class CubeProbabilityDto {
    private CubeType cubeType;       // 큐브 종류
    private String itemPart;         // 부위 (무기, 엠블렘 등)
    private String potentialTier;    // 등급 (레전드리, 유니크 등)
    private String optionName;       // 옵션명 (보공 40%, 마력 9% 등)
    private double probability;      // 확률 (1.2345)

    // 생성자
    public CubeProbabilityDto(CubeType cubeType, String itemPart, String potentialTier, String optionName, double probability) {
        this.cubeType = cubeType;
        this.itemPart = itemPart;
        this.potentialTier = potentialTier;
        this.optionName = optionName;
        this.probability = probability;
    }

    // Getter & Setter
    public CubeType getCubeType() {
        return cubeType;
    }

    public void setCubeType(CubeType cubeType) {
        this.cubeType = cubeType;
    }

    public String getItemPart() {
        return itemPart;
    }

    public void setItemPart(String itemPart) {
        this.itemPart = itemPart;
    }

    public String getPotentialTier() {
        return potentialTier;
    }

    public void setPotentialTier(String potentialTier) {
        this.potentialTier = potentialTier;
    }

    public String getOptionName() {
        return optionName;
    }

    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }
}
