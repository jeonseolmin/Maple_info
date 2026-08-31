package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "boss_spec_snapshot")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BossSpecSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 한 번의 보스 도전에 대한 당시 스펙입니다.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "boss_attempt_id",
            nullable = false,
            unique = true
    )
    private BossAttempt bossAttempt;

    @Column(name = "character_level")
    private Integer characterLevel;

    /**
     * 인게임 전투력
     */
    @Column(name = "combat_power")
    private Long combatPower;

    /**
     * 환산주스탯 등 외부 환산 수치.
     *
     * 단위가 사이트/시점마다 달라질 수 있으므로
     * 추후 source와 함께 해석합니다.
     */
    @Column(
            name = "converted_stat",
            precision = 15,
            scale = 3
    )
    private BigDecimal convertedStat;

    /**
     * 보스 공격 시 데미지 %
     */
    @Column(
            name = "boss_damage",
            precision = 10,
            scale = 3
    )
    private BigDecimal bossDamage;

    /**
     * 방어율 무시 %
     */
    @Column(
            name = "ignore_defense",
            precision = 10,
            scale = 3
    )
    private BigDecimal ignoreDefense;

    /**
     * 크리티컬 데미지 %
     */
    @Column(
            name = "critical_damage",
            precision = 10,
            scale = 3
    )
    private BigDecimal criticalDamage;

    /**
     * 주스탯
     */
    @Column(name = "main_stat")
    private Long mainStat;

    /**
     * 공격력 / 마력
     */
    @Column(name = "attack_power")
    private Long attackPower;

    /**
     * HEXA 진행도.
     *
     * 현재는 하나의 대표값으로 두고,
     * 데이터가 충분해지면 별도 테이블로 세분화 가능합니다.
     */
    @Column(
            name = "hexa_progress",
            precision = 10,
            scale = 3
    )
    private BigDecimal hexaProgress;

    /**
     * 시드링 정보
     *
     * 예:
     * 리레4
     * 웨펖4
     */
    @Column(name = "seed_ring", length = 50)
    private String seedRing;

    /**
     * 도핑 여부/설명
     *
     * 자료에서 확인 가능한 경우만 저장.
     */
    @Column(name = "buff_description", columnDefinition = "TEXT")
    private String buffDescription;
}