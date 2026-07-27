package com.mapleInfo.maple_info_backend.user.repository;

import com.mapleInfo.maple_info_backend.user.entity.User;
import com.mapleInfo.maple_info_backend.user.entity.enums.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User,Long> {

    Optional<User> findByProviderAndProviderUserId(
            Provider provider,
            String providerUserId
    );
}
