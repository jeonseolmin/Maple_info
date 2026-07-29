package com.mapleInfo.maple_info_backend.mapleCharacter.entity;


import com.mapleInfo.maple_info_backend.common.entity.BaseEntity;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonCharacterBasicResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.popularity.NexonCharacterPopularityResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionResponse;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "maple_characters",
        indexes = {
                @Index(
                        name = "idx_character_name",
                        columnList = "character_name"
                ),
                @Index(
                        name = "idx_ocid",
                        columnList = "ocid",
                        unique = true
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class MapleCharacter extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String ocid;

    @Column(name = "character_name", nullable = false, length = 30)
    private String characterName;

    @Column(nullable = false, length = 20)
    private String worldName;

    @Column(nullable = false, length = 50)
    private String characterClass;

    @Column(length = 20)
    private String characterClassLevel;

    @Column(nullable = false)
    private Integer level;

    private Long exp;

    private Double expRate;

    @Column(length = 50)
    private String guildName;

    @Column(name = "union_level")
    private Integer unionLevel;

    @Column(name = "union_grade", length = 50)
    private String unionGrade;

    @Column(name = "popularity")
    private Long popularity;

    @Column(columnDefinition = "TEXT")
    private String characterImage;

    @Column(name = "overall_ranking")
    private Integer overallRanking;

    @Column(name = "world_ranking")
    private Integer worldRanking;

    @Column(name = "class_ranking")
    private Integer classRanking;

    @Column(name = "ranking_date")
    private LocalDate rankingDate;

    @Column(name = "ranking_synced_at")
    private LocalDateTime rankingSyncedAt;

    private LocalDateTime syncedAt;


    public void updateRanking(
            Integer overallRanking,
            Integer worldRanking,
            Integer classRanking,
            LocalDate rankingDate
    ) {
        this.overallRanking = overallRanking;
        this.worldRanking = worldRanking;
        this.classRanking = classRanking;
        this.rankingDate = rankingDate;
        this.rankingSyncedAt = LocalDateTime.now();
    }

    public void updateUnionInfo(NexonUnionResponse response) {
        if (response == null) {
            return;
        }

        this.unionLevel = response.unionLevel();
        this.unionGrade = response.unionGrade();
    }

    public void updatePopularity(
            NexonCharacterPopularityResponse response
    ) {
        if (response == null) {
            return;
        }

        this.popularity = response.popularity();
    }

    public void markSynced() {
        this.syncedAt = LocalDateTime.now();
    }

    public void updateBasicInfo(NexonCharacterBasicResponse basic) {
        this.characterName = basic.characterName();
        this.worldName = basic.worldName();
        this.characterClass = basic.characterClass();
        this.characterClassLevel = basic.characterClassLevel();
        this.level = basic.characterLevel();
        this.exp = basic.characterExp();
        this.expRate = parseExpRate(basic.characterExpRate());
        this.guildName = basic.characterGuildName();
        this.characterImage = basic.characterImage();
        this.syncedAt = LocalDateTime.now();
    }

    private Double parseExpRate(String expRate) {
        if (expRate == null || expRate.isBlank()) {
            return null;
        }

        return Double.parseDouble(expRate.replace("%", ""));
    }
}