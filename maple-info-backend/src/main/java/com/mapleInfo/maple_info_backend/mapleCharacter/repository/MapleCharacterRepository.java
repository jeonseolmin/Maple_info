package com.mapleInfo.maple_info_backend.mapleCharacter.repository;

import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MapleCharacterRepository extends JpaRepository<MapleCharacter,Long> {
    Optional<MapleCharacter> findByCharacterName(String characterName);
    Optional<MapleCharacter> findByOcid(String ocid);
}
