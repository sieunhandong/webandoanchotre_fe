// pages/Quiz/Step2Method.jsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";
import { createOrUpdateProfile } from "../../services/QuizService";

export default function Step2Method({ data = {}, onBack, onNext }) {
    const [method, setMethod] = useState(data.method || "traditional");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    const handleSaveAndNext = async () => {
        // Prepare payload - include step1 fields too so backend has full profile
        const payload = {
            monthAge: data.monthAge,
            height: data.height,
            weight: data.weight,
            gender: data.gender,
            likes: data.likes || [],
            dislikes: data.dislikes || [],
            allergies: data.allergies || [],
            method,
        };


        // minimal client validation
        if (!payload.monthAge || !payload.height || !payload.weight) {
            setAlert({ open: true, message: "Vui lòng hoàn thành thông tin bước 1 trước", severity: "error" });
            return;
        }

        setLoading(true);
        try {
            await createOrUpdateProfile(payload);
            setAlert({ open: true, message: "Lưu hồ sơ thành công", severity: "success" });
            // trả dữ liệu mới lên parent
            onNext({ method });
        } catch (err) {
            console.error("Lỗi lưu profile:", err);
            setAlert({ open: true, message: err?.response?.data?.message || "Lỗi khi lưu hồ sơ", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Bước 2 — Chọn phương pháp ăn dặm
            </Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Chọn phương pháp ăn dặm phù hợp
                </Typography>

                <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
                    <FormControlLabel value="traditional" control={<Radio />} label="Ăn dặm truyền thống" />
                    <FormControlLabel value="blw" control={<Radio />} label="BLW (ăn tự chỉ huy)" />
                    <FormControlLabel value="mixed" control={<Radio />} label="Kết hợp (mixed)" />
                </RadioGroup>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Mỗi phương pháp có cách chuẩn bị món và kết cấu khác nhau — AI sẽ sinh thực đơn phù hợp với phương pháp bạn chọn.
                </Typography>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={onBack}>Quay lại</Button>
                <Button variant="contained" onClick={handleSaveAndNext} disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu & Tiếp tục"}
                </Button>
            </Box>

            <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert((a) => ({ ...a, open: false }))}>
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
}
