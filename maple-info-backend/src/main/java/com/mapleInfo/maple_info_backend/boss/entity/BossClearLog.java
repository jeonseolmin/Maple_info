package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "boss_clear_log")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BossClearLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private MyCharacter myCharacter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boss_id", nullable = false)
    private Boss boss;

    @Column(name = "cleared_at", nullable = false)
    private LocalDateTime clearedAt;

    // 🌟 추가된 부분: 파티 인원수 (기본값 1)
    @Column(name = "party_size", nullable = false)
    @Builder.Default
    private Integer partySize = 1;

    // 파티 인원수를 수정할 수 있는 메서드 추가
    public void updatePartySize(Integer partySize) {
        this.partySize = partySize;
    }
}