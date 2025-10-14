// src/pages/Quiz/Quiz.js
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
import { useNavigate, useLocation } from "react-router-dom";
import "./Quiz.css";

const Quiz = () => {
    const [step, setStep] = useState(1);
    const [sessionId, setSessionId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Load dữ liệu từ localStorage hoặc URL khi mở trang
    useEffect(() => {
        const initQuiz = async () => {
            try {
                let savedStep = parseInt(localStorage.getItem("quiz_step")) || 1;
                let savedSession = localStorage.getItem("quiz_sessionId");

                const params = new URLSearchParams(location.search);
                const stepParam = parseInt(params.get("step"));
                const sessionParam = params.get("sessionId");

                // Ưu tiên param trên URL hơn localStorage
                if (stepParam) savedStep = stepParam;
                if (sessionParam) savedSession = sessionParam;

                // Nếu chưa có sessionId thì gọi API khởi tạo
                if (!savedSession) {
                    const res = await QuizService.startQuiz();
                    if (res.data?.data?.sessionId) {
                        savedSession = res.data.data.sessionId;
                        localStorage.setItem("quiz_sessionId", savedSession);
                    }
                }

                setSessionId(savedSession);
                setStep(savedStep);

                // ✅ Nếu ở bước 7 mà chưa đăng nhập → redirect đến login
                if (savedStep === 7) {
                    const token =
                        localStorage.getItem("access_token") ||
                        sessionStorage.getItem("access_token");

                    if (!token) {
                        const redirectUrl = `/quiz/start?step=7&sessionId=${savedSession || ""}`;
                        navigate(`/account/login?redirect=${encodeURIComponent(redirectUrl)}`);
                        return;
                    }
                }
            } catch (err) {
                console.error("❌ Không thể khởi tạo quiz:", err);
            } finally {
                setLoading(false);
            }
        };
        initQuiz();
    }, [location.search, navigate]);

    const totalSteps = 7;

    const stepLabels = [
        "Thông tin bé",
        "Phương pháp dịch vụ",
        "Thực phẩm mong muốn",
        "AI gợi ý thực đơn",
        "Set ăn dặm",
        "Thông tin",
        "Xác nhận & thanh toán",
    ];

    // ✅ Khi chuyển bước → lưu lại vào localStorage
    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep((prev) => {
            const nextStep = Math.min(prev + 1, totalSteps);
            localStorage.setItem("quiz_step", nextStep);
            return nextStep;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrev = () => {
        setStep((prev) => {
            const prevStep = Math.max(prev - 1, 1);
            localStorage.setItem("quiz_step", prevStep);
            return prevStep;
        });
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
                <div className="spinner"></div>
                <p>Đang khởi tạo bài quiz...</p>
            </div>
        );

    if (!sessionId)
        return (
            <div className="quiz-error">
                <p>Không thể khởi tạo quiz. Vui lòng thử lại sau.</p>
            </div>
        );

    const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="quiz-container">
            <div className="quiz-box">
                {/* ===== Thanh tiến trình ===== */}
                <div className="quiz-progress">
                    <div className="progress-line">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="progress-steps">
                        {stepLabels.map((label, index) => {
                            const stepNumber = index + 1;
                            const isActive = step >= stepNumber;
                            return (
                                <div
                                    key={label}
                                    className={`progress-step ${isActive ? "active" : ""}`}
                                >
                                    <div className="circle">{stepNumber}</div>
                                    <span className="label">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== Nội dung các bước ===== */}
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
