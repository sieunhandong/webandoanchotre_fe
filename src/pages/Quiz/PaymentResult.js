import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import * as OrderService from "../../services/OrderService"; // <-- bạn cần có hàm gọi API ở đây

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: "",
    });

    useEffect(() => {
        const handlePaymentReturn = async () => {
            try {
                // Lấy toàn bộ query trả về từ VNPAY
                const queryString = location.search;

                // Gọi backend xác thực chữ ký và cập nhật đơn hàng
                const res = await OrderService.getPaymentReturn(queryString);

                if (res.data?.status === "success") {
                    setStatus({
                        loading: false,
                        success: true,
                        message: "Thanh toán thành công! Cảm ơn mẹ đã hoàn tất thông tin 💕",
                    });
                } else {
                    setStatus({
                        loading: false,
                        success: false,
                        message: res.data?.message || "Thanh toán thất bại. Vui lòng thử lại.",
                    });
                }
            } catch (error) {
                console.error("❌ Lỗi khi xác nhận thanh toán:", error);
                setStatus({
                    loading: false,
                    success: false,
                    message: "Không thể xác minh giao dịch. Vui lòng thử lại sau.",
                });
            }
        };

        handlePaymentReturn();
    }, [location.search]);

    if (status.loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <CircularProgress size={60} />
                <p className="text-gray-600 mt-4 text-lg">
                    Đang xác thực thanh toán qua VNPAY...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
            {status.success ? (
                <div className="text-center animate-fadeIn">
                    <CheckCircleIcon className="text-green-500" style={{ fontSize: 80 }} />
                    <h2 className="text-2xl font-bold text-green-600 mt-4">
                        Thanh toán thành công!
                    </h2>
                    <p className="text-gray-600 mt-2 mb-6">{status.message}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            ) : (
                <div className="text-center animate-fadeIn">
                    <ErrorIcon className="text-red-500" style={{ fontSize: 80 }} />
                    <h2 className="text-2xl font-bold text-red-500 mt-4">
                        Thanh toán thất bại
                    </h2>
                    <p className="text-gray-600 mt-2 mb-6">{status.message}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-red-400 text-white px-6 py-2 rounded-xl hover:bg-red-500 transition"
                    >
                        Quay lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentResult;
