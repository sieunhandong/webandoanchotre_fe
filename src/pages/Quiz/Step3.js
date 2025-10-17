import React, { useEffect, useState } from "react";
import {
    IconButton,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Box,
    Typography,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { getCategoriesProducts, step3, getStepData } from "../../services/QuizService";
import "./step3.css";

const Step3 = ({ data, onNext, onPrev }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const sessionId = data?.sessionId;

    useEffect(() => {
        getCategoriesProducts().then((res) => {
            const { categories, products } = res.data.data;
            setCategories(categories);
            setProducts(products);
            if (categories.length > 0) setSelectedCategory(categories[0]._id);
        });

        if (sessionId) {
            getStepData(sessionId, 3).then((res) => {
                if (res.data.success && res.data.data.selectedProducts)
                    setSelectedProducts(res.data.data.selectedProducts);
            });
        }
    }, [sessionId]);

    const toggleProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleNext = async () => {
        if (selectedProducts.length === 0) {
            setSnackbar({ open: true, message: "Vui lòng chọn ít nhất 1 nguyên liệu!", severity: "warning" });
            return;
        }

        setLoading(true);
        try {
            const res = await step3({ sessionId, selectedProducts });
            if (res.data.success) {
                // setSnackbar({ open: true, message: "Đã lưu thành công!", severity: "success" });
                setTimeout(onNext, 800);
            } else {
                setSnackbar({ open: true, message: "Đã có lỗi xảy ra!", severity: "error" });
            }
        } catch (err) {
            setSnackbar({ open: true, message: "Lỗi kết nối máy chủ!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="step3-wrapper">
            <Box className="step3-container">
                <Typography
                    variant="h4"
                    className="step3-title"
                    sx={{ fontWeight: 700, color: "#72CCF1", mb: 5 }}
                >
                    Bước 3: Chọn nguyên liệu sẵn có
                </Typography>


                {/* Danh mục */}
                <Box className="step3-category-list">
                    {categories.map((cat) => (
                        <Box
                            key={cat._id}
                            className={`step3-category-item ${selectedCategory === cat._id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat._id)}
                        >
                            <Typography className="step3-category-header" sx={{ fontSize: "20px", mb: 1 }}>{cat.name}</Typography>
                            <Box className="step3-category-selected">
                                {selectedProducts
                                    .map((id) => products.find((p) => p._id === id))
                                    .filter((p) => p && p.category?._id === cat._id)
                                    .map((p) => (
                                        <img
                                            key={p._id}
                                            src={p.image || "/no-image.jpg"}
                                            alt={p.name}
                                            className="step3-selected-thumb"
                                        />
                                    ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Sản phẩm */}
                <Box className="step3-products-grid">
                    {products
                        .filter((p) => p.category?._id === selectedCategory)
                        .map((p) => (
                            <Box
                                key={p._id}
                                className={`step3-product-card ${selectedProducts.includes(p._id) ? "selected" : ""}`}
                                onClick={() => toggleProduct(p._id)}
                            >
                                <Box className="step3-product-img">
                                    <img src={p.image || "/no-image.jpg"} alt={p.name} />
                                </Box>
                                <Typography className="step3-product-name">{p.name}</Typography>
                            </Box>
                        ))}
                </Box>

                {/* Nút điều hướng */}
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

            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Step3;
