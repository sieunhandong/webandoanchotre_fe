import axiosInstance from "../../utils/axiosInstance";

export const getDiscounts = () =>
  axiosInstance.get("/admin/discounts").then((res) => res.data);

export const getDiscountById = (id) =>
  axiosInstance.get(`/admin/discounts/${id}`).then((res) => res.data);

export const createDiscount = (payload) =>
  axiosInstance.post("/admin/discounts", payload).then((res) => res.data);

export const updateDiscount = (id, payload) =>
  axiosInstance.put(`/admin/discounts/${id}`, payload).then((res) => res.data);

export const deleteDiscount = (id) =>
  axiosInstance.delete(`/admin/discounts/${id}`).then((res) => res.data);

export const changeStatusDiscount = (id) =>
  axiosInstance
    .put(`/admin/discounts/${id}/change-status`)
    .then((res) => res.data);

export const updateDiscountProducts = (id, productIds) =>
  axiosInstance
    .patch(`/admin/discounts/${id}/products`, { products: productIds })
    .then((res) => res.data);

export const removeBookFromDiscount = (discountId, bookId) =>
  axiosInstance
    .delete(`/admin/discounts/${discountId}/books/${bookId}`)
    .then((res) => res.data);

export const getBooks = () =>
  axiosInstance.get("/admin/books").then((res) => res.data);

export const getBookById = (id) =>
  axiosInstance.get(`/admin/books/${id}`).then((res) => res.data);
