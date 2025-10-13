// src/pages/Quiz/Step4.js
import React, { useEffect, useState } from "react";
import { step4 } from "../../services/QuizService";

const Step4 = ({ data, onNext, onPrev }) => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data?.sessionId) {
            fetchMenu(data.sessionId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.sessionId]);

    const fetchMenu = async (sessionId) => {
        setLoading(true);
        try {
            const res = await step4({ sessionId });
            if (res.data.success && res.data.data.menu) {
                setMenu(res.data.data.menu);
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
        onNext && onNext({ menu });
    };

    const handlePrev = () => {
        onPrev && onPrev();
    };

    return (
        <div className="quiz-step">
            <div className="quiz-box">
                <h2 className="quiz-title">Bước 4: Gợi ý thực đơn cho bé</h2>

                {loading ? (
                    <p className="loading">Đang tạo thực đơn phù hợp cho bé... 🍲</p>
                ) : (
                    <>
                        {menu.length > 0 ? (
                            <div className="menu-list">
                                {menu.map((item, index) => (
                                    <div key={index} className="menu-item">
                                        <h4>Ngày {item.day}</h4>
                                        <p>
                                            <strong>Món:</strong> {item.menu}
                                        </p>
                                        <p>
                                            <strong>Lý do:</strong> {item.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Chưa có gợi ý nào. Vui lòng thử lại.</p>
                        )}
                    </>
                )}

                <div className="button-row">
                    <button onClick={handlePrev} className="btn-secondary">
                        ← Quay lại
                    </button>
                    <button
                        onClick={handleNext}
                        className="btn-primary"
                        disabled={loading}
                    >
                        Tiếp tục →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step4;
