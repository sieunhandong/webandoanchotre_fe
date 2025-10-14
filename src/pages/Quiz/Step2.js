import React, { useState, useEffect } from "react";
import { step2, getStepData } from "../../services/QuizService";
import "./step2.css";

const Step2 = ({ data, onNext, onPrev }) => {
    const [feedingMethod, setFeedingMethod] = useState("");
    const [loading, setLoading] = useState(false);

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

    const options = [
        {
            id: "traditional",
            label: "Ăn dặm truyền thống",
            desc: "Bé ăn cháo loãng, mẹ đút từng thìa.",
        },
        {
            id: "blw",
            label: "Ăn dặm tự chỉ huy (BLW)",
            desc: "Bé tự cầm nắm thức ăn, khám phá mùi vị.",
        },
        {
            id: "japanese",
            label: "Ăn dặm kiểu Nhật",
            desc: "Bé ăn theo giai đoạn, rèn kỹ năng ăn riêng biệt.",
        },
    ];

    return (
        <div className="step2-wrapper">
            <div className="step2-container">
                <h2 className="step2-title">Bước 2: Chọn phương pháp ăn dặm của bé</h2>
                <p className="step2-desc">
                    Mỗi bé sẽ phù hợp với một phương pháp khác nhau — mẹ chọn cách mình
                    đang hoặc muốn áp dụng nhé!
                </p>

                <div className="step2-option-grid">
                    {options.map((item) => (
                        <div
                            key={item.id}
                            className={`step2-card ${feedingMethod === item.id ? "active" : ""}`}
                            onClick={() => setFeedingMethod(item.id)}
                        >
                            <div className="step2-card-title">{item.label}</div>
                            <p className="step2-card-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="step2-btn-group">
                    <button onClick={onPrev} className="step2-btn step2-btn-back">
                        ← Quay lại
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="step2-btn step2-btn-next"
                    >
                        {loading ? "Đang gửi..." : "Tiếp tục →"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2;
