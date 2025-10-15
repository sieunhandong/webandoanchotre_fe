import axiosInstance from "../utils/axiosInstance";

export const startQuiz = async () => {
    const response = await axiosInstance.post(`/quiz/start`);
    return response;
};

export const step1 = async (payload) => {
    const response = await axiosInstance.post(`/quiz/step1`, payload);
    return response;
};
export const step2 = async (payload) => {
    const response = await axiosInstance.post(`/quiz/step2`, payload);
    return response;
};
export const step3 = async (payload) => {
    const response = await axiosInstance.post(`/quiz/step3`, payload);
    return response;
};
export const step4 = async (payload) => {
    const response = await axiosInstance.post(`/quiz/step4`, payload);
    return response;
};
export const step5 = async (payload) => {
    const response = await axiosInstance.post(`/quiz/step5`, payload);
    return response;
};
export const step6 = async (sessionId) => {
    const response = await axiosInstance.get(`/quiz/step6?sessionId=${sessionId}`);
    return response;
};
export const step7 = async (payload) => {
    const response = await axiosInstance.post(`/quiz/step7`, payload);
    return response;
};

// 🧾 Lấy dữ liệu khi user quay lại bước trước (ví dụ: step 3)
export const getStepData = async (sessionId, step) => {
    const response = await axiosInstance.get(`/quiz/step/${step}`, {
        params: { sessionId },
    });
    return response;
};

// 💳 Kết quả thanh toán sau khi quay về từ VNPay
export const getPaymentResult = async (params) => {
    const response = await axiosInstance.get(`/quiz/payment-result`, { params });
    return response;
};

// 🛒 Dữ liệu hỗ trợ quiz (ví dụ danh mục / sản phẩm gợi ý)
export const getCategoriesProducts = async () => {
    const response = await axiosInstance.get(`/quiz/categories-products`);
    return response;
};

export const getSets = async () => {
    const response = await axiosInstance.get(`/quiz/sets`);
    return response;
};

// 📦 Đơn hàng của người dùng
export const getOrders = async () => {
    const response = await axiosInstance.get(`/quiz/orders`);
    return response;
};

export const rebuyOrder = async (orderId) => {
    const response = await axiosInstance.post(`/quiz/rebuy-order`, { orderId });
    return response;
};