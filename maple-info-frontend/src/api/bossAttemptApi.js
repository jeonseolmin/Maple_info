import axiosInstance from "./axiosInstance";

export const getBossData = async () => {
    const response =
        await axiosInstance.get("/boss/data");

    return response.data;
};

export const createBossAttempt = async data => {

    const response =
        await axiosInstance.post(
            "/boss-attempts",
            data
        );

    return response.data;
};

export const getBossAttempts = async () => {

    const response =
        await axiosInstance.get(
            "/boss-attempts"
        );

    return response.data;
};

export const updateBossAttempt = async (
    attemptId,
    data
) => {

    await axiosInstance.put(
        `/boss-attempts/${attemptId}`,
        data
    );
};

export const deleteBossAttempt = async attemptId => {

    await axiosInstance.delete(
        `/boss-attempts/${attemptId}`
    );
};