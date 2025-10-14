import React, { useEffect, useState } from "react";
import { step6 } from "../../services/QuizService";
import "./step6.css";

const Step6 = ({ data, onNext, onPrev }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [agree, setAgree] = useState(false);
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

    if (loading)
        return <p className="loading">Đang tải dữ liệu tổng hợp...</p>;

    if (!summary)
        return <p className="loading">Không có dữ liệu tổng hợp nào được tìm thấy.</p>;

    const { childInfo, selectedProducts, selectedSet, suggestedMenu } = summary;

    return (
        <div className="step6-wrapper">
            <div className="step6-container">
                <h2 className="step6-title">Bước 6: Kết quả gợi ý cho bé 🎉</h2>

                {/* --- Thông tin bé --- */}
                <div className="step6-section">
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
                <div className="step6-section">
                    <h3>🥦 Nguyên liệu sẵn có</h3>
                    <div className="step6-ingredients">
                        {selectedProducts?.map((p, i) => (
                            <div key={i} className="ingredient-chip">
                                {p.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Set ăn dặm --- */}
                <div className="step6-section">
                    <h3>🍱 Set ăn dặm đã chọn</h3>
                    {selectedSet ? (
                        <div className="step6-setbox">
                            <p><strong>Tên:</strong> {selectedSet.name}</p>
                            <p><strong>Thời gian:</strong> {selectedSet.duration} ngày</p>
                            <p><strong>Giá:</strong> {selectedSet.price.toLocaleString()}đ</p>
                        </div>
                    ) : (
                        <p>Chưa chọn set ăn dặm.</p>
                    )}
                </div>

                {/* --- Điều khoản --- */}
                <div className="step6-agree">
                    <label>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />{" "}
                        Tôi đồng ý với <a href="#">điều khoản và chính sách</a> của chương trình.
                    </label>
                </div>
            </div>

            {/* --- Nút điều hướng cố định --- */}
            <div className="step6-btn-group">
                <button onClick={onPrev} className="step6-btn step6-btn-back">
                    ← Quay lại
                </button>
                <button
                    onClick={() => agree && onNext()}
                    className={`step6-btn step6-btn-next ${!agree ? "disabled" : ""}`}
                    disabled={!agree}
                >
                    Thanh toán →
                </button>
            </div>
        </div>
    );
};

export default Step6;
