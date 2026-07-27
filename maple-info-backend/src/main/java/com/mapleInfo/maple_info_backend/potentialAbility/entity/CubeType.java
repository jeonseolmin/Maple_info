package com.mapleInfo.maple_info_backend.potentialAbility.entity;

public enum CubeType {
    RED("레드 큐브"),
    BLACK("블랙 큐브"),
    ADDITIONAL("에디셔널 큐브"),
    STRANGE("수상한 큐브"),
    SILVER("장인의 큐브"),
    ARTISAN("명장의 큐브"),
    STRANGEADDI("수상한 에디셔널 큐브");

    private final String description;

    CubeType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}