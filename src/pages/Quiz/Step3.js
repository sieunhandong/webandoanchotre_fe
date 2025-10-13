import React, { useEffect, useState } from "react";
import { getCategoriesProducts, step3, getStepData } from "../../services/QuizService";
import "./Quiz.css";
const Step3 = ({ data, onNext, onPrev }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    const sessionId = data?.sessionId;

    useEffect(() => {
        getCategoriesProducts().then((res) => {
            setCategories(res.data.data.categories);
            setProducts(res.data.data.products);
        });
        if (sessionId) {
            getStepData(sessionId, 3).then((res) => {
                if (res.data.success && res.data.data.selectedProducts)
                    setSelected(res.data.data.selectedProducts);
            });
        }
    }, [sessionId]);

    const toggleProduct = (id) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

    const handleNext = async () => {
        if (selected.length === 0) return alert("Vui lòng chọn ít nhất 1 nguyên liệu!");
        const res = await step3({ sessionId, selectedProducts: selected });
        if (res.data.success) onNext();
    };

    return (
        <div className="quiz-step">
            <h2>Bước 3: Chọn nguyên liệu sẵn có</h2>
            {categories.map((cat) => (
                <div key={cat._id}>
                    <h4>{cat.name}</h4>
                    <div className="option-grid">
                        {products.filter(p => p.category?._id === cat._id).map(p => (
                            <button
                                key={p._id}
                                onClick={() => toggleProduct(p._id)}
                                className={selected.includes(p._id) ? "selected" : ""}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <div className="button-row">
                <button onClick={onPrev}>← Quay lại</button>
                <button onClick={handleNext} className="btn-primary">Tiếp tục →</button>
            </div>
        </div>
    );
};

export default Step3;
