package com.mapleInfo.maple_info_backend.potentialAbility.controller;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import com.mapleInfo.maple_info_backend.potentialAbility.service.CubeProbabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cube")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 리액트 허용
public class CubeProbabilityController {

    private final CubeProbabilityService cubeService;

    // 프론트엔드(React)에서 옵션 리스트를 요청하는 API
    @GetMapping("/options")
    public ResponseEntity<List<String>> getOptions(
            // 💡 1. 리액트에서 넘어오는 값은 일단 String으로 안전하게 받습니다.
            @RequestParam("cubeType") String cubeTypeStr,
            @RequestParam("partName") String partName,
            @RequestParam("tier") String tier
    ) {
        // 💡 2. 받은 문자열("RED" 등)을 CubeType(Enum)으로 변환합니다.
        CubeType cubeType = CubeType.valueOf(cubeTypeStr.toUpperCase());

        List<String> options = cubeService.getAvailableOptions(cubeType, partName, tier);
        return ResponseEntity.ok(options);
    }
}