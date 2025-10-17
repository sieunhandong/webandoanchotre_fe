import React, { useEffect, useState } from "react";
import { getSets, step5, getStepData } from "../../services/QuizService";
import "./step5.css";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Alert, Snackbar } from "@mui/material";
const Step5 = ({ data, onNext, onPrev }) => {
    const [sets, setSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [loading, setLoading] = useState(false);
    const sessionId = data?.sessionId;
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSets();
                setSets(res.data.data || []);
                if (sessionId) {
                    const stepData = await getStepData(sessionId, 5);
                    if (stepData.data.success && stepData.data.data?.selectedSet)
                        setSelectedSet(stepData.data.data.selectedSet);
                }
            } catch (e) {
                console.error("Lỗi tải dữ liệu:", e);
            }
        };
        fetchData();
    }, [sessionId]);
    const handleAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = (_, reason) => {
        if (reason === "clickaway") return;
        setAlert({ ...alert, open: false });
    };
    const handleNext = async () => {
        if (!selectedSet) return handleAlert("Vui lòng chọn 1 set ăn dặm!", "info");
        setLoading(true);
        try {
            const res = await step5({ sessionId, selectedSet });
            if (res.data.success) onNext && onNext({ selectedSet });
        } catch (err) {
            console.error(err);
            handleAlert("Vui lòng chọn 1 set ăn dặm!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step5-wrapper">
            <div className="step5-container">
                <h2 className="step5-title">Bước 5: Gợi ý set ăn dặm phù hợp 🍼</h2>
                <p className="step5-desc">
                    Dưới đây là các set ăn dặm phù hợp với thông tin của bé. Mẹ chọn 1 set nhé!
                </p>

                <div className="step5-grid">
                    {sets.length > 0 ? (
                        sets.map((s) => (
                            <div
                                key={s._id}
                                className={`step5-card ${selectedSet === s._id ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedSet(s._id)}
                            >
                                <h3 style={{ display: "flex", justifyContent: "center" }}>{s.title}</h3>
                                <h1 style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "40px"
                                }}>{(s.price).toLocaleString('vi-VN')}</h1>
                                <p className="step5-card-desc" >{s.description}</p>
                                <div className="step5-info">
                                    <span>⏱ {s.duration} ngày</span>
                                    <span>✓ Dinh dưỡng</span>
                                    <span>✓ Tiện lợi</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Đang tải danh sách set ăn dặm...</p>
                    )}
                </div>
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
                <Alert severity={alert.severity} variant="filled" onClose={handleCloseAlert} sx={{
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
                }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Step5;
