package com.mapleInfo.maple_info_backend.mapleCharacter.repository;

import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapleCharacterRepository extends JpaRepository<MapleCharacter,Long> {

}
