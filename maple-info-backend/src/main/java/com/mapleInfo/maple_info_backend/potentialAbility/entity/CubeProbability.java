package com.mapleInfo.maple_info_backend.potentialAbility.entity;

import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cube_probabilities")
@Getter
@NoArgsConstructor
public class CubeProbability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "cube_type")
    private CubeType cubeType;

    @Column(name = "item_part")
    private String itemPart;

    @Column(name = "potential_tier")
    private String potentialTier;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "probability")
    private Double probability;

    @Builder
    public CubeProbability(CubeType cubeType, String itemPart, String potentialTier, String optionName, Double probability) {
        this.cubeType = cubeType;
        this.itemPart = itemPart;
        this.potentialTier = potentialTier;
        this.optionName = optionName;
        this.probability = probability;
    }
}