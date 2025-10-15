import React, { useEffect, useState } from "react";
import { step4 } from "../../services/QuizService";
import "./step4.css";

const Step4 = ({ data, onNext, onPrev }) => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Nếu đã có mealSuggestions (từ step trước hoặc localStorage) → dùng lại, không gọi lại AI
        const savedMenu = data?.mealSuggestions || JSON.parse(localStorage.getItem("quiz_mealSuggestions") || "[]");

        if (savedMenu.length > 0) {
            setMenu(savedMenu);
        } else if (data?.sessionId) {
            fetchMenu(data.sessionId);
        }
    }, [data?.sessionId]);

    const fetchMenu = async (sessionId) => {
        setLoading(true);
        try {
            const res = await step4({ sessionId });
            if (res.data.success && res.data.data.menu) {
                const suggestedMenu = res.data.data.menu;
                setMenu(suggestedMenu);
                // Lưu lại localStorage để khi quay lại không cần gọi AI lần nữa
                localStorage.setItem("quiz_mealSuggestions", JSON.stringify(suggestedMenu));
            } else {
                alert("Không nhận được dữ liệu thực đơn!");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lấy gợi ý thực đơn!");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        // Truyền menu sang bước tiếp theo
        onNext && onNext({ menu });
    };

    return (
        <div className="step4-wrapper">
            <div className="step4-container">
                <h2 className="step4-title">Bước 4: Gợi ý thực đơn cho bé 🍽️</h2>

                {loading ? (
                    <p className="step4-loading">Đang tạo thực đơn phù hợp cho bé... 🍲</p>
                ) : (
                    <>
                        {menu.length > 0 ? (
                            <div className="step4-menu-list">
                                {menu.map((dayItem, index) => (
                                    <div key={index} className="step4-day-card">
                                        <h3 className="step4-day-title">📅 Ngày {dayItem.day}</h3>
                                        <ul className="step4-meal-list">
                                            {dayItem.meals.map((meal, i) => (
                                                <li key={i} className="step4-meal-item">
                                                    {meal}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="step4-empty">Chưa có gợi ý nào. Vui lòng thử lại.</p>
                        )}
                    </>
                )}
            </div>

            <div className="step4-btn-group">
                <button onClick={onPrev} className="step4-btn step4-btn-back">
                    ← Quay lại
                </button>
                <button
                    onClick={handleNext}
                    className="step4-btn step4-btn-next"
                    disabled={loading}
                >
                    Tiếp tục →
                </button>
            </div>
        </div>
    );
};

export default Step4;
