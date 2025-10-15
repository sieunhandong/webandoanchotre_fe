import axiosInstance from "../utils/axiosInstance";


export const getMealSetById = async (id) => {
    const response = await axiosInstance.get(`/mealset/${id}`);
    return response;
};
export const getAllMealSets = async () => {
    const response = await axiosInstance.get("/mealset");
    return response;
};