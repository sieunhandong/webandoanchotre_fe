import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Grid,
    Avatar,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { getCategories } from "../../services/CategoryService";
import { getProductsByCategory } from "../../services/BookService";
import { createOrUpdateProfile } from "../../services/QuizService";

export default function Step3ChooseProducts({ data = {}, onBack, onNext }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(data.selectedProducts || []);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    // ✅ Lấy danh mục khi load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                const list = Array.isArray(res.data)
                    ? res.data
                    : res.data?.categories || [];
                setCategories(list);

                // chọn danh mục đầu tiên mặc định
                if (list.length > 0) setSelectedCategory(list[0]._id);
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
                setAlert({ open: true, message: "Không tải được danh mục", severity: "error" });
            }
        };
        fetchCategories();
    }, []);

    // ✅ Lấy sản phẩm theo danh mục
    useEffect(() => {
        if (!selectedCategory) return;
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await getProductsByCategory(selectedCategory);
                setProducts(res.data || []);
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
                setAlert({ open: true, message: "Không tải được sản phẩm", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

    // ✅ Chọn / bỏ chọn sản phẩm
    const toggleProduct = (product) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p._id === product._id);
            if (exists) return prev.filter((p) => p._id !== product._id);
            return [...prev, product];
        });
    };

    // ✅ Lưu & tiếp tục
    const handleNext = async () => {
        try {
            const payload = {
                monthAge: data.monthAge,
                height: data.height,
                weight: data.weight,
                gender: data.gender,
                likes: data.likes || [],
                dislikes: data.dislikes || [],
                allergies: data.allergies || [],
                method: data.method,
                selectedProducts: selectedProducts.map((p) => p._id),
            };

            await createOrUpdateProfile(payload);
            setAlert({ open: true, message: "Đã lưu lựa chọn thành công", severity: "success" });

            // cập nhật lại cho parent
            onNext({ selectedProducts });
        } catch (err) {
            console.error("Lỗi khi lưu sản phẩm:", err);
            setAlert({
                open: true,
                message: err?.response?.data?.message || "Lỗi khi lưu lựa chọn",
                severity: "error",
            });
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Bước 3 — Chọn nguyên liệu hoặc sản phẩm bé yêu thích
            </Typography>

            {/* ✅ Các sản phẩm đã chọn */}
            {selectedProducts.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {selectedProducts.map((p) => (
                        <Avatar
                            key={p._id}
                            src={p.image}
                            alt={p.name}
                            sx={{
                                width: 48,
                                height: 48,
                                border: "2px solid #C49A6C",
                                cursor: "pointer",
                            }}
                            onClick={() => toggleProduct(p)}
                        />
                    ))}
                </Box>
            )}

            {/* ✅ Thanh chọn danh mục */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                {categories?.map((cat) => (
                    <Button
                        key={cat._id}
                        variant={selectedCategory === cat._id ? "contained" : "outlined"}
                        onClick={() => setSelectedCategory(cat._id)}
                        sx={{
                            borderRadius: 4,
                            borderColor: "#C49A6C",
                            color: selectedCategory === cat._id ? "#fff" : "#C49A6C",
                            backgroundColor:
                                selectedCategory === cat._id ? "#C49A6C" : "transparent",
                        }}
                    >
                        {cat.name}
                    </Button>
                ))}
            </Box>

            {/* ✅ Sản phẩm */}
            <Paper sx={{ p: 2, minHeight: 300 }}>
                {loading ? (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {products.map((p) => {
                            const isSelected = selectedProducts.some((sp) => sp._id === p._id);
                            return (
                                <Grid item xs={6} sm={4} md={3} key={p._id}>
                                    <Box
                                        onClick={() => toggleProduct(p)}
                                        sx={{
                                            border: isSelected ? "2px solid #C49A6C" : "1px solid #eee",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            transition: "transform 0.2s ease",
                                            "&:hover": { transform: "scale(1.03)" },
                                        }}
                                    >
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            style={{
                                                width: "100%",
                                                height: 140,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            align="center"
                                            sx={{ p: 1, color: isSelected ? "#C49A6C" : "#333" }}
                                        >
                                            {p.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Paper>

            {/* ✅ Nút điều hướng */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={onBack}>Quay lại</Button>
                <Button variant="contained" onClick={handleNext} disabled={loading}>
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
