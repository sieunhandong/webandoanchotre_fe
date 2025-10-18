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

// 🩵 MUI imports
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const Quiz = () => {
    const [step, setStep] = useState(1);
    const [sessionId, setSessionId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const initQuiz = async () => {
            try {
                let savedStep = parseInt(localStorage.getItem("quiz_step")) || 1;
                let savedSession = localStorage.getItem("quiz_sessionId");

                const params = new URLSearchParams(location.search);
                const stepParam = parseInt(params.get("step"));
                const sessionParam = params.get("sessionId");

                if (stepParam) savedStep = stepParam;
                if (sessionParam) savedSession = sessionParam;

                if (!savedSession) {
                    const res = await QuizService.startQuiz();
                    if (res.data?.data?.sessionId) {
                        savedSession = res.data.data.sessionId;
                        localStorage.setItem("quiz_sessionId", savedSession);
                    }
                }

                setSessionId(savedSession);
                setStep(savedStep);

                if (savedStep === 7) {
                    const token =
                        localStorage.getItem("access_token") ||
                        sessionStorage.getItem("access_token");
                    const isFromQuiz = localStorage.getItem("quiz_sessionId");
                    if (!token && !isFromQuiz) {
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
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ];

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
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#E0F7FA33",
                }}
            >
                <CircularProgress sx={{ color: "#72CCF1", mb: 2 }} />
                <Typography color="#72CCF1" fontWeight={600}>
                    Đang khởi tạo bài quiz...
                </Typography>
            </Box>
        );

    if (!sessionId)
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#FFF5F7",
                }}
            >
                <Typography color="#FF6F91" fontWeight={600}>
                    Không thể khởi tạo quiz. Vui lòng thử lại sau.
                </Typography>
            </Box>
        );

    // 🟢 Custom step icon
    const StepIcon = ({ active, completed, icon }) => {
        const number = Number(icon);
        const activeColor = "#72CCF1";
        const completeColor = "#A3E4DB";
        const defaultColor = "#C8E8F3";

        return (
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: completed
                        ? completeColor
                        : active
                            ? activeColor
                            : defaultColor,
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: 20,
                    boxShadow: active
                        ? "0 0 10px rgba(114,204,241,0.5)"
                        : "0 0 6px rgba(200,232,243,0.3)",
                    transition: "all 0.3s ease",
                }}
            >
                {completed ? <CheckCircleRoundedIcon /> : number}
            </Box>
        );
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "linear-gradient(to bottom, #E6F7FF, #FFF)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* 🩵 Thanh tiến trình cố định */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1200,
                    bgcolor: "rgba(255,255,255,0.96)",
                    backdropFilter: "blur(8px)",
                    borderBottom: "1px solid #D0F0FA",
                    py: 2,
                    overflowX: "auto",
                    width: "100%",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Box
                    sx={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: "100%",
                        px: { xs: 2, md: 6 },
                    }}
                >
                    <Stepper
                        alternativeLabel
                        activeStep={step - 1}
                        connector={null}
                        sx={{
                            flexWrap: "nowrap",
                            minWidth: isMobile ? 700 : "100%",
                        }}
                    >
                        {stepLabels.map((label, i) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={StepIcon}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mt: 1,
                                            fontSize: { xs: 11, sm: 13, md: 14 },
                                            fontWeight: step === i + 1 ? 700 : 500,
                                            color:
                                                step === i + 1
                                                    ? "#72CCF1"
                                                    : "rgba(0,0,0,0.5)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* 🧩 Nội dung các bước */}
            <Box
                sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: "1400px",
                    bgcolor: "#fff",
                    borderRadius: { xs: "16px 16px 0 0", md: "24px" },
                    boxShadow: "0 6px 20px rgba(114,204,241,0.2)",
                    p: { xs: 2, sm: 4, md: 6 },
                    mt: 3,
                    mb: 6,
                }}
            >
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
            </Box>
        </Box>
    );
};

export default Quiz;
