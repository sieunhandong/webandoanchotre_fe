import React, { useEffect, useState } from "react";
import { getCategoriesProducts, step3, getStepData } from "../../services/QuizService";
import "./step3.css";

const Step3 = ({ data, onNext, onPrev }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const sessionId = data?.sessionId;

    // ✅ Lấy danh mục & sản phẩm
    useEffect(() => {
        getCategoriesProducts().then((res) => {
            const { categories, products } = res.data.data;
            setCategories(categories);
            setProducts(products);
            if (categories.length > 0) setSelectedCategory(categories[0]._id);
        });

        // ✅ Lấy dữ liệu đã chọn nếu có
        if (sessionId) {
            getStepData(sessionId, 3).then((res) => {
                if (res.data.success && res.data.data.selectedProducts)
                    setSelectedProducts(res.data.data.selectedProducts);
            });
        }
    }, [sessionId]);

    // ✅ Toggle chọn sản phẩm
    const toggleProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleNext = async () => {
        if (selectedProducts.length === 0)
            return alert("Vui lòng chọn ít nhất 1 nguyên liệu!");
        const res = await step3({ sessionId, selectedProducts });
        if (res.data.success) onNext();
    };

    return (
        <div className="step3-wrapper">
            <div className="step3-container">
                <h2 className="step3-title">Bước 3: Chọn nguyên liệu sẵn có</h2>

                {/* Danh mục */}
                <div className="step3-category-list">
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            className={`step3-category-item ${selectedCategory === cat._id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat._id)}
                        >
                            <div className="step3-category-header">
                                <span>{cat.name}</span>
                            </div>

                            {/* Ảnh sản phẩm đã chọn thuộc category này */}
                            <div className="step3-category-selected">
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
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sản phẩm */}
                <div className="step3-products-grid">
                    {products
                        .filter((p) => p.category?._id === selectedCategory)
                        .map((p) => (
                            <div
                                key={p._id}
                                className={`step3-product-card ${selectedProducts.includes(p._id) ? "selected" : ""}`}
                                onClick={() => toggleProduct(p._id)}
                            >
                                <div className="step3-product-img">
                                    <img src={p.image || "/no-image.jpg"} alt={p.name} />
                                </div>
                                <div className="step3-product-name">{p.name}</div>
                            </div>
                        ))}
                </div>

                {/* Nút điều hướng */}
                <div className="step3-btn-group">
                    <button onClick={onPrev} className="step3-btn step3-btn-back">
                        ← Quay lại
                    </button>
                    <button onClick={handleNext} className="step3-btn step3-btn-next">
                        Tiếp tục →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step3;
