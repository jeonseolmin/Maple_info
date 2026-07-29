package com.mapleInfo.maple_info_backend.mapleCharacter.controller;


import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.CharacterSearchResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment.CharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.service.MapleCharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api/characters")
@RequiredArgsConstructor
public class MapleCharacterController {
    private final MapleCharacterService mapleCharacterService;

    @GetMapping("/search")
    public CharacterSearchResponse searchCharacter(
            @RequestParam String characterName
    ){
        return mapleCharacterService.searchCharacter(characterName);
    }

    @GetMapping("/equipment")
    public CharacterEquipmentResponse getEquipment(
            @RequestParam String ocid
    ) {
        return mapleCharacterService.getEquipment(ocid);
    }


}
