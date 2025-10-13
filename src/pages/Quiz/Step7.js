import React, { useEffect, useState } from "react";
import { step7 } from "../../services/QuizService";
import { getMealSetById } from "../../services/MealSetService";
import { getProvinces, getDistricts, getWards } from "../../services/GHNService";

const Step7 = ({ data, onPrev }) => {
    const sessionId = data?.sessionId;
    const selectedSetId = data?.selectedSet || data?.selectedSetId;

    const [selectedSet, setSelectedSet] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState("");
    const [loading, setLoading] = useState(false);

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

    // ✅ Lấy danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await getProvinces();
                const list =
                    Array.isArray(res?.data?.data)
                        ? res.data.data
                        : Array.isArray(res?.data)
                            ? res.data
                            : [];
                setProvinces(list);
            } catch (err) {
                console.error("❌ Lỗi load tỉnh:", err);
                setProvinces([]); // fallback để tránh crash
            }
        };
        fetchProvinces();
    }, []);


    // ✅ Lấy thông tin gói ăn dặm đã chọn
    useEffect(() => {
        if (selectedSetId) {
            getMealSetById(selectedSetId)
                .then((res) => {
                    const setData = res.data?.data || res.data;
                    console.log("👉 Dữ liệu gói ăn:", setData);
                    setSelectedSet(setData);
                })
                .catch((err) => console.error("❌ Lỗi khi lấy thông tin gói:", err));
        }
    }, [selectedSetId]);

    // ✅ Khi chọn tỉnh
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        const provinceName =
            provinces.find((p) => p.ProvinceID == provinceId)?.ProvinceName || "";
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
            const list =
                Array.isArray(res?.data?.data)
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
        const districtName =
            districts.find((d) => d.DistrictID == districtId)?.DistrictName || "";
        setAddress({
            ...address,
            districtId,
            districtName,
            wardCode: "",
            wardName: "",
        });
        try {
            const res = await getWards(districtId);
            const list =
                Array.isArray(res?.data?.data)
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


    // ✅ Khi chọn xã
    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = wards.find((w) => w.WardCode == wardCode)?.WardName || "";
        setAddress({ ...address, wardCode, wardName });
    };

    // ✅ Xử lý xác nhận thanh toán
    const handleConfirm = async () => {
        if (!deliveryTime) {
            alert("Vui lòng chọn ngày giao hàng mong muốn.");
            return;
        }
        if (
            !address.address ||
            !address.provinceId ||
            !address.districtId ||
            !address.wardCode
        ) {
            alert("Vui lòng nhập đầy đủ địa chỉ giao hàng.");
            return;
        }

        setLoading(true);
        try {
            const res = await step7({ sessionId, deliveryTime, address });
            if (res.data?.success) {
                const { paymentUrl } = res.data.data;
                window.location.href = paymentUrl; // Chuyển sang trang thanh toán VNPAY
            }
        } catch (error) {
            if (error.response?.status === 401) {
                const redirect = error.response.data?.redirect;
                if (redirect) {
                    window.location.href = redirect;
                    return;
                }
            }
            alert("Thanh toán thất bại, vui lòng thử lại.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-step two-column-layout">
            {/* BÊN TRÁI: Form nhập thông tin giao hàng */}
            <div className="left-column">
                <h2>Bước 7: Xác nhận thanh toán</h2>
                <p>Vui lòng nhập thông tin giao hàng trước khi thanh toán.</p>

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
                        onChange={(e) =>
                            setAddress({ ...address, address: e.target.value })
                        }
                    />

                    <div className="select-row">
                        <div className="select-box">
                            <label>Tỉnh / Thành phố:</label>
                            <select
                                value={address.provinceId}
                                onChange={handleProvinceChange}
                            >
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

            {/* BÊN PHẢI: Thông tin gói ăn dặm */}
            <div className="right-column">
                <div className="package-summary">
                    <h3>Gói bạn đã chọn</h3>
                    {selectedSet ? (
                        <>
                            <p>
                                <strong>Tên gói:</strong> {selectedSet.title}
                            </p>
                            <p>
                                <strong>Thời lượng:</strong> {selectedSet.duration} ngày
                            </p>
                            <p>
                                <strong>Giá tiền:</strong>{" "}
                                {selectedSet.price.toLocaleString("vi-VN")}₫
                            </p>
                            <p>
                                <strong>Mô tả:</strong> {selectedSet.description}
                            </p>
                        </>
                    ) : (
                        <p>Đang tải thông tin gói...</p>
                    )}

                    <div className="button-row">
                        <button onClick={onPrev} className="btn-secondary">
                            ← Quay lại
                        </button>
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
        </div>
    );
};

export default Step7;
