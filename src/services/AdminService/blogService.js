import axiosInstance from "../../utils/axiosInstance";

export const createBlog = (formData) =>
  axiosInstance
    .post("/admin/blog", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const getAllBlogs = (blogCategoryId = "", page = 1, limit = 5) =>
  axiosInstance
    .get("/admin/blog", { params: { blogCategoryId, page, limit } })
    .then((res) => res.data);

export const updateBlog = (id, body) =>
  axiosInstance.put(`/admin/blog/${id}`, body).then((res) => res.data);

export const deleteBlog = (id) =>
  axiosInstance.delete(`/admin/blog/${id}`).then((res) => res.data);


export const getBlogById = (id) =>
  axiosInstance.get(`/blog/${id}`).then((res) => res.data);

export const getHomeBlogs = () =>
  axiosInstance.get("/blog/home").then((res) => res.data);
export const getAllBlogsByUser = (params) =>
  axiosInstance.get("/blog", { params }).then((res) => res.data);
export const getAllCategories = () =>
  axiosInstance.get("/blog/category").then((res) => res.data);
export const getBlogsByMainCategories = () =>
  axiosInstance.get("/blog/main-categories").then((res) => res.data);

// Lấy tất cả blog theo categoryId, kèm phân trang
export const getBlogsByCategory = (blogCategoryId) =>
  axiosInstance
    .get("/blog", { params: { blogCategoryId } })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.error("API getBlogsByCategory error:", err);
      throw err;
    });

