import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    createMealSet,
    getMealSets,
    getMealSetById,
    updateMealSet,
    deleteMealSet,
} from "../../../services/AdminService/mealSetService";

export default function MealSetManagement() {
    const [mealSets, setMealSets] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [dialog, setDialog] = useState({ open: false, mode: "add", id: "" });
    const [formData, setFormData] = useState({
        title: "",
        duration: "",
        price: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchAll = async () => {
        try {
            const data = await getMealSets();
            setMealSets(data);
        } catch {
            showAlert("Lỗi tải danh sách set ăn", "error");
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const showAlert = (msg, sev = "info") =>
        setAlert({ open: true, message: msg, severity: sev });
    const closeAlert = () => setAlert((a) => ({ ...a, open: false }));

    const open = async (mode, id = "") => {
        setDialog({ open: true, mode, id });
        if (mode === "edit" && id) {
            try {
                const mealSet = await getMealSetById(id);
                setFormData({
                    title: mealSet.title || "",
                    duration: mealSet.duration || "",
                    price: mealSet.price || "",
                    description: mealSet.description || "",
                });
            } catch {
                showAlert("Lỗi tải chi tiết set ăn", "error");
            }
        } else {
            setFormData({ title: "", duration: "", price: "", description: "" });
        }
        setErrors({});
    };

    const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Tên set ăn không được để trống";
        if (!formData.duration) newErrors.duration = "Thời gian không được để trống";
        else if (isNaN(formData.duration) || formData.duration <= 0)
            newErrors.duration = "Thời gian phải là số dương";
        if (!formData.price) newErrors.price = "Giá không được để trống";
        else if (isNaN(formData.price) || formData.price <= 0)
            newErrors.price = "Giá phải là số dương";
        if (formData.description.length > 500)
            newErrors.description = "Mô tả không được quá 500 ký tự";
        if (
            mealSets.some(
                (m) =>
                    m.title.toLowerCase() === formData.title.trim().toLowerCase() &&
                    !(dialog.mode === "edit" && m._id === dialog.id)
            )
        )
            newErrors.title = "Tên set ăn đã tồn tại";
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validate();
        if (dialog.mode !== "delete" && Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (dialog.mode === "add") {
                await createMealSet({
                    title: formData.title.trim(),
                    duration: Number(formData.duration),
                    price: Number(formData.price),
                    description: formData.description.trim(),
                });
            } else if (dialog.mode === "edit") {
                await updateMealSet(dialog.id, {
                    title: formData.title.trim(),
                    duration: Number(formData.duration),
                    price: Number(formData.price),
                    description: formData.description.trim(),
                });
            } else if (dialog.mode === "delete") {
                await deleteMealSet(dialog.id);
            }

            showAlert(
                dialog.mode === "add"
                    ? "Thêm set ăn thành công"
                    : dialog.mode === "edit"
                        ? "Cập nhật set ăn thành công"
                        : "Xóa set ăn thành công",
                "success"
            );
            fetchAll();
            closeDialog();
        } catch (error) {
            showAlert(
                dialog.mode === "add"
                    ? "Lỗi khi thêm set ăn"
                    : dialog.mode === "edit"
                        ? "Lỗi khi cập nhật set ăn"
                        : "Lỗi khi xóa set ăn",
                "error"
            );
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Kiểm tra lỗi động khi thay đổi
        const newErrors = validate();
        setErrors(newErrors);
    };

    return (
        <Box maxWidth={1200} mx="auto" p={2}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h4">Quản lý set ăn</Typography>
                <Button variant="contained" onClick={() => open("add")}>
                    Thêm set ăn
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}
            >
                <Table>
                    <TableHead sx={{ backgroundColor: "#2c3e50" }}>
                        <TableRow>
                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tên</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                                Thời gian (ngày)
                            </TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Giá</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                                Mô tả
                            </TableCell>
                            <TableCell align="right" sx={{ color: "#fff", fontWeight: 700 }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mealSets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((m) => (
                                <TableRow
                                    key={m._id}
                                    sx={{
                                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                                        "&:hover": { backgroundColor: "#f0f0f0" },
                                    }}
                                >
                                    <TableCell>{m.title}</TableCell>
                                    <TableCell>{m.duration}</TableCell>
                                    <TableCell>{m.price}</TableCell>
                                    <TableCell>{m.description || "Không có mô tả"}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => open("edit", m._id)}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => open("delete", m._id)}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={mealSets.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={{
                        borderTop: "1px solid #e0e0e0",
                        "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                            { fontWeight: 500 },
                    }}
                />
            </TableContainer>

            <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {dialog.mode === "add"
                        ? "Thêm set ăn"
                        : dialog.mode === "edit"
                            ? "Sửa set ăn"
                            : "Xóa set ăn"}
                </DialogTitle>
                <DialogContent>
                    {(dialog.mode === "add" || dialog.mode === "edit") && (
                        <>
                            <TextField
                                fullWidth
                                label="Tên set ăn"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                margin="dense"
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                            <TextField
                                fullWidth
                                label="Thời gian (ngày)"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                margin="dense"
                                type="number"
                                error={!!errors.duration}
                                helperText={errors.duration}
                            />
                            <TextField
                                fullWidth
                                label="Giá"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                margin="dense"
                                type="number"
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                            <TextField
                                fullWidth
                                label="Mô tả"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                margin="dense"
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </>
                    )}
                    {dialog.mode === "delete" && (
                        <Typography>Bạn có chắc muốn xóa set ăn này không?</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Hủy</Button>
                    <Button
                        variant="contained"
                        color={dialog.mode === "delete" ? "error" : "primary"}
                        onClick={handleSave}
                        disabled={
                            dialog.mode !== "delete" &&
                            (!formData.title.trim() ||
                                !formData.duration ||
                                !formData.price ||
                                Object.keys(errors).length > 0)
                        }
                    >
                        {dialog.mode === "add"
                            ? "Thêm"
                            : dialog.mode === "edit"
                                ? "Cập nhật"
                                : "Xóa"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={closeAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={alert.severity} onClose={closeAlert}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}