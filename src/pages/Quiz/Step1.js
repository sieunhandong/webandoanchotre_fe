import React, { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import * as QuizService from "../../services/QuizService";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import "./step1.css";

const Step1 = ({ data, onNext }) => {
    const [form, setForm] = useState({
        age: "",
        weight: "",
        allergies: [],
    });
    const [allergyInput, setAllergyInput] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ State cho alert đẹp
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

    const ageOptions = [
        "6-8 tháng",
        "8-10 tháng",
        "10-12 tháng",
        "12-18 tháng",
        "18-24 tháng",
    ];

    const weightOptions = [
        "6-8 kg",
        "8-10 kg",
        "10-12 kg",
        "12-14 kg",
        "14-16 kg",
    ];

    const handleAllergyKeyDown = (e) => {
        if (e.key === "Enter" && allergyInput.trim() !== "") {
            e.preventDefault();
            if (!form.allergies.includes(allergyInput.trim())) {
                setForm((prev) => ({
                    ...prev,
                    allergies: [...prev.allergies, allergyInput.trim()],
                }));
            }
            setAllergyInput("");
        }
    };

    const handleRemoveAllergy = (item) => {
        setForm((prev) => ({
            ...prev,
            allergies: prev.allergies.filter((a) => a !== item),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.age || !form.weight) {
            handleAlert("Vui lòng chọn đầy đủ tháng tuổi và cân nặng của bé 💕", "info");
            return;
        }

        setLoading(true);
        try {
            const res = await QuizService.step1({
                sessionId: data.sessionId,
                age: form.age,
                weight: form.weight,
                allergies: form.allergies,
            });
            if (res.data.success) {
                onNext(form);
            } else {
                handleAlert(res.data.message || "Có lỗi xảy ra!", "error");
            }
        } catch (err) {
            console.error(err);
            handleAlert("Không thể lưu thông tin bé. Vui lòng thử lại.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Paper component="form" className="step1-form" onSubmit={handleSubmit} elevation={0}>
                <Typography className="step1-title" sx={{ fontWeight: "bold", fontSize: "2.0rem", mb: 2 }}>Bước 1: Thông tin của bé</Typography>

                {/* --- Chọn tháng tuổi --- */}
                <Box className="form-group">
                    <label>Tháng tuổi</label>
                    <Box className="option-grid">
                        {ageOptions.map((opt) => (
                            <Box
                                key={opt}
                                className={`option-box ${form.age === opt ? "selected" : ""}`}
                                onClick={() => setForm((prev) => ({ ...prev, age: opt }))}
                            >
                                {opt}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* --- Chọn cân nặng --- */}
                <Box className="form-group">
                    <label>Cân nặng (kg)</label>
                    <Box className="option-grid">
                        {weightOptions.map((opt) => (
                            <Box
                                key={opt}
                                className={`option-box ${form.weight === opt ? "selected" : ""}`}
                                onClick={() => setForm((prev) => ({ ...prev, weight: opt }))}
                            >
                                {opt}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* --- Dị ứng --- */}
                <Box className="step1-form-group">
                    <label>Dị ứng thực phẩm (nếu có)</label>
                    <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        onKeyDown={handleAllergyKeyDown}
                        placeholder="Nhập thực phẩm rồi nhấn Enter"
                        className="allergy-input"
                    />

                    <Box className="allergy-tags">
                        {form.allergies.map((item, index) => (
                            <div key={index} className="tag">
                                {item}
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemoveAllergy(item)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </Box>
                </Box>

                {/* --- Nút tiếp tục (mũi tên) --- */}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        borderRadius: "50%",
                        width: 64,
                        height: 64,
                        minWidth: 0,
                        background: "linear-gradient(135deg, #72CCF1, #57BDEF)",
                        boxShadow: "0 6px 16px rgba(114, 204, 241, 0.4)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #57BDEF, #72CCF1)",
                            transform: "scale(1.05)",
                        },
                        transition: "all 0.25s ease",
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 30, color: "#fff" }} />
                    )}
                </Button>
            </Paper>

            {/* ✅ Snackbar pastel alert */}
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
        </>
    );
};

export default Step1;
