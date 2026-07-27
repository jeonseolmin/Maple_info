package com.mapleInfo.maple_info_backend.potentialAbility.service;

import com.mapleInfo.maple_info_backend.potentialAbility.repository.CubeProbabilityRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CubeProbabilityService {

    private final CubeProbabilityRepository repository = new CubeProbabilityRepository();

    public Map<String, Object> getProbabilityResult(String cubeType, String itemPart, String potentialTier, String optionName) {
        Double probability = repository.findProbability(cubeType, itemPart, potentialTier, optionName);

        Map<String, Object> result = new HashMap<>();
        if (probability != null) {
            result.put("success", true);
            result.put("probability", probability);
        } else {
            result.put("success", false);
            result.put("message", "해당 조건의 옵션 확률을 찾을 수 없습니다.");
        }
        return result;
    }
}