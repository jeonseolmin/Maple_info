package com.mapleInfo.maple_info_backend.bossinfo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "boss_info") // 테이블 이름도 겹치지 않게 분리
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BossInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;           // 보스 이름 (예: 스우)

    @Column(nullable = false)
    private String difficulty;     // 난이도 (예: 노멀, 하드)

    @Column(length = 1000)
    private String description;    // 보스 배경 스토리 및 주요 패턴 설명

    @Column(name = "entry_level")
    private Integer entryLevel;    // 입장 최소 레벨 (예: 210)

    @Column(name = "req_arcane_force")
    private Integer reqArcaneForce; // 요구 아케인포스

    @Column(name = "req_authentic_force")
    private Integer reqAuthenticForce; // 요구 어센틱포스

    @Column(name = "defense_rate")
    private Integer defenseRate;   // 방어율 (예: 300)

    @Column(name = "main_drop_item")
    private String mainDropItem;   // 주요 드랍 아이템

    @Column(name = "image_url")
    private String imageUrl;       // 프론트에서 보여줄 일러스트 이미지 이름 (예: "suu.png")
}