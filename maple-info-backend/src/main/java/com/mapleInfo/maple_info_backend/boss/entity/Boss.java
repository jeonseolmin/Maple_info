package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "boss")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boss {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 예: 스우

    @Column(nullable = false)
    private String difficulty; // 예: 하드

    @Column(name = "crystal_price", nullable = false)
    private Long crystalPrice; // 예: 32500000 (결정석 가격)
}