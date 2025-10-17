import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import "./PaymentResult.css";

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
        const statusQuery = params.get("status");

        if (statusQuery === "success") {
            setStatus({
                loading: false,
                success: true,
                message: "Cảm ơn mẹ đã tin tưởng và hoàn tất thanh toán 💕",
            });
        } else {
            setStatus({
                loading: false,
                success: false,
                message: "Đơn hàng chưa được thanh toán hoặc đã hết hạn 😔",
            });
        }
    }, [location.search]);

    if (status.loading) {
        return (
            <div className="payment-loading">
                <CircularProgress size={70} sx={{ color: "#72ccf1" }} />
                <p>Đang xác thực thanh toán...</p>
            </div>
        );
    }

    return (
        <div
            className={`payment-result-container ${status.success ? "success" : "failed"
                }`}
        >
            <div className="payment-card animate-pop">
                {status.success ? (
                    <>
                        <CheckCircleIcon className="icon success-icon" />
                        <h2 className="payment-title">Thanh toán thành công 🎉</h2>
                        <p className="payment-message">{status.message}</p>
                        <div className="payment-note">
                            <p>
                                💌 Shop sẽ sớm nhắn tin qua{" "}
                                <span className="highlight">Zalo</span> hoặc{" "}
                                <span className="highlight">Facebook</span> để
                                tư vấn và soạn thực đơn phù hợp nhất cho bé yêu của ba mẹ nhé 💖
                            </p>
                            <p className="contact-tip">
                                🌸 Để được hỗ trợ nhanh hơn, ba mẹ có thể{" "}
                                <strong>chủ động nhắn tin</strong> cho shop ngay trên{" "}
                                <span className="highlight">Zalo</span> hoặc{" "}
                                <span className="highlight">Facebook</span> để được tư vấn sớm nhất nhé!
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="payment-btn home-btn"
                        >
                            Về trang chủ
                        </button>
                    </>
                ) : (
                    <>
                        <ErrorIcon className="icon error-icon" />
                        <h2 className="payment-title">Thanh toán thất bại</h2>
                        <p className="payment-message">{status.message}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="payment-btn retry-btn"
                        >
                            Thử lại
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
