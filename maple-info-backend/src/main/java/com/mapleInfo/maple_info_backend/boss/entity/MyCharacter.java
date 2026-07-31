package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "my_character")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "character_name", nullable = false, unique = true)
    private String characterName;

    @Column(nullable = false)
    private String job; // 직업 (UI에 아이콘 등을 띄워주기 위함)
}