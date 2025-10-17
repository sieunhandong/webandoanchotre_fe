import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    IconButton,
    Grid,
    Button,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { step2, getStepData } from "../../services/QuizService";
import "./step2.css";

const Step2 = ({ data, onNext, onPrev }) => {
    const [feedingMethod, setFeedingMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        if (data?.sessionId) {
            getStepData(data.sessionId, 2).then((res) => {
                if (res.data?.success && res.data.data?.feedingMethod) {
                    setFeedingMethod(res.data.data.feedingMethod);
                }
            });
        }
    }, [data]);

    const handleAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = (_, reason) => {
        if (reason === "clickaway") return;
        setAlert({ ...alert, open: false });
    };

    const handleSubmit = async () => {
        if (!feedingMethod) {
            handleAlert("Vui lòng chọn phương pháp ăn dặm phù hợp!", "info");
            return;
        }
        setLoading(true);
        try {
            const res = await step2({ sessionId: data.sessionId, feedingMethod });
            if (res.data?.success) {
                onNext({ feedingMethod });
            } else {
                handleAlert("Có lỗi xảy ra, vui lòng thử lại!", "error");
            }
        } catch (err) {
            console.error("Lỗi gửi dữ liệu:", err);
            handleAlert("Gửi dữ liệu thất bại. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    const options = [
        {
            id: "traditional",
            label: "Ăn dặm truyền thống",
            desc: "Bé ăn cháo loãng, mẹ đút từng thìa.",
        },
        {
            id: "blw",
            label: "Ăn dặm tự chỉ huy (BLW)",
            desc: "Bé tự cầm nắm thức ăn, khám phá mùi vị.",
        },
        {
            id: "japanese",
            label: "Ăn dặm kiểu Nhật",
            desc: "Bé ăn theo giai đoạn, rèn kỹ năng ăn riêng biệt.",
        },
    ];

    return (
        <Box className="step2-container">
            <Paper elevation={0} className="step2-form">
                <Typography
                    variant="h4"
                    className="step3-title"
                    sx={{ fontWeight: 700, color: "#72CCF1", mb: 5 }}
                >
                    Bước 2: Phương pháp ăn dặm của bé
                </Typography>
                <Typography className="step2-desc">
                    Mỗi bé sẽ phù hợp với một phương pháp khác nhau — mẹ hãy chọn cách mình đang hoặc muốn áp dụng nhé!
                </Typography>

                <Grid container spacing={3} className="step2-option-grid">
                    {options.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Box
                                className={`step2-card ${feedingMethod === item.id ? "selected" : ""}`}
                                onClick={() => setFeedingMethod(item.id)}
                            >
                                <Typography className="step2-card-title" sx={{ fontWeight: 700, fontSize: "20px" }}>{item.label}</Typography>
                                <Typography className="step2-card-desc">{item.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Nút quay lại và tiếp tục */}
            <div className="step4-btn-group">
                <button onClick={onPrev} className="step4-btn step4-btn-back" aria-label="Quay lại">
                    <ArrowBackIosNewRoundedIcon />
                </button>
                <button
                    onClick={handleSubmit}
                    className="step4-btn step4-btn-next"
                    disabled={loading}
                    aria-label="Tiếp tục"
                >
                    <ArrowForwardIosRoundedIcon />
                </button>
            </div>

            {/* Snackbar Alert */}
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
        </Box>
    );
};

export default Step2;
