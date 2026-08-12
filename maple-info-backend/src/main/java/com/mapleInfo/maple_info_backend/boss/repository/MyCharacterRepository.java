package com.mapleInfo.maple_info_backend.boss.repository;

import com.mapleInfo.maple_info_backend.boss.entity.MyCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MyCharacterRepository extends JpaRepository<MyCharacter, Long> {
}