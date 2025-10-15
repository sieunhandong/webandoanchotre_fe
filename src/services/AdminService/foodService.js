import axiosInstance from "../../utils/axiosInstance";

export const getAllFoods = ({ search = "", page = 1, limit = 5 }) =>
    axiosInstance.get("/admin/food", { params: { search, page, limit } }).then(res => res.data);

export const createFood = (formData) =>
    axiosInstance.post("/admin/food", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);

export const updateFood = (id, formData) =>
    axiosInstance.put(`/admin/food/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);

export const deleteFood = (id) =>
    axiosInstance.delete(`/admin/food/${id}`).then(res => res.data);
