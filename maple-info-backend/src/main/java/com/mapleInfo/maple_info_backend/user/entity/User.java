package com.mapleInfo.maple_info_backend.user.entity;

import com.mapleInfo.maple_info_backend.common.entity.BaseEntity;
import com.mapleInfo.maple_info_backend.user.entity.enums.Provider;
import com.mapleInfo.maple_info_backend.user.entity.enums.Role;
import com.mapleInfo.maple_info_backend.userCharacter.entity.UserCharacter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "users",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_user_provider_id",
                columnNames = {"provider", "provider_user_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;

    private String email;

    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<UserCharacter> userCharacters = new ArrayList<>();
}
