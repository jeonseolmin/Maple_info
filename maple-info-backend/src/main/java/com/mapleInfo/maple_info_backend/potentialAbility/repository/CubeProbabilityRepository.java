package com.mapleInfo.maple_info_backend.potentialAbility.repository;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeProbability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CubeProbabilityRepository extends JpaRepository<CubeProbability, Long> {

    @Query("SELECT DISTINCT c.optionName FROM CubeProbability c " +
            "WHERE c.cubeType = :cubeType AND c.itemPart = :itemPart AND c.potentialTier = :tier " +
            "AND c.optionName NOT LIKE '%.%' " + // 핵심: 메이플 옵션에는 소수점(.)이 절대 안 들어갑니다! 0.7000% 같은 확률 데이터 원천 차단
            "AND c.optionName NOT LIKE '%레어%' " + // 앞뒤에 공백이나 특수문자가 섞여 있어도 무조건 차단
            "AND c.optionName NOT LIKE '%에픽%' " +
            "AND c.optionName NOT LIKE '%유니크%' " +
            "AND c.optionName NOT LIKE '%레전드리%' " +
            "ORDER BY c.optionName ASC")
    List<String> findAvailableOptions(@Param("cubeType") CubeType cubeType,
                                      @Param("itemPart") String itemPart,
                                      @Param("tier") String tier);

    @Query("SELECT c.probability FROM CubeProbability c " +
            "WHERE c.cubeType = :cubeType AND c.itemPart = :itemPart AND c.potentialTier = :tier AND c.optionName = :optionName")
    List<Double> findProbabilities(@Param("cubeType") CubeType cubeType,
                                   @Param("itemPart") String itemPart,
                                   @Param("tier") String tier,
                                   @Param("optionName") String optionName);
}