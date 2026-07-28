import axiosInstance from "./axiosInstance";

export const getCharacter = async (characterName) => {
    const response = await axiosInstance.get(
        "/api/characters/search/",
        {
            params: {
                characterName,
            },
        }
    );

    return response.data;
};