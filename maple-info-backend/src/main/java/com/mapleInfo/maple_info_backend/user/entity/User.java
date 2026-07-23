package com.mapleInfo.maple_info_backend.user.entity;

import com.mapleInfo.maple_info_backend.common.entity.BaseEntity;
import com.mapleInfo.maple_info_backend.user.entity.enums.Provider;
import com.mapleInfo.maple_info_backend.user.entity.enums.Role;
import com.mapleInfo.maple_info_backend.userCharacter.entity.UserCharacter;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "users")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mainCharacterName;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(nullable = false, unique = true)
    private String providerUserId;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<UserCharacter> userCharacters = new ArrayList<>();
}
