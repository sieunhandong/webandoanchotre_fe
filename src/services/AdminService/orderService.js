import axiosInstance from "../../utils/axiosInstance";

// 📦 Lấy danh sách đơn hàng
export const getOrders = () =>
  axiosInstance.get("/admin/orders").then((res) => res.data);


// 🧠 Gọi AI để gợi ý lại thực đơn dựa trên thông tin order + user
export const aiSuggestMenu = (orderId) =>
  axiosInstance
    .post(`/admin/orders/${orderId}/ai-suggest`)
    .then((res) => res.data);

// ✏️ Cập nhật thực đơn của 1 ngày cụ thể
export const updateMealMenu = (orderId, menus) =>
  axiosInstance.put(`/admin/orders/${orderId}/update-menu`, { menus }).then(res => res.data);

export const updateMealDone = async (orderId, day, isDone) => {
  const res = await axiosInstance.put("/admin/orders/update-meal-done", { orderId, day, isDone });
  return res.data;
};