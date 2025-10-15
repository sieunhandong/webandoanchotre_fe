import React, { useState, useEffect } from "react";
import {
    Box, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    IconButton, Tooltip, Snackbar, Alert, Stack
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

import {
    createBlogCategory,
    getAllBlogCategories,
    updateBlogCategory,
    deleteBlogCategory
} from "../../../services/AdminService/blogCategoryService";

export default function AdminBlogCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "" });
    const [editCategory, setEditCategory] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const showSnackbar = (msg, severity = "success") => setSnackbar({ open: true, message: msg, severity });
    const handleCloseSnackbar = () => setSnackbar((p) => ({ ...p, open: false }));

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllBlogCategories();
            setCategories(data);
        } catch {
            showSnackbar("Không thể tải danh mục", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => setForm({ name: e.target.value });

    const handleSubmit = async () => {
        try {
            if (!form.name) {
                showSnackbar("Tên danh mục không được để trống", "warning");
                return;
            }

            if (editCategory) {
                await updateBlogCategory(editCategory._id, { name: form.name });
                showSnackbar("Cập nhật danh mục thành công");
            } else {
                await createBlogCategory({ name: form.name });
                showSnackbar("Tạo danh mục thành công");
            }

            setForm({ name: "" });
            setEditCategory(null);
            setOpenDialog(false);
            fetchCategories();
        } catch {
            showSnackbar("Thao tác thất bại", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBlogCategory(deleteConfirm._id);
            showSnackbar("Xóa danh mục thành công");
            setDeleteConfirm(null);
            fetchCategories();
        } catch {
            showSnackbar("Xóa thất bại", "error");
        }
    };

    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Quản lý Blog Category</h2>
                <Button variant="contained" startIcon={<Add />} onClick={() => { setEditCategory(null); setForm({ name: "" }); setOpenDialog(true); }}>
                    Thêm Category
                </Button>
            </Stack>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Tên danh mục</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((c, idx) => (
                                <TableRow key={c._id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Sửa">
                                            <IconButton color="primary" onClick={() => { setEditCategory(c); setForm({ name: c.name }); setOpenDialog(true); }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton color="error" onClick={() => setDeleteConfirm(c)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Chưa có danh mục nào</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Dialog Thêm / Sửa */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editCategory ? "Chỉnh sửa Category" : "Tạo Category mới"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên danh mục"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>{editCategory ? "Cập nhật" : "Tạo mới"}</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Xóa */}
            <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn xóa danh mục <strong>{deleteConfirm?.name}</strong>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Hủy</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
