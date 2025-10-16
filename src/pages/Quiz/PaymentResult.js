import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: "",
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const statusQuery = params.get("status"); // "success" hoặc undefined
        const orderCode = params.get("orderCode");

        if (statusQuery === "success") {
            setStatus({
                loading: false,
                success: true,
                message: "Thanh toán thành công! Cảm ơn mẹ đã hoàn tất thông tin 💕",
            });
        } else {
            // Trường hợp hết 3 phút hoặc chưa thanh toán
            setStatus({
                loading: false,
                success: false,
                message: "Bạn chưa thanh toán hoặc đơn hàng đã hết hạn.",
            });
        }
    }, [location.search]);

    if (status.loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <CircularProgress size={60} />
                <p className="text-gray-600 mt-4 text-lg">Đang xác thực thanh toán...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
            {status.success ? (
                <div className="text-center animate-fadeIn">
                    <CheckCircleIcon className="text-green-500" style={{ fontSize: 80 }} />
                    <h2 className="text-2xl font-bold text-green-600 mt-4">Thanh toán thành công!</h2>
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
                    <h2 className="text-2xl font-bold text-red-500 mt-4">Thanh toán thất bại</h2>
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
