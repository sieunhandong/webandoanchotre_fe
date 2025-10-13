// src/pages/Quiz/Step6.js
import React, { useEffect, useState } from "react";
import { step6 } from "../../services/QuizService";

const Step6 = ({ data, onNext, onPrev }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const sessionId = data?.sessionId;

    useEffect(() => {
        if (sessionId) {
            setLoading(true);
            step6(sessionId)
                .then((res) => {
                    if (res.data.success) setSummary(res.data.data);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [sessionId]);

    if (loading) return <p className="loading">Đang tải dữ liệu tổng hợp...</p>;

    if (!summary)
        return <p className="loading">Không có dữ liệu tổng hợp nào được tìm thấy.</p>;

    const { childInfo, selectedProducts, selectedSet, suggestedMenu } = summary;

    return (
        <div className="quiz-step">
            <div className="quiz-box">
                <h2 className="quiz-title">Bước 6: Kết quả gợi ý cho bé</h2>

                {/* --- Thông tin bé --- */}
                <div className="summary-section">
                    <h3>👶 Thông tin bé</h3>
                    <ul>
                        <li><strong>Tháng tuổi:</strong> {childInfo?.age}</li>
                        <li><strong>Cân nặng:</strong> {childInfo?.weight} kg</li>
                        <li><strong>Phương pháp ăn dặm:</strong> {childInfo?.feedingMethod}</li>
                        <li>
                            <strong>Dị ứng:</strong>{" "}
                            {childInfo?.allergies?.length
                                ? childInfo.allergies.join(", ")
                                : "Không có"}
                        </li>
                    </ul>
                </div>

                {/* --- Nguyên liệu đã chọn --- */}
                <div className="summary-section">
                    <h3>🥦 Nguyên liệu sẵn có</h3>
                    <ul>
                        {selectedProducts?.map((p, i) => (
                            <li key={i}>
                                {p.name} <span className="text-muted">({p.category})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Set ăn dặm --- */}
                <div className="summary-section">
                    <h3>🍱 Set ăn dặm đã chọn</h3>
                    {selectedSet ? (
                        <div className="set-box">
                            <p><strong>Tên:</strong> {selectedSet.name}</p>
                            <p><strong>Thời gian:</strong> {selectedSet.duration} ngày</p>
                            <p><strong>Giá:</strong> {selectedSet.price.toLocaleString()}đ</p>
                        </div>
                    ) : (
                        <p>Chưa chọn set ăn dặm.</p>
                    )}
                </div>

                {/* --- Thực đơn 7 ngày --- */}
                <div className="summary-section">
                    <h3>🍽️ Gợi ý thực đơn 7 ngày</h3>
                    <div className="menu-list">
                        {suggestedMenu?.map((item) => (
                            <div key={item._id || item.day} className="menu-item">
                                <h4>Ngày {item.day}</h4>
                                <p><strong>Món:</strong> {item.menu}</p>
                                <p><strong>Lý do:</strong> {item.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Nút điều hướng --- */}
                <div className="button-row">
                    <button onClick={onPrev} className="btn-secondary">
                        ← Quay lại
                    </button>
                    <button onClick={onNext} className="btn-primary">
                        Thanh toán →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step6;
