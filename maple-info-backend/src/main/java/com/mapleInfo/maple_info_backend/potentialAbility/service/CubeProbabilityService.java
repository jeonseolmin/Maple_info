package com.mapleInfo.maple_info_backend.potentialAbility.service;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeProbabilityDto;
import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeProbability;
import com.mapleInfo.maple_info_backend.potentialAbility.repository.CubeProbabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CubeProbabilityService {

    private final CubeProbabilityRepository repository;

    // 크롤러에서 수집한 Dto 리스트를 DB Entity로 변환하여 저장
    @Transactional
    public void saveAllCrawledData(List<CubeProbabilityDto> dtoList) {
        List<CubeProbability> entities = dtoList.stream()
                .map(dto -> CubeProbability.builder()
                        .cubeType(dto.getCubeType())
                        .itemPart(dto.getItemPart())
                        .potentialTier(dto.getPotentialTier())
                        .optionName(dto.getOptionName())
                        .probability(dto.getProbability())
                        .build())
                .collect(Collectors.toList());

        repository.saveAll(entities);
        System.out.println("✅ JPA 저장 완료! " + entities.size() + "건 추가됨");
    }

    // 리액트로 옵션 목록 전달
    public List<String> getAvailableOptions(CubeType cubeType, String itemPart, String tier) {
        return repository.findAvailableOptions(cubeType, itemPart, tier);
    }
}