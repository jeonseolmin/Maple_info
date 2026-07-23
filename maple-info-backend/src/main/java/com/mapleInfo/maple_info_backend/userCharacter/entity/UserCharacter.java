package com.mapleInfo.maple_info_backend.userCharacter.entity;

import com.mapleInfo.maple_info_backend.common.entity.BaseEntity;
import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;
import com.mapleInfo.maple_info_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCharacter extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "character_id", nullable = false, unique = true)
    private MapleCharacter character;

    private boolean mainCharacter;
}