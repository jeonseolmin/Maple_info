package com.mapleInfo.maple_info_backend.potentialAbility.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CubeCalculateRequestDto {
    private String cubeType;
    private String itemPart;
    private String tier;
    private List<String> selectedOptions; // 사용자가 선택한 옵션들
    private long cubePrice; // 큐브 1개당 가격 (메소)
}