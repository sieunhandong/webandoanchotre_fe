import axiosInstance from "../../utils/axiosInstance";

export const getMealSets = () =>
    axiosInstance.get("/admin/mealsets").then((res) => res.data.data);

export const getMealSetById = (id) =>
    axiosInstance.get(`/admin/mealsets/${id}`).then((res) => res.data.data);

export const createMealSet = (mealSetData) =>
    axiosInstance.post("/admin/mealsets", mealSetData).then((res) => res.data.data);

export const updateMealSet = (id, mealSetData) =>
    axiosInstance.put(`/admin/mealsets/${id}`, mealSetData).then((res) => res.data.data);

export const deleteMealSet = (id) =>
    axiosInstance.delete(`/admin/mealsets/${id}`).then((res) => res.data);