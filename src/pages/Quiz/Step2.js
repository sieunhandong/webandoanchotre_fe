import React, { useState, useEffect } from "react";
import { step2, getStepData } from "../../services/QuizService";
import "./Quiz.css"
const Step2 = ({ data, onNext, onPrev }) => {
    const [feedingMethod, setFeedingMethod] = useState("");
    const [loading, setLoading] = useState(false);
    console.log(data?.sessionId)
    useEffect(() => {
        if (data?.sessionId) {
            getStepData(data.sessionId, 2).then((res) => {
                if (res.data?.success && res.data.data?.feedingMethod) {
                    setFeedingMethod(res.data.data.feedingMethod);
                }
            });
        }
    }, [data]);

    const handleSubmit = async () => {
        if (!feedingMethod) {
            alert("Vui lòng chọn phương pháp ăn dặm phù hợp!");
            return;
        }
        setLoading(true);
        try {
            const res = await step2({
                sessionId: data.sessionId,
                feedingMethod,
            });
            if (res.data?.success) {
                onNext({ feedingMethod });
            }
        } catch (err) {
            console.error("Lỗi gửi dữ liệu:", err);
            alert("Gửi dữ liệu thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-step">
            <div className="quiz-container">
                <h2 className="quiz-title">Bước 2: Chọn phương pháp ăn dặm của bé</h2>
                <p className="quiz-desc">
                    Mỗi bé sẽ phù hợp với một phương pháp khác nhau — mẹ chọn cách mình
                    đang hoặc muốn áp dụng nhé!
                </p>

                <div className="options">
                    {[
                        { id: "traditional", label: "Ăn dặm truyền thống" },
                        { id: "blw", label: "Ăn dặm tự chỉ huy (BLW)" },
                        { id: "mixed", label: "Ăn dặm kết hợp" },
                    ].map((item) => (
                        <label key={item.id} className="option-item">
                            <input
                                type="radio"
                                name="feedingMethod"
                                value={item.id}
                                checked={feedingMethod === item.id}
                                onChange={() => setFeedingMethod(item.id)}
                            />
                            <span className="checkmark"></span>
                            {item.label}
                        </label>
                    ))}
                </div>

                <div className="btn-group">
                    <button onClick={onPrev} className="btn btn-back">
                        ← Quay lại
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn btn-next"
                    >
                        {loading ? "Đang gửi..." : "Tiếp tục →"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2;
