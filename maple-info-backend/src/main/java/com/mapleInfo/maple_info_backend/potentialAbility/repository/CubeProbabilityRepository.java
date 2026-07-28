package com.mapleInfo.maple_info_backend.potentialAbility.repository;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeProbability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CubeProbabilityRepository extends JpaRepository<CubeProbability, Long> {

    // 1. 프론트엔드에 전달할 중복 없는 옵션 목록 조회
    @Query("SELECT DISTINCT c.optionName FROM CubeProbability c " +
            "WHERE c.cubeType = :cubeType AND c.itemPart = :itemPart AND c.potentialTier = :tier " +
            "ORDER BY c.optionName ASC")
    List<String> findAvailableOptions(@Param("cubeType") CubeType cubeType,
                                      @Param("itemPart") String itemPart,
                                      @Param("tier") String tier);

    // 2. 확률 계산 시 단일 옵션 확률 조회
    @Query("SELECT c.probability FROM CubeProbability c " +
            "WHERE c.cubeType = :cubeType AND c.itemPart = :itemPart AND c.potentialTier = :tier AND c.optionName = :optionName")
    Double findProbability(@Param("cubeType") CubeType cubeType,
                           @Param("itemPart") String itemPart,
                           @Param("tier") String tier,
                           @Param("optionName") String optionName);
}