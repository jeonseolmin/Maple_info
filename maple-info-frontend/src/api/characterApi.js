import axiosInstance from "./axiosInstance";

export const getCharacter = async (characterName) => {
    const response = await axiosInstance.get(
        "/characters/search",
        {
            params: {
                characterName,
            },
        }
    );

    return response.data;
};

export const getCharacterEquipment = async (ocid) => {
    const response = await axiosInstance.get(
        "/characters/equipment",
        {
            params: {
                ocid,
            },
        }
    );

    return response.data;
};

export const getCharacterCashEquipment = async (ocid) => {
    const response = await axiosInstance.get(
        "/characters/cash-equipment",
        {
            params: {
                ocid,
            },
        }
    );

    return response.data;
};

export const getCharacterBeauty = async (ocid) => {
    const response = await axiosInstance.get(
        "/characters/beauty-equipment",
        {
            params: {
                ocid,
            },
        }
    );

    return response.data;
};

export const getCharacterPetEquipment = async (ocid) => {
    const response = await axiosInstance.get(
        "/characters/pet-equipment",
        {
            params: {
                ocid,
            },
        }
    );

    return response.data;
};

export const getCharacterAndroidEquipment = async (ocid) => {
    const response = await axiosInstance.get(
        "/characters/android-equipment",
        {
            params: {
                ocid,
            },
        }
    );

    return response.data;
};