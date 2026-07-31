package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonTitleResponse;

import java.time.OffsetDateTime;

public record CharacterTitleResponse(String name,
                                     String icon,
                                     String description,
                                     OffsetDateTime expireAt,
                                     OffsetDateTime optionExpireAt,
                                     String shapeName,
                                     String shapeIcon,
                                     String shapeDescription
) {
    public static CharacterTitleResponse from(
            NexonTitleResponse title
    ) {
        if (title == null) {
            return null;
        }

        return new CharacterTitleResponse(
                title.titleName(),
                title.titleIcon(),
                title.titleDescription(),
                title.dateExpire(),
                title.dateOptionExpire(),
                title.titleShapeName(),
                title.titleShapeIcon(),
                title.titleShapeDescription()
        );
    }
}