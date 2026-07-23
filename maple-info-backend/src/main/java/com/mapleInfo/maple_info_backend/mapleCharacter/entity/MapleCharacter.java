package com.mapleInfo.maple_info_backend.mapleCharacter.entity;


import com.mapleInfo.maple_info_backend.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "maple_characters",
        indexes = {
                @Index(name = "idx_character_name", columnList = "character_name"),
                @Index(name = "idx_ocid", columnList = "ocid", unique = true)
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

    /**
     * 넥슨 API OCID
     */
    @Column(nullable = false, unique = true, length = 100)
    private String ocid;

    /**
     * 캐릭터명
     */
    @Column(name = "character_name", nullable = false, length = 30)
    private String characterName;

    /**
     * 월드
     */
    @Column(nullable = false, length = 20)
    private String worldName;

    /**
     * 직업
     */
    @Column(nullable = false, length = 50)
    private String characterClass;

    /**
     * 전직
     */
    @Column(length = 50)
    private String subClass;

    /**
     * 레벨
     */
    @Column(nullable = false)
    private Integer level;

    /**
     * 경험치
     */
    private Long exp;

    /**
     * 경험치 퍼센트
     */
    private Double expRate;

    /**
     * 길드
     */
    @Column(length = 50)
    private String guildName;

    /**
     * 유니온 레벨
     */
    private Integer unionLevel;

    /**
     * 전투력
     */
    private Long combatPower;

    /**
     * 이미지 URL
     */
    @Column(length = 500)
    private String characterImage;

    /**
     * 마지막 동기화
     */
    private LocalDateTime syncedAt;

    public void updateCharacter(
            String characterName,
            String worldName,
            String characterClass,
            String subClass,
            Integer level,
            Long exp,
            Double expRate,
            String guildName,
            Integer unionLevel,
            Long combatPower,
            String characterImage
    ) {
        this.characterName = characterName;
        this.worldName = worldName;
        this.characterClass = characterClass;
        this.subClass = subClass;
        this.level = level;
        this.exp = exp;
        this.expRate = expRate;
        this.guildName = guildName;
        this.unionLevel = unionLevel;
        this.combatPower = combatPower;
        this.characterImage = characterImage;
        this.syncedAt = LocalDateTime.now();
    }
}