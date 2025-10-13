import React, { useState } from "react";
import * as QuizService from "../../services/QuizService";

const Step1 = ({ data, onNext }) => {
    const [form, setForm] = useState({
        age: "",
        weight: "",
        allergies: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.age || !form.weight) {
            alert("Vui lòng nhập đầy đủ tháng tuổi và cân nặng của bé");
            return;
        }
        setLoading(true);
        try {
            const res = await QuizService.step1({
                sessionId: data.sessionId,
                age: form.age,
                weight: form.weight,
                allergies: form.allergies,
            });
            if (res.data.success) {
                onNext(form);
            } else {
                alert(res.data.message || "Có lỗi xảy ra!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể lưu thông tin bé. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg"
        >
            <h2 className="text-2xl font-semibold text-center text-pink-600 mb-4">
                Bước 1: Thông tin của bé
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 font-medium">Tháng tuổi</label>
                    <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        className="border w-full p-3 rounded-xl"
                        placeholder="VD: 8"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Cân nặng (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        className="border w-full p-3 rounded-xl"
                        placeholder="VD: 7.5"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Dị ứng (nếu có)</label>
                    <input
                        type="text"
                        name="allergies"
                        value={form.allergies}
                        onChange={handleChange}
                        className="border w-full p-3 rounded-xl"
                        placeholder="VD: Sữa bò, trứng..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white w-full py-3 rounded-xl mt-6 transition-all"
            >
                {loading ? "Đang lưu..." : "Tiếp tục"}
            </button>
        </form>
    );
};

export default Step1;
