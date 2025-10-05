import axiosInstance from "../../utils/axiosInstance";

export const getProducts = () =>
  axiosInstance.get("/admin/products").then((res) => res.data);

export const getProductById = (id) =>
  axiosInstance.get(`/admin/products/${id}`).then((res) => res.data);

export const createProduct = (formData) =>
  axiosInstance
    .post("/admin/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const updateProduct = (id, formData) =>
  axiosInstance
    .put(`/admin/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const deleteProduct = (id) =>
  axiosInstance.delete(`/admin/products/${id}`).then((res) => res.data);
