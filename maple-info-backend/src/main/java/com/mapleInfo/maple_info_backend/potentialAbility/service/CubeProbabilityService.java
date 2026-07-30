package com.mapleInfo.maple_info_backend.potentialAbility.service;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeProbabilityDto;
import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeCalculateResponseDto;
import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeProbability;
import com.mapleInfo.maple_info_backend.potentialAbility.repository.CubeProbabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CubeProbabilityService {

    private final CubeProbabilityRepository repository;

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

    public List<String> getAvailableOptions(CubeType cubeType, String itemPart, String tier) {
        return repository.findAvailableOptions(cubeType, itemPart, tier);
    }

    // 전면 개편된 확률 및 기댓값 계산 로직
    public CubeCalculateResponseDto calculateExpectedCost(String cubeTypeStr, String itemPart, String tier, List<String> options, long cubePrice) {
        CubeType cubeType = CubeType.valueOf(cubeTypeStr.toUpperCase());

        // 1. 선택한 옵션이 3개가 안 될 경우, 빈 자리를 "ANY"(아무거나)로 채움
        List<String> targetOptions = new ArrayList<>(options);
        while (targetOptions.size() < 3) {
            targetOptions.add("ANY");
        }

        // 2. 3개 옵션의 고유한 조합(경우의 수) 구하기 (예: 12-9-12, 12-12-9 등)
        Set<List<String>> permutations = getUniquePermutations(targetOptions);

        double totalSumProbability = 0.0;

        // 3. 각 경우의 수(순열) 별로 확률을 곱해서 최종 확률에 더함
        for (List<String> perm : permutations) {
            double currentPermProb = 1.0;
            boolean isValidPerm = true;

            for (int line = 0; line < 3; line++) {
                String option = perm.get(line);
                if ("ANY".equals(option)) {
                    currentPermProb *= 1.0; // 아무거나 나와도 됨 (확률 100%)
                    continue;
                }

                List<Double> probs = repository.findProbabilities(cubeType, itemPart, tier, option);
                double lineProb = getLineProbability(probs, line); // 🌟 줄 번호에 맞는 정확한 확률 추출

                if (lineProb == 0.0) {
                    isValidPerm = false; // 이 줄에서는 뜰 수 없는 옵션 (예: 1번째 줄에 9% 옵션)
                    break;
                }
                // 확률을 소수점으로 변환하여 곱연산
                currentPermProb *= (lineProb / 100.0);
            }

            if (isValidPerm) {
                totalSumProbability += currentPermProb;
            }
        }

        long expectedCount = 0;
        long expectedMeso = 0;

        if (totalSumProbability > 0) {
            expectedCount = (long) Math.ceil(1.0 / totalSumProbability);
            expectedMeso = expectedCount * cubePrice;
        }

        // 화면에 보여주기 위해 다시 퍼센트로 변환 (%)
        double finalPercent = totalSumProbability * 100.0;

        return CubeCalculateResponseDto.builder()
                .totalProbability(finalPercent)
                .expectedCubeCount(expectedCount)
                .expectedMeso(expectedMeso)
                .build();
    }

    // 핵심 방어 로직: DB에 저장된 데이터 갯수를 보고 몇 번째 줄 확률인지 추론
    private double getLineProbability(List<Double> probs, int lineIndex) {
        if (probs == null || probs.isEmpty()) return 0.0;

        if (probs.size() >= 3) {
            return probs.get(lineIndex); // 1, 2, 3번째 줄 데이터가 다 있는 경우 (예: 공 12%)
        } else if (probs.size() == 2) {
            // 이탈 옵션 (1번째 줄에는 절대 안 뜨고 2, 3번째 줄에만 뜨는 옵션. 예: 공 9%)
            if (lineIndex == 0) return 0.0;
            return probs.get(lineIndex - 1);
        } else {
            return probs.get(0); // 1개만 있는 경우는 그대로 반환 (통상적인 경우 아님)
        }
    }

    // 3개 요소의 고유 순열(경우의 수)을 구하는 헬퍼 메서드
    private Set<List<String>> getUniquePermutations(List<String> list) {
        Set<List<String>> result = new HashSet<>();
        int[][] indices = {
                {0, 1, 2}, {0, 2, 1},
                {1, 0, 2}, {1, 2, 0},
                {2, 0, 1}, {2, 1, 0}
        };
        for (int[] arr : indices) {
            result.add(Arrays.asList(list.get(arr[0]), list.get(arr[1]), list.get(arr[2])));
        }
        return result;
    }
}