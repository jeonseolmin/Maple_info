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