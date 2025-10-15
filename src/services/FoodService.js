import axiosInstance from "../utils/axiosInstance";


export const getFoodHome = async () => {
    const response = await axiosInstance.get("/food/home");
    return response;
};