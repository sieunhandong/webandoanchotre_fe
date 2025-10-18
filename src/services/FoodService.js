import axiosInstance from "../utils/axiosInstance";


export const getFoodHome = async () => {
    const response = await axiosInstance.get("/food/home");
    return response;
};
export const getAllFoods = async ({ page = 1, limit = 12, search = "" }) => {
    const response = await axiosInstance.get("/food", {
        params: { page, limit, search },
    });
    return response;
};

export const getFoodById = async (id) => {
    const response = await axiosInstance.get(`/food/${id}`);
    return response;
};
