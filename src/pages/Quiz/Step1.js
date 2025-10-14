import React, { useState } from "react";
import * as QuizService from "../../services/QuizService";
import "./step1.css";

const Step1 = ({ data, onNext }) => {
    const [form, setForm] = useState({
        age: "",
        weight: "",
        allergies: [],
    });
    const [allergyInput, setAllergyInput] = useState("");
    const [loading, setLoading] = useState(false);

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
            alert("Vui lòng chọn đầy đủ tháng tuổi và cân nặng của bé");
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
                alert(res.data.message || "Có lỗi xảy ra!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể lưu thông tin bé. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="step1-form" onSubmit={handleSubmit}>
            {/* <h2 className="step1-title">Bước 1: Thông tin của bé</h2> */}

            {/* --- Chọn tháng tuổi --- */}
            <div className="form-group">
                <label>Tháng tuổi</label>
                <div className="option-grid">
                    {ageOptions.map((opt) => (
                        <div
                            key={opt}
                            className={`option-box ${form.age === opt ? "selected" : ""}`}
                            onClick={() => setForm((prev) => ({ ...prev, age: opt }))}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Chọn cân nặng --- */}
            <div className="form-group">
                <label>Cân nặng (kg)</label>
                <div className="option-grid">
                    {weightOptions.map((opt) => (
                        <div
                            key={opt}
                            className={`option-box ${form.weight === opt ? "selected" : ""}`}
                            onClick={() => setForm((prev) => ({ ...prev, weight: opt }))}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Dị ứng --- */}
            <div className="form-group">
                <label>Dị ứng thực phẩm (nếu có)</label>
                <input
                    type="text"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={handleAllergyKeyDown}
                    placeholder="Nhập thực phẩm rồi nhấn Enter"
                    className="allergy-input"
                />

                <div className="allergy-tags">
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
                </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Đang lưu..." : "Tiếp tục"}
            </button>
        </form>
    );
};

export default Step1;
