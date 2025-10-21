import React, { useCallback, useEffect, useState } from "react";
import { step4 } from "../../services/QuizService";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import "./step4.css";
import { Alert, Snackbar } from "@mui/material";

const Step4 = ({ data, onNext, onPrev }) => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };
    // Tạo "hash" dữ liệu đầu vào để so sánh
    const createInputHash = (data) => {
        const normalize = (val) => (typeof val === "string" ? val.trim() : val);
        return JSON.stringify({
            age: normalize(data?.age),
            weight: normalize(data?.weight),
            allergies: (data?.allergies || []).map((a) => a.trim().toLowerCase()),
            feedingMethod: data?.feedingMethod,
            selectedProducts: (data?.selectedProducts || []).sort(), // sort để tránh lệch thứ tự
        });
    };

    const fetchMenu = useCallback(async (sessionId, inputHash) => {
        setLoading(true);
        try {
            const res = await step4({ sessionId });
            if (res.data.success && res.data.data.menu) {
                const suggestedMenu = res.data.data.menu;
                setMenu(suggestedMenu);
                localStorage.setItem(`quiz_mealSuggestions_${sessionId}`, JSON.stringify(suggestedMenu));
                localStorage.setItem(`quiz_mealInputHash_${sessionId}`, inputHash);
            } else {
                handleAlert("Không nhận được dữ liệu thực đơn!", "error");
            }
        } catch (err) {
            console.error(err);
            handleAlert("Lỗi khi lấy gợi ý thực đơn!", "error");
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        setMenu([]); // reset lại
    }, [data?.sessionId]);

    useEffect(() => {
        console.log("👀 useEffect chạy lại (theo dõi dữ liệu đầu vào)", {
            sessionId: data?.sessionId,
            age: data?.age,
            weight: data?.weight,
            feedingMethod: data?.feedingMethod,
            allergies: data?.allergies,
            selectedProducts: data?.selectedProducts,
        });
        if (!data?.sessionId) return;
        const inputHash = createInputHash(data);
        const savedHash = localStorage.getItem(`quiz_mealInputHash_${data.sessionId}`);
        const savedMenu = JSON.parse(localStorage.getItem(`quiz_mealSuggestions_${data.sessionId}`) || "[]");

        if (savedHash !== inputHash) {
            localStorage.removeItem(`quiz_mealSuggestions_${data.sessionId}`);
            fetchMenu(data.sessionId, inputHash);
        } else if (savedMenu.length > 0) {
            setMenu(savedMenu);
        } else {
            fetchMenu(data.sessionId, inputHash);
        }
    }, [data?.sessionId, fetchMenu]); // chỉ theo dõi sessionId và hàm fetch

    const handleNext = () => {
        onNext && onNext({ menu });
    };

    return (
        <div className="step4-wrapper">
            <div className="step4-container">
                <h2 className="step4-title">Bước 4: Gợi ý thực đơn cho bé 🍽️</h2>
                <div style={{ display: "flex", textAlign: "center", justifyContent: "center", marginBottom: "20px", fontSize: "20px" }}>Đây chỉ là mẫu gợi ý thực đơn cho bé.</div>

                {loading ? (
                    <p className="step4-loading">Đang tạo thực đơn phù hợp cho bé... 🍲</p>
                ) : (
                    <>
                        {menu.length > 0 ? (
                            <div className="step4-menu-list">
                                {menu.map((dayItem, index) => (
                                    <div key={index} className="step4-day-card">
                                        <h3 className="step4-day-title">📅 Ngày {dayItem.day}</h3>
                                        <ul className="step4-meal-list">
                                            {dayItem.meals.map((meal, i) => (
                                                <li key={i} className="step4-meal-item">
                                                    {meal}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="step4-empty">Chưa có gợi ý nào. Vui lòng thử lại.</p>
                        )}
                    </>
                )}
            </div>

            <div className="step4-btn-group">
                <button onClick={onPrev} className="step4-btn step4-btn-back" aria-label="Quay lại">
                    <ArrowBackIosNewRoundedIcon />
                </button>
                <button
                    onClick={handleNext}
                    className="step4-btn step4-btn-next"
                    disabled={loading}
                    aria-label="Tiếp tục"
                >
                    <ArrowForwardIosRoundedIcon />
                </button>
            </div>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    sx={{
                        bgcolor:
                            alert.severity === "error"
                                ? "#FFD6D6"
                                : alert.severity === "info"
                                    ? "#E3F7FF"
                                    : "#D6FFE3",
                        color: "#333",
                        fontWeight: 600,
                        borderRadius: "14px",
                        boxShadow: "0 6px 16px rgba(114,204,241,0.25)",
                        px: 2,
                    }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Step4;
