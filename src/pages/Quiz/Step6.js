import React, { useEffect, useState } from "react";
import { step6 } from "../../services/QuizService";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
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
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [sessionId]);

    if (loading) return <p className="loading">Đang tải dữ liệu tổng hợp...</p>;
    if (!summary)
        return <p className="loading">Không có dữ liệu tổng hợp nào được tìm thấy.</p>;

    const { childInfo, selectedProducts, selectedSet } = summary;
    const getFeedingMethodLabel = (method) => {
        switch (method) {
            case "traditional":
                return "Ăn dặm truyền thống";
            case "blw":
                return "Ăn dặm tự chỉ huy (BLW)";
            case "japanese":
                return "Ăn dặm kiểu Nhật";
            default:
                return "Không xác định";
        }
    };

    return (
        <div className="step6-wrapper">
            <h1 className="step6-header">Bước 6: Kết quả gợi ý cho bé 🎉</h1>

            <div className="step6-content">
                {/* --- Cột trái --- */}
                <div className="step6-left">
                    <div className="step6-card">
                        <h3>👶 Thông tin bé</h3>
                        <ul>
                            <li><strong>Tháng tuổi:</strong> {childInfo?.age}</li>
                            <li><strong>Cân nặng:</strong> {childInfo?.weight} kg</li>
                            <li><strong>Phương pháp ăn dặm:</strong> {getFeedingMethodLabel(childInfo?.feedingMethod)}</li>
                            <li>
                                <strong>Dị ứng:</strong>{" "}
                                {childInfo?.allergies?.length
                                    ? childInfo.allergies.join(", ")
                                    : "Không có"}
                            </li>
                        </ul>
                    </div>

                    <div className="step6-card">
                        <h3>🥦 Nguyên đã chọn</h3>
                        <div className="step6-ingredients">
                            {selectedProducts?.length ? (
                                selectedProducts.map((p, i) => (
                                    <div key={i} className="ingredient-chip">
                                        {p.name}
                                    </div>
                                ))
                            ) : (
                                <p>Chưa chọn nguyên liệu nào.</p>
                            )}
                        </div>
                    </div>

                    <div className="step6-card">
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
                </div>

                {/* --- Cột phải (Điều khoản) --- */}
                <div className="step6-right">
                    <div className="step6-card">
                        <h3>📜 Điều khoản & Chính sách</h3>
                        <p>
                            Chúng tôi cam kết bảo mật thông tin của bạn và chỉ sử dụng dữ liệu
                            cho mục đích gợi ý thực đơn phù hợp cho bé.
                            Vui lòng đọc kỹ và xác nhận đồng ý để tiếp tục.
                        </p>
                        <label className="step6-agree">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />{" "}
                            Tôi đồng ý với <a href="#">điều khoản & chính sách</a>.
                        </label>
                    </div>
                </div>
            </div>

            {/* --- Nút cố định giống step4 --- */}
            <div className="step4-btn-group">
                <button
                    onClick={onPrev}
                    className="step4-btn step4-btn-back"
                    aria-label="Quay lại"
                >
                    <ArrowBackIosNewRoundedIcon />
                </button>
                <button
                    onClick={() => agree && onNext()}
                    className={`step4-btn step4-btn-next ${!agree ? "disabled" : ""}`}
                    disabled={!agree}
                    aria-label="Tiếp tục"
                >
                    <ArrowForwardIosRoundedIcon />
                </button>
            </div>
        </div>
    );
};

export default Step6;
