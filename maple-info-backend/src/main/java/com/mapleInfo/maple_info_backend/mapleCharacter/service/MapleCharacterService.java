package com.mapleInfo.maple_info_backend.mapleCharacter.service;

import com.mapleInfo.maple_info_backend.mapleCharacter.client.MapleCharacterClient;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.*;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.CharacterResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;
import com.mapleInfo.maple_info_backend.mapleCharacter.repository.MapleCharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service @RequiredArgsConstructor
public class MapleCharacterService {
    private final MapleCharacterRepository mapleCharacterRepository;
    private final MapleCharacterClient mapleCharacterClient;


    @Transactional
    public CharacterSearchResponse searchCharacter(String characterName) {
        MapleCharacter character = mapleCharacterRepository
                .findByCharacterName(characterName)
                .orElseGet(() -> createCharacter(characterName));

        String ocid = character.getOcid();

        NexonCharacterBasicResponse basic =
                mapleCharacterClient.getBasic(ocid);

        NexonUnionResponse union =
                mapleCharacterClient.getUnion(ocid);

        NexonCharacterPopularityResponse popularity =
                mapleCharacterClient.getPopularity(ocid);

        character.updateBasicInfo(basic);
        character.updateUnionInfo(union);
        character.updatePopularity(popularity);

        return CharacterSearchResponse.from(character);
    }

    private MapleCharacter createCharacter(String characterName) {

        NexonOcidResponse ocidResponse =
                mapleCharacterClient.getOcid(characterName);

        NexonCharacterBasicResponse nexonCharacterBasicResponse =
                mapleCharacterClient.getBasic(ocidResponse.ocid());

        MapleCharacter mapleCharacter =MapleCharacter.builder()
                .ocid(ocidResponse.ocid())
                .characterName(nexonCharacterBasicResponse.characterName())
                .worldName(nexonCharacterBasicResponse.worldName())
                .characterClass(nexonCharacterBasicResponse.characterClass())
                .level(nexonCharacterBasicResponse.characterLevel())
                .exp(nexonCharacterBasicResponse.characterExp())
                .expRate(Double.valueOf(nexonCharacterBasicResponse.characterExpRate()))
                .guildName(nexonCharacterBasicResponse.characterGuildName())
                .characterImage(nexonCharacterBasicResponse.characterImage())
                .syncedAt(LocalDateTime.now())
                .build();

        return mapleCharacterRepository.save(mapleCharacter);
    }
}
