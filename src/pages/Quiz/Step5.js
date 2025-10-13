// src/pages/Quiz/Step5.js
import React, { useEffect, useState } from "react";
import { getSets, step5, getStepData } from "../../services/QuizService";

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
            alert("Gửi dữ liệu thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-step">
            <div className="quiz-box">
                <h2 className="quiz-title">Bước 5: Gợi ý set ăn dặm phù hợp</h2>

                <div className="option-grid">
                    {sets.length > 0 ? (
                        sets.map((s) => (
                            <div
                                key={s._id}
                                className={`option-card ${selectedSet === s._id ? "selected" : ""}`}
                                onClick={() => setSelectedSet(s._id)}
                            >
                                <h3>{s.title}</h3>
                                <p>{s.description}</p>
                                <p>
                                    <strong>Thời gian:</strong> {s.duration} ngày
                                </p>
                                <p>
                                    <strong>Giá:</strong> {s.price.toLocaleString()}đ
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>Đang tải danh sách set ăn dặm...</p>
                    )}
                </div>

                <div className="button-row">
                    <button onClick={onPrev} className="btn-secondary">
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

export default Step5;
