// pages/Quiz/Step1BabyInfo.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Grid,
    Chip,
    Typography,
    Stack,
    Autocomplete,
    Snackbar,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
} from "@mui/material";

export default function Step1BabyInfo({ data = {}, onNext }) {
    const [form, setForm] = useState({
        monthAge: data.monthAge || "",
        height: data.height || "",
        weight: data.weight || "",
        gender: data.gender || "",
        likes: data.likes || [],
        dislikes: data.dislikes || [],
        allergies: data.allergies || [],
    });
    const [tagInput, setTagInput] = useState("");
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        setForm((f) => ({
            ...f,
            likes: data.likes || [],
            dislikes: data.dislikes || [],
            allergies: data.allergies || [],
            gender: data.gender || "",
        }));
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const addTag = (field) => {
        const val = tagInput.trim();
        if (!val) return;
        if (form[field].includes(val)) {
            setAlert({ open: true, message: "Đã có mục này", severity: "warning" });
            return;
        }
        setForm((f) => ({ ...f, [field]: [...f[field], val] }));
        setTagInput("");
    };

    const removeTag = (field, tag) => {
        setForm((f) => ({ ...f, [field]: f[field].filter((t) => t !== tag) }));
    };

    const validate = () => {
        const { monthAge, height, weight, gender } = form;
        if (!monthAge || !height || !weight || !gender) {
            setAlert({
                open: true,
                message: "Vui lòng nhập đầy đủ thông tin: tháng tuổi, chiều cao, cân nặng và giới tính",
                severity: "error",
            });
            return false;
        }
        if (isNaN(monthAge) || isNaN(height) || isNaN(weight)) {
            setAlert({ open: true, message: "Giá trị phải là số", severity: "error" });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (!validate()) return;
        console.log("Form gửi lên:", form);
        onNext(form);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Bước 1 — Thông tin bé
            </Typography>

            <Grid container spacing={2}>
                {/* Giới tính */}
                <Grid item xs={12} sm={12}>
                    <FormLabel component="legend" sx={{ fontWeight: 500 }}>
                        Giới tính
                    </FormLabel>
                    <RadioGroup
                        row
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        sx={{ mt: 1, ml: 1 }}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Bé trai" />
                        <FormControlLabel value="female" control={<Radio />} label="Bé gái" />
                    </RadioGroup>
                </Grid>

                {/* Tháng tuổi / chiều cao / cân nặng */}
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Tháng tuổi"
                        name="monthAge"
                        value={form.monthAge}
                        onChange={handleChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Chiều cao (cm)"
                        name="height"
                        value={form.height}
                        onChange={handleChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Cân nặng (kg)"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                </Grid>

                {/* Thích ăn */}
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Thích ăn (thêm từ khóa)</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                        {form.likes.map((t) => (
                            <Chip key={t} label={t} onDelete={() => removeTag("likes", t)} sx={{ m: 0.5 }} />
                        ))}
                    </Stack>
                    <Autocomplete
                        freeSolo
                        options={[]}
                        value={tagInput}
                        onChange={(e, v) => setTagInput(v)}
                        onInputChange={(e, v) => setTagInput(v)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Nhập rồi nhấn Thêm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag("likes");
                                    }
                                }}
                                fullWidth
                            />
                        )}
                    />
                    <Button sx={{ mt: 1 }} onClick={() => addTag("likes")}>
                        Thêm
                    </Button>
                </Grid>

                {/* Không thích */}
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Không thích</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                        {form.dislikes.map((t) => (
                            <Chip key={t} label={t} onDelete={() => removeTag("dislikes", t)} sx={{ m: 0.5 }} />
                        ))}
                    </Stack>
                    <TextField
                        placeholder="Nhập rồi nhấn Thêm"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag("dislikes");
                            }
                        }}
                        fullWidth
                    />
                    <Button sx={{ mt: 1 }} onClick={() => addTag("dislikes")}>
                        Thêm
                    </Button>
                </Grid>

                {/* Dị ứng */}
                <Grid item xs={12}>
                    <Typography variant="subtitle2">Dị ứng</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                        {form.allergies.map((t) => (
                            <Chip key={t} label={t} onDelete={() => removeTag("allergies", t)} sx={{ m: 0.5 }} />
                        ))}
                    </Stack>
                    <TextField
                        placeholder="VD: trứng, sữa, đậu nành - nhập rồi nhấn Thêm"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag("allergies");
                            }
                        }}
                        fullWidth
                    />
                    <Button sx={{ mt: 1 }} onClick={() => addTag("allergies")}>
                        Thêm
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button variant="contained" onClick={handleNext}>
                    Tiếp tục
                </Button>
            </Box>

            <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert((a) => ({ ...a, open: false }))}>
                <Alert severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
}
