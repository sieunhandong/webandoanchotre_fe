// pages/Quiz/QuizLayout.jsx
import React, { useState } from "react";
import { Box, Paper, Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import Step1BabyInfo from "./Step1BabyInfo";
import Step2Method from "./Step2Method";
import Step3ChooseProducts from "./Step3ChooseProducts"; // ✅ thêm dòng này
import { useNavigate } from "react-router-dom";
import Step4AIMealSuggestion from "./Step4AIMealSuggestion";

const steps = [
    "Thông tin bé",
    "Phương pháp ăn dặm",
    "Chọn nguyên liệu",
    "AI gợi ý",
    "Mua & Thanh toán",
];

export default function QuizLayout() {
    const [activeStep, setActiveStep] = useState(0);
    const [profileData, setProfileData] = useState({
        monthAge: "",
        height: "",
        weight: "",
        likes: [],
        dislikes: [],
        allergies: [],
        method: "",
        selectedProducts: [],
    });

    const navigate = useNavigate();

    const handleNext = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

    const handleUpdateProfile = (patch) => {
        setProfileData((prev) => ({ ...prev, ...patch }));
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Step1BabyInfo
                        data={profileData}
                        onNext={(newData) => {
                            handleUpdateProfile(newData);
                            handleNext();
                        }}
                    />
                );

            case 1:
                return (
                    <Step2Method
                        data={profileData}
                        onBack={handleBack}
                        onNext={(newData) => {
                            handleUpdateProfile(newData);
                            handleNext();
                        }}
                    />
                );

            case 2:
                return (
                    <Step3ChooseProducts
                        data={profileData}
                        onBack={handleBack}
                        onNext={(newData) => {
                            handleUpdateProfile(newData);
                            handleNext();
                        }}
                    />
                );
            case 3:
                return (
                    <Step4AIMealSuggestion
                        data={profileData}
                        onBack={handleBack}
                        onNext={(newData) => {
                            handleUpdateProfile(newData);
                            handleNext();
                        }}
                    />
                );

            default:
                return (
                    <Box p={3}>
                        <Typography variant="h6">Chưa triển khai bước này trong demo</Typography>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
                            Về trang chủ
                        </Button>
                    </Box>
                );
        }
    };

    return (
        <Box sx={{ maxWidth: 960, mx: "auto", mt: 4, px: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mt: 3 }}>{renderStep()}</Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Quay lại
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                        Bước {activeStep + 1} / {steps.length}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
