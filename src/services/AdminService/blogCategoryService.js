import axiosInstance from "../../utils/axiosInstance";

export const createBlogCategory = (data) =>
    axiosInstance.post("/blog-category", data).then((res) => res.data);

export const getAllBlogCategories = () =>
    axiosInstance.get("/blog-category").then((res) => res.data);

export const updateBlogCategory = (id, data) =>
    axiosInstance.put(`/blog-category/${id}`, data).then((res) => res.data);

export const deleteBlogCategory = (id) =>
    axiosInstance.delete(`/blog-category/${id}`).then((res) => res.data);
