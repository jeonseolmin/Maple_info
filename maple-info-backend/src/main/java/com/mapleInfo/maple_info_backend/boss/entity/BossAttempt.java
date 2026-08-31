package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "boss_attempt",
        indexes = {
                @Index(name = "idx_boss_attempt_boss", columnList = "boss_id"),
                @Index(name = "idx_boss_attempt_class", columnList = "character_class"),
                @Index(name = "idx_boss_attempt_recorded_at", columnList = "recorded_at")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BossAttempt {

    public enum AttemptResult {
        CLEAR,
        TIME_OUT,
        DEATH_OUT,
        UNKNOWN
    }

    public enum PlayerSkillLevel {
        UNKNOWN,
        BEGINNER,
        NORMAL,
        EXPERIENCED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "boss_id", nullable = false)
    private Boss boss;

    /**
     * 외부 자료의 캐릭터는 MyCharacter와 반드시 연결되는 것이 아니므로
     * 이름과 직업을 독립적으로 저장합니다.
     */
    @Column(name = "character_name", length = 50)
    private String characterName;

    @Column(name = "character_class", nullable = false, length = 50)
    private String characterClass;

    @Enumerated(EnumType.STRING)
    @Column(name = "result", nullable = false, length = 20)
    private AttemptResult result;

    @Builder.Default
    @Column(name = "party_size", nullable = false)
    private Integer partySize = 1;

    /**
     * 클리어 성공일 경우 실제 클리어 시간.
     * 실패라면 null 가능.
     */
    @Column(name = "clear_time_seconds")
    private Integer clearTimeSeconds;

    /**
     * 유튜브/인벤/환산 등 원본 자료에서 실제 확인한 당시 보스 배율.
     *
     * 원본 데이터이므로 향후 계산식이 바뀌더라도 수정하지 않습니다.
     *
     * 예:
     * 137.4% -> 137.400
     */
    @Column(
            name = "observed_boss_ratio",
            precision = 10,
            scale = 3
    )
    private BigDecimal observedBossRatio;

    /**
     * Maple_info 자체 계산식으로 산출한 배율.
     */
    @Column(
            name = "normalized_boss_ratio",
            precision = 10,
            scale = 3
    )
    private BigDecimal normalizedBossRatio;

    /**
     * 자체 배율 계산 버전.
     *
     * 예:
     * boss-model-v1
     * boss-model-v2
     */
    @Column(name = "normalization_version", length = 40)
    private String normalizationVersion;

    /**
     * 플레이 숙련도.
     *
     * 객관적인 값이 아니므로
     * 확인 불가능한 경우 UNKNOWN으로 둡니다.
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(
            name = "player_skill_level",
            nullable = false,
            length = 20
    )
    private PlayerSkillLevel playerSkillLevel = PlayerSkillLevel.UNKNOWN;

    /**
     * 게임 패치 버전 또는 패치 구간.
     *
     * 정확한 게임 버전을 모르면
     * 날짜 기반 문자열을 넣어도 됩니다.
     */
    @Column(name = "game_version", length = 40)
    private String gameVersion;

    /**
     * 실제 보스 도전 날짜.
     *
     * 영상 업로드 날짜와 구분합니다.
     */
    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @Builder.Default
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt = LocalDateTime.now();
    public void update(
            Boss boss,
            String characterName,
            String characterClass,
            AttemptResult result,
            Integer partySize,
            Integer clearTimeSeconds,
            BigDecimal observedBossRatio,
            PlayerSkillLevel playerSkillLevel,
            String gameVersion,
            LocalDateTime recordedAt
    ) {
        this.boss = boss;
        this.characterName = characterName;
        this.characterClass = characterClass;
        this.result = result;
        this.partySize = partySize;
        this.clearTimeSeconds = clearTimeSeconds;
        this.observedBossRatio = observedBossRatio;
        this.playerSkillLevel = playerSkillLevel;
        this.gameVersion = gameVersion;
        this.recordedAt = recordedAt;
    }
}