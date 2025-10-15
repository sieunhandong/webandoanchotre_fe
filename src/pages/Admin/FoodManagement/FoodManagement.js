import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    CircularProgress,
    Tooltip,
    Stack,
    Pagination,
    Snackbar,
    Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getAllFoods, createFood, updateFood, deleteFood } from "../../../services/AdminService/foodService";

export default function AdminFood() {
    const [foods, setFoods] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editFood, setEditFood] = useState(null);
    const [form, setForm] = useState({ name: "", images: [] });
    const [ingredients, setIngredients] = useState("");
    const [recipe, setRecipe] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const showSnackbar = (msg, severity = "success") => setSnackbar({ open: true, message: msg, severity });

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const data = await getAllFoods({ search, page, limit: rowsPerPage });
            setFoods(data.foods);
            setTotal(data.total);
        } catch {
            showSnackbar("Không thể tải món ăn", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, [page, search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("ingredients", ingredients);
            fd.append("recipe", recipe);
            if (form.images) Array.from(form.images).forEach((img) => fd.append("images", img));

            if (editFood) {
                await updateFood(editFood._id, fd);
                showSnackbar("Cập nhật món ăn thành công");
            } else {
                await createFood(fd);
                showSnackbar("Tạo món ăn thành công");
            }

            setOpenDialog(false);
            setEditFood(null);
            setForm({ name: "", images: [] });
            setIngredients("");
            setRecipe("");
            fetchFoods();
        } catch {
            showSnackbar("Thao tác thất bại", "error");
        }
    };
    const handleDelete = async () => {
        try {
            await deleteFood(deleteConfirm._id);
            showSnackbar("Xóa món ăn thành công");
            setDeleteConfirm(null);
            fetchFoods();
        } catch {
            showSnackbar("Xóa thất bại", "error");
        }
    };

    const handleEdit = (food) => {
        setEditFood(food);
        setForm({ name: food.name, images: [] }); // ảnh mới upload sẽ replace
        setIngredients(food.ingredients);
        setRecipe(food.recipe);
        setOpenDialog(true);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={3}>Quản lý Món Ăn</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
                <TextField label="Tìm kiếm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                <Button variant="contained" startIcon={<Add />} onClick={() => { setEditFood(null); setForm({ name: "", images: [] }); setIngredients(""); setRecipe(""); setOpenDialog(true); }}>
                    Thêm Món
                </Button>
            </Stack>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Card}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Tên món</TableCell>
                                <TableCell>Nguyên liệu</TableCell>
                                <TableCell>Recipe</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {foods.map((f, idx) => (
                                <TableRow key={f._id}>
                                    <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                                    <TableCell>
                                        {f.images?.[0] ? (
                                            <img src={f.images[0]} alt="" width={60} height={60} style={{ borderRadius: 8, objectFit: "cover" }} />
                                        ) : (
                                            <Typography color="text.secondary">Không có ảnh</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{f.name}</TableCell>
                                    <TableCell><div dangerouslySetInnerHTML={{ __html: f.ingredients.slice(0, 50) + "..." }} /></TableCell>
                                    <TableCell><div dangerouslySetInnerHTML={{ __html: f.recipe.slice(0, 50) + "..." }} /></TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Sửa"><IconButton onClick={() => handleEdit(f)}><Edit /></IconButton></Tooltip>
                                        <Tooltip title="Xóa"><IconButton color="error" onClick={() => setDeleteConfirm(f)}><Delete /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {foods.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Không có món ăn</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Stack mt={2} alignItems="center">
                <Pagination count={Math.ceil(total / rowsPerPage)} page={page} onChange={(e, val) => setPage(val)} />
            </Stack>

            {/* Dialog tạo / sửa */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editFood ? "Chỉnh sửa món" : "Tạo món mới"}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Tên món"
                            fullWidth
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            margin="normal"
                        />
                        <Typography variant="subtitle2">Nguyên liệu</Typography>
                        <ReactQuill value={ingredients} onChange={setIngredients} modules={quillModules} />
                        <Typography variant="subtitle2" mt={2}>Công thức</Typography>
                        <ReactQuill value={recipe} onChange={setRecipe} modules={quillModules} />
                        <Box mt={2}>
                            <Button variant="outlined" component="label">
                                Tải ảnh lên
                                <input type="file" hidden multiple accept="image/*" onChange={(e) => setForm({ ...form, images: e.target.files })} />
                            </Button>
                            {form.images?.length > 0 && <Typography variant="caption" ml={2}>{form.images.length} ảnh được chọn</Typography>}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained">{editFood ? "Cập nhật" : "Tạo mới"}</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xóa */}
            <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn xóa <strong>{deleteConfirm?.name}</strong>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Hủy</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
