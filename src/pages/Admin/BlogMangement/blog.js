import React, { useState, useEffect } from "react";
import {
  Box, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, MenuItem, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Snackbar, Alert, Stack, CircularProgress, Pagination
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  createBlog, getAllBlogs, updateBlog, deleteBlog
} from "../../../services/AdminService/blogService";

import {
  getAllBlogCategories
} from "../../../services/AdminService/blogCategoryService";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [form, setForm] = useState({ title: "", content: "", blogCategoryId: "", images: [] });
  const [editBlog, setEditBlog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openDialog, setOpenDialog] = useState(false);

  const quillModules = {
    toolbar: [["bold", "italic"], ["link", "image"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]],
  };

  // --- Fetch Categories ---
  const fetchCategories = async () => {
    try {
      const data = await getAllBlogCategories();
      setCategories(data);
    } catch {
      showSnackbar("Không thể tải danh mục", "error");
    }
  };

  // --- Fetch Blogs ---
  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getAllBlogs(selectedCategory, page, blogsPerPage);
      setBlogs(data.blogs);
      setTotalBlogs(data.total);
    } catch {
      showSnackbar("Không thể tải blog", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { setCurrentPage(1); fetchBlogs(1); }, [selectedCategory]);

  const showSnackbar = (msg, severity = "success") => setSnackbar({ open: true, message: msg, severity });
  const handleCloseSnackbar = () => setSnackbar((p) => ({ ...p, open: false }));

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleFileChange = (e) => setForm((prev) => ({ ...prev, images: e.target.files }));

  // --- Blog CRUD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "images") Array.from(v).forEach((f) => fd.append("images", f));
        else fd.append(k, v);
      });

      if (editBlog) await updateBlog(editBlog._id, form);
      else await createBlog(fd);

      showSnackbar(editBlog ? "Cập nhật thành công" : "Tạo blog thành công");
      setForm({ title: "", content: "", blogCategoryId: "", images: [] });
      setEditBlog(null);
      setOpenDialog(false);
      fetchBlogs(currentPage);
    } catch {
      showSnackbar("Thao tác thất bại", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(deleteConfirm._id);
      showSnackbar("Xóa blog thành công");
      setDeleteConfirm(null);
      fetchBlogs(currentPage);
    } catch {
      showSnackbar("Xóa thất bại", "error");
    }
  };

  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Quản lý Blog</Typography>

      {/* Filter + Add */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} fullWidth displayEmpty>
            <MenuItem value="">Tất cả danh mục</MenuItem>
            {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
          </Select>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="contained" startIcon={<Add />} fullWidth onClick={() => { setEditBlog(null); setOpenDialog(true); }}>
            Thêm Blog
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((b, idx) => (
                <TableRow key={b._id}>
                  <TableCell>{(currentPage - 1) * blogsPerPage + idx + 1}</TableCell>
                  <TableCell>
                    {b.images?.[0] ? <img src={b.images[0]} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }} /> : <Typography color="text.secondary">Không có ảnh</Typography>}
                  </TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>{b.blogCategoryId?.name || "Chưa chọn"}</TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary" noWrap>{b.content.replace(/<[^>]+>/g, "").slice(0, 30)}...</Typography></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa"><IconButton color="primary" onClick={() => { setEditBlog(b); setForm({ title: b.title, content: b.content, blogCategoryId: b.blogCategoryId?._id, images: [] }); setOpenDialog(true); }}><Edit /></IconButton></Tooltip>
                    <Tooltip title="Xóa"><IconButton color="error" onClick={() => setDeleteConfirm(b)}><Delete /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {blogs.length === 0 && <TableRow><TableCell colSpan={6} align="center">Không có bài viết</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack mt={2} alignItems="center">
          <Pagination count={totalPages} page={currentPage} onChange={(e, val) => { setCurrentPage(val); fetchBlogs(val); }} />
        </Stack>
      )}

      {/* Dialog Tạo/Sửa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editBlog ? "Chỉnh sửa Blog" : "Tạo Blog mới"}</DialogTitle>
        <DialogContent>
          <TextField label="Tiêu đề" fullWidth value={form.title} onChange={(e) => handleChange("title", e.target.value)} margin="normal" />
          <Select value={form.blogCategoryId} onChange={(e) => handleChange("blogCategoryId", e.target.value)} fullWidth displayEmpty margin="normal">
            <MenuItem value="">-- Chọn danh mục --</MenuItem>
            {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
          </Select>
          <Typography variant="subtitle1" mt={2}>Nội dung</Typography>
          <ReactQuill value={form.content} onChange={(v) => handleChange("content", v)} modules={quillModules} />
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Tải ảnh lên
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
            {form.images?.length > 0 && <Typography variant="caption">{form.images.length} ảnh được chọn</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>{editBlog ? "Cập nhật" : "Tạo mới"}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xóa */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa blog <strong>{deleteConfirm?.title}</strong>?</Typography>
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
