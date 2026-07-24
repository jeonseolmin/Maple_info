package com.mapleInfo.maple_info_backend.mapleCharacter.entity;


import com.mapleInfo.maple_info_backend.common.entity.BaseEntity;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.NexonCharacterBasicResponse;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(columnDefinition = "TEXT")
    private String characterImage;

    private LocalDateTime syncedAt;

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