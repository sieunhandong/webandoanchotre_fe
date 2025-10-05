import axiosInstance from "../utils/axiosInstance";

export const createOrUpdateProfile = async (payload) => {
    const response = await axiosInstance.post(`/quiz/profile`, payload);
    return response;
};

export const getProfile = async () => {
    const response = await axiosInstance.get(`/quiz/profile`);
    return response;
};
export const getMealSuggestions = async (profile) => {
    const response = await axiosInstance.post(`/quiz/ai-suggestions`, { profile });
    return response;
};