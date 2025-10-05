// pages/Quiz/Step4AIMealSuggestion.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { getMealSuggestions, createOrUpdateProfile } from "../../services/QuizService";

export default function Step4AIMealSuggestion({ data = {}, onBack, onNext }) {
    const [meals, setMeals] = useState(data.meals || []);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    /** ✅ Gọi AI backend */
    const fetchAIMeals = async () => {
        try {
            setLoading(true);

            const payload = {
                monthAge: data.monthAge,
                height: data.height,
                weight: data.weight,
                gender: data.gender,
                likes: data.likes || [],
                dislikes: data.dislikes || [],
                allergies: data.allergies || [],
                method: data.method,
                selectedProducts: data.selectedProducts?.map((p) => p._id) || [],
            };

            const res = await getMealSuggestions(payload);
            const aiMeals = res?.data?.sets || res?.data?.meals || [];

            if (!aiMeals.length) throw new Error("AI chưa trả về thực đơn phù hợp.");

            setMeals(aiMeals);
            setAlert({ open: true, message: "AI đã gợi ý thực đơn thành công!", severity: "success" });

            // ✅ Tự động lưu vào DB
            await createOrUpdateProfile({
                ...data,
                meals: aiMeals,
            });
        } catch (err) {
            console.error("❌ Lỗi khi gọi AI:", err);
            setAlert({
                open: true,
                message: err?.response?.data?.error || "Lỗi khi AI gợi ý thực đơn.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    /** ✅ Gọi AI ngay khi bước 4 được render */
    useEffect(() => {
        if (!meals.length) {
            fetchAIMeals();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** ✅ Lưu & sang bước tiếp */
    const handleSaveAndNext = async () => {
        try {
            if (!meals.length) {
                setAlert({ open: true, message: "Chưa có thực đơn để lưu.", severity: "warning" });
                return;
            }

            await createOrUpdateProfile({
                ...data,
                meals,
            });

            setAlert({ open: true, message: "Đã lưu thực đơn vào hồ sơ!", severity: "success" });
            onNext({ meals });
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
            setAlert({
                open: true,
                message: err?.response?.data?.message || "Không thể lưu thực đơn.",
                severity: "error",
            });
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Bước 4 — AI gợi ý thực đơn cho bé
            </Typography>

            <Paper sx={{ p: 3, minHeight: 300, mb: 3 }}>
                {loading ? (
                    <Box sx={{ textAlign: "center", mt: 6 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>AI đang tạo thực đơn phù hợp cho bé...</Typography>
                    </Box>
                ) : meals.length > 0 ? (
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: "#C49A6C" }}>
                            🍽️ Thực đơn gợi ý bởi AI:
                        </Typography>
                        <List>
                            {meals.map((meal, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={meal.title || meal.name || `Ngày ${index + 1}`}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {meal.description || meal.menu || "Không có thông tin chi tiết"}
                                                    </Typography>
                                                    {meal.reason && (
                                                        <Typography
                                                            component="div"
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            Lý do: {meal.reason}
                                                        </Typography>
                                                    )}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < meals.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                ) : (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography variant="body1">Không có thực đơn nào để hiển thị.</Typography>
                        <Button variant="contained" onClick={fetchAIMeals} sx={{ mt: 2 }}>
                            Gợi ý lại
                        </Button>
                    </Box>
                )}
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={onBack}>Quay lại</Button>
                <Button variant="contained" onClick={handleSaveAndNext} disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu & Tiếp tục"}
                </Button>
            </Box>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert((a) => ({ ...a, open: false }))}
            >
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
}
