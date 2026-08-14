package com.mapleInfo.maple_info_backend.mapleCharacter.controller;


import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.CharacterSearchResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.android.CharacterAndroidEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty.CharacterBeautyResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash.CharacterCashEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment.CharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.pet.CharacterPetEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.service.MapleCharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    @GetMapping("/cash-equipment")
    public CharacterCashEquipmentResponse getCashEquipment(
            @RequestParam String ocid
    ) {
        return mapleCharacterService.getCashEquipment(ocid);
    }
    @GetMapping("/champion")
    public ResponseEntity<?> getUnionChampion(@RequestParam java.util.List<String> names) {
        return ResponseEntity.ok(mapleCharacterService.getChampionInfoByNames(names));
    }

    @GetMapping("/beauty-equipment")
    public CharacterBeautyResponse getBeautyEquipment(
            @RequestParam String ocid
    ) {
        return mapleCharacterService.getBeautyEquipment(
                ocid
        );
    }

    @GetMapping("/pet-equipment")
    public CharacterPetEquipmentResponse getPetEquipment(
            @RequestParam String ocid
    ) {
        return mapleCharacterService.getPetEquipment(
                ocid
        );
    }

    @GetMapping("/android-equipment")
    public CharacterAndroidEquipmentResponse getAndroidEquipment(
            @RequestParam String ocid
    ) {
        return mapleCharacterService.getAndroidEquipment(
                ocid
        );
    }
}
