import React, { useEffect, useState } from "react";
import { step7 } from "../../services/QuizService";
import { getMealSetById } from "../../services/MealSetService";
import { getProvinces, getDistricts, getWards } from "../../services/GHNService";
import { useNavigate, useLocation } from "react-router-dom";
import "./step7.css";
import { deleteOrder, getOrderStatus } from "../../services/OrderService";

const Step7 = ({ data, onPrev }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const sessionId = data?.sessionId || localStorage.getItem("quiz_sessionId");
    const selectedSetId =
        data?.selectedSet || data?.selectedSetId || localStorage.getItem("quiz_selectedSetId");

    const [selectedSet, setSelectedSet] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState("");
    const [loading, setLoading] = useState(false);

    const [qrUrl, setQrUrl] = useState(null); // ✅ QR Sepay
    const [orderCode, setOrderCode] = useState(null);
    const [countdown, setCountdown] = useState(180);
    const [polling, setPolling] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [address, setAddress] = useState({
        address: "",
        provinceId: "",
        provinceName: "",
        districtId: "",
        districtName: "",
        wardCode: "",
        wardName: "",
    });

    // ===== Lưu session tạm =====
    useEffect(() => {
        if (data?.sessionId) localStorage.setItem("quiz_sessionId", data.sessionId);
        if (data?.selectedSet || data?.selectedSetId)
            localStorage.setItem("quiz_selectedSetId", data.selectedSet || data.selectedSetId);
    }, [data]);

    useEffect(() => {
        localStorage.setItem("quiz_current_step", "7");
    }, []);

    // ===== Load danh sách tỉnh =====
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await getProvinces();
                const list = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : Array.isArray(res?.data)
                        ? res.data
                        : [];
                setProvinces(list);
            } catch (err) {
                console.error("❌ Lỗi load tỉnh:", err);
                setProvinces([]);
            }
        };
        fetchProvinces();
    }, []);

    // ===== Load thông tin gói =====
    useEffect(() => {
        if (selectedSetId) {
            getMealSetById(selectedSetId)
                .then((res) => {
                    const setData = res.data?.data || res.data;
                    setSelectedSet(setData);
                })
                .catch((err) => console.error("❌ Lỗi khi lấy thông tin gói:", err));
        }
    }, [selectedSetId]);

    // ===== Chọn tỉnh / huyện / xã =====
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        const provinceName = provinces.find((p) => p.ProvinceID == provinceId)?.ProvinceName || "";
        setAddress({
            ...address,
            provinceId,
            provinceName,
            districtId: "",
            districtName: "",
            wardCode: "",
            wardName: "",
        });
        try {
            const res = await getDistricts(provinceId);
            const list = Array.isArray(res?.data?.data)
                ? res.data.data
                : Array.isArray(res?.data)
                    ? res.data
                    : [];
            setDistricts(list);
            setWards([]);
        } catch (err) {
            console.error("❌ Lỗi load huyện:", err);
            setDistricts([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        const districtName = districts.find((d) => d.DistrictID == districtId)?.DistrictName || "";
        setAddress({
            ...address,
            districtId,
            districtName,
            wardCode: "",
            wardName: "",
        });
        try {
            const res = await getWards(districtId);
            const list = Array.isArray(res?.data?.data)
                ? res.data.data
                : Array.isArray(res?.data)
                    ? res.data
                    : [];
            setWards(list);
        } catch (err) {
            console.error("❌ Lỗi load xã:", err);
            setWards([]);
        }
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = wards.find((w) => w.WardCode == wardCode)?.WardName || "";
        setAddress({ ...address, wardCode, wardName });
    };

    // ===== Xử lý thanh toán =====
    const handleConfirm = async () => {
        const token =
            localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!token) {
            alert("Vui lòng đăng nhập trước khi thanh toán.");
            navigate("/account/login", { state: { redirectTo: location.pathname } });
            return;
        }

        if (!deliveryTime) {
            alert("Vui lòng chọn ngày giao hàng mong muốn.");
            return;
        }
        if (!address.address || !address.provinceId || !address.districtId || !address.wardCode) {
            alert("Vui lòng nhập đầy đủ địa chỉ giao hàng.");
            return;
        }

        setLoading(true);
        try {
            const res = await step7({ sessionId, deliveryTime, address });
            if (res.data?.success) {
                const { paymentUrl, orderCode } = res.data.data;
                setQrUrl(paymentUrl);
                setOrderCode(orderCode);
                setCountdown(180);
                setPolling(true);



            }
        } catch (error) {
            alert("Thanh toán thất bại, vui lòng thử lại.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // ===== Countdown
    useEffect(() => {
        if (!qrUrl) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    handleCancelOrder();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [qrUrl]);

    // ===== Polling order status
    useEffect(() => {
        if (!polling || !orderCode) return;
        const interval = setInterval(async () => {
            try {
                const res = await getOrderStatus(orderCode);
                if (res.data?.paymentStatus === "completed") {
                    // ✅ Xóa dữ liệu quiz khỏi localStorage
                    localStorage.removeItem("quiz_sessionId");
                    localStorage.removeItem("quiz_selectedSetId");
                    localStorage.removeItem("quiz_current_step");
                    localStorage.removeItem("quiz_step");
                    localStorage.removeItem("quiz_mealSuggestions");
                    clearInterval(interval);
                    setPolling(false);
                    setQrUrl(null);
                    navigate(`/payment-success?status=success&orderCode=${orderCode}`);
                }
            } catch (err) {
                console.error(err);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [polling, orderCode, navigate]);

    const handleCancelOrder = async () => {
        try {
            console.log("orderCode", orderCode);
            if (!orderCode) return;
            const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
            if (!orderCode || !token) return;
            // ✅ Xóa dữ liệu quiz khỏi localStorage
            localStorage.removeItem("quiz_sessionId");
            localStorage.removeItem("quiz_selectedSetId");
            localStorage.removeItem("quiz_current_step");
            localStorage.removeItem("quiz_step");
            localStorage.removeItem("quiz_mealSuggestions");
            await deleteOrder(orderCode); // gọi API xóa order
            navigate("/")
        } catch (err) {
            console.error(err);
        } finally {
            setQrUrl(null);
            setOrderCode(null);
            setPolling(false);
        }
    };


    const subtotal = selectedSet?.price || 0;

    // ======= GIAO DIỆN =======
    return (
        <div className="quiz-step step7-layout">
            {!qrUrl ? (
                // ========= GIAO DIỆN NHẬP THÔNG TIN =========
                <>
                    <div className="step7-left">
                        <h2 className="step7-title">Bước 7: Xác nhận thanh toán 💳</h2>
                        <p className="step7-subtitle">Vui lòng nhập thông tin giao hàng trước khi thanh toán.</p>

                        <div className="form-section">
                            <label>📅 Ngày giao hàng mong muốn:</label>
                            <input
                                type="date"
                                value={deliveryTime}
                                onChange={(e) => setDeliveryTime(e.target.value)}
                            />

                            <label>🏠 Địa chỉ cụ thể:</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Số 10, Nguyễn Huệ..."
                                value={address.address}
                                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                            />

                            <div className="select-row">
                                <div className="select-box">
                                    <label>Tỉnh / Thành phố:</label>
                                    <select value={address.provinceId} onChange={handleProvinceChange}>
                                        <option value="">-- Chọn tỉnh --</option>
                                        {provinces?.map((p) => (
                                            <option key={p.ProvinceID} value={p.ProvinceID}>
                                                {p.ProvinceName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="select-box">
                                    <label>Quận / Huyện:</label>
                                    <select
                                        value={address.districtId}
                                        onChange={handleDistrictChange}
                                        disabled={!address.provinceId}
                                    >
                                        <option value="">-- Chọn huyện --</option>
                                        {districts?.map((d) => (
                                            <option key={d.DistrictID} value={d.DistrictID}>
                                                {d.DistrictName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="select-box">
                                    <label>Phường / Xã:</label>
                                    <select
                                        value={address.wardCode}
                                        onChange={handleWardChange}
                                        disabled={!address.districtId}
                                    >
                                        <option value="">-- Chọn xã --</option>
                                        {wards?.map((w) => (
                                            <option key={w.WardCode} value={w.WardCode}>
                                                {w.WardName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="step7-right">
                        <div className="payment-summary">
                            <h3>🧺 Gói bạn đã chọn</h3>
                            {selectedSet ? (
                                <>
                                    <p><strong>{selectedSet.title}</strong></p>
                                    <p>{selectedSet.description}</p>
                                    <div className="price-total">
                                        <strong>Giá:</strong>
                                        <strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
                                    </div>
                                </>
                            ) : (
                                <p>Đang tải thông tin gói...</p>
                            )}

                            <div className="button-row">
                                <button onClick={onPrev} className="btn-secondary">← Quay lại</button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? "Đang xử lý..." : "💳 Thanh toán ngay"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // ========= GIAO DIỆN HIỂN THỊ QR =========
                <div className="qr-section">
                    <h2>Quét mã QR để thanh toán</h2>
                    <img src={qrUrl} alt="QR" className="qr-image" />
                    <p>Thời gian còn lại: {Math.floor(countdown / 60)}:{("0" + (countdown % 60)).slice(-2)}</p>
                    <button className="btn-primary" onClick={handleCancelOrder}>Hủy đơn</button>
                </div>
            )}
        </div>
    );
};

export default Step7;
