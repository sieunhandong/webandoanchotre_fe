import React, { useEffect, useState } from "react";
import { getSets, step5, getStepData } from "../../services/QuizService";
import "./step5.css";

const Step5 = ({ data, onNext, onPrev }) => {
    const [sets, setSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [loading, setLoading] = useState(false);
    const sessionId = data?.sessionId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSets();
                setSets(res.data.data || []);
                if (sessionId) {
                    const stepData = await getStepData(sessionId, 5);
                    if (stepData.data.success && stepData.data.data?.selectedSet)
                        setSelectedSet(stepData.data.data.selectedSet);
                }
            } catch (e) {
                console.error("Lỗi tải dữ liệu:", e);
            }
        };
        fetchData();
    }, [sessionId]);

    const handleNext = async () => {
        if (!selectedSet) return alert("Vui lòng chọn 1 set ăn dặm!");
        setLoading(true);
        try {
            const res = await step5({ sessionId, selectedSet });
            if (res.data.success) onNext && onNext({ selectedSet });
        } catch (err) {
            console.error(err);
            alert("Vui lòng chọn 1 set ăn dặm!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step5-wrapper">
            <div className="step5-container">
                <h2 className="step5-title">Bước 5: Gợi ý set ăn dặm phù hợp 🍼</h2>
                <p className="step5-desc">
                    Dưới đây là các set ăn dặm phù hợp với thông tin của bé. Mẹ chọn 1 set nhé!
                </p>

                <div className="step5-grid">
                    {sets.length > 0 ? (
                        sets.map((s) => (
                            <div
                                key={s._id}
                                className={`step5-card ${selectedSet === s._id ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedSet(s._id)}
                            >
                                <h3>{s.title}</h3>
                                <p className="step5-card-desc">{s.description}</p>
                                <div className="step5-info">
                                    <span>⏱ {s.duration} ngày</span>
                                    <span>💰 {s.price.toLocaleString()}đ</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Đang tải danh sách set ăn dặm...</p>
                    )}
                </div>
            </div>

            <div className="step5-btn-group">
                <button onClick={onPrev} className="step5-btn step5-btn-back">
                    ← Quay lại
                </button>
                <button
                    onClick={handleNext}
                    className="step5-btn step5-btn-next"
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : "Tiếp tục →"}
                </button>
            </div>
        </div>
    );
};

export default Step5;
