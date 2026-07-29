package com.mapleInfo.maple_info_backend.exp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "level_exp")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LevelExp {

    @Id
    @Column(name = "level", nullable = false)
    private Integer level; // 레벨 (예: 260)

    @Column(name = "required_exp", nullable = false)
    private Long requiredExp; // 다음 레벨업에 필요한 경험치 (예: 1731919984062)

    @Column(name = "exp_point_value", nullable = false)
    private Long expPointValue; // 상급 EXP 쿠폰 1포인트당 경험치
}