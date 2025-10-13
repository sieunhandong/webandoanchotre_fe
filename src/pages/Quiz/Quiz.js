import React, { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import * as QuizService from "../../services/QuizService";
import { motion, AnimatePresence } from "framer-motion";
import "./Quiz.css";

const Quiz = () => {
    const [step, setStep] = useState(1);
    const [sessionId, setSessionId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    // Danh sách các bước và tên hiển thị
    const steps = [
        "Thông tin bé",
        "Mục tiêu ăn dặm",
        "Sở thích",
        "Dị ứng",
        "Khẩu phần",
        "Gợi ý sản phẩm",
        "Thanh toán",
    ];

    useEffect(() => {
        const initQuiz = async () => {
            try {
                const res = await QuizService.startQuiz();
                if (res.data?.data?.sessionId) {
                    setSessionId(res.data.data.sessionId);
                }
            } catch (err) {
                console.error("❌ Không thể khởi tạo quiz:", err);
            } finally {
                setLoading(false);
            }
        };
        initQuiz();
    }, []);

    const totalSteps = steps.length;
    const progress = ((step - 1) / (totalSteps - 1)) * 100;

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep((prev) => Math.min(prev + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const commonProps = {
        data: { ...formData, sessionId },
        onNext: handleNext,
        onPrev: handlePrev,
    };

    if (loading)
        return (
            <div className="quiz-loading">
                <div className="loading-spinner"></div>
                <p>Đang khởi tạo bài quiz...</p>
            </div>
        );

    if (!sessionId)
        return (
            <div className="quiz-error">
                <p>Không thể khởi tạo quiz. Vui lòng thử lại sau.</p>
            </div>
        );

    return (
        <div className="quiz-container">
            <div className="quiz-box">
                {/* ======= Thanh tiến trình 7 mốc ======= */}
                <div className="quiz-stepper">
                    {steps.map((label, index) => {
                        const isActive = index + 1 <= step;
                        return (
                            <div key={index} className={`step-item ${isActive ? "active" : ""}`}>
                                <div className="step-circle">{index + 1}</div>
                                <span className="step-label">{label}</span>
                            </div>
                        );
                    })}
                    <div className="step-line">
                        <div className="step-line-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* ======= Hiệu ứng chuyển bước ======= */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                    >
                        {step === 1 && <Step1 {...commonProps} />}
                        {step === 2 && <Step2 {...commonProps} />}
                        {step === 3 && <Step3 {...commonProps} />}
                        {step === 4 && <Step4 {...commonProps} />}
                        {step === 5 && <Step5 {...commonProps} />}
                        {step === 6 && <Step6 {...commonProps} />}
                        {step === 7 && <Step7 {...commonProps} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Quiz;
