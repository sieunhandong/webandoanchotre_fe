import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  TablePagination,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import {
  deleteProduct,
  getProducts,
} from "../../../services/AdminService/productService";
import { getCategories } from "../../../services/AdminService/categoryService";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  // 🔹 Lấy danh mục và sản phẩm
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() =>
        setAlert({
          open: true,
          message: "Lấy danh mục thất bại",
          severity: "error",
        })
      );
    getProducts()
      .then(setProducts)
      .catch(() =>
        setAlert({
          open: true,
          message: "Lấy sản phẩm thất bại",
          severity: "error",
        })
      );
  }, []);

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setProducts((prev) => prev.filter((p) => p._id !== selectedProductId));
      setAlert({ open: true, message: "Xóa thành công", severity: "success" });
    } catch {
      setAlert({ open: true, message: "Xóa thất bại", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  // 🔍 Lọc sản phẩm
  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      !searchCategory ||
      p.categories.some(
        (c) => (typeof c === "object" ? c._id : c) === searchCategory
      );
    return matchName && matchCat;
  });

  const visible = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button variant="contained" onClick={() => navigate("add")}>
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Bộ lọc tìm kiếm */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          backgroundColor: "#fff",
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          size="small"
          label="Tìm theo tên sản phẩm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            label="Danh mục"
            value={searchCategory}
            onChange={(e) => {
              setSearchCategory(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bảng danh sách sản phẩm */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#2c3e50" }}>
            <TableRow>
              {["STT", "Tên sản phẩm", "Danh mục", "Hình ảnh", "Hành động"].map(
                (h, i) => (
                  <TableCell
                    key={i}
                    sx={{ color: "#fff", fontWeight: 700 }}
                    align={h === "Hành động" ? "right" : "left"}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map((product, idx) => (
              <TableRow
                key={product._id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.category ? (
                    <Chip
                      label={product.category.name || "Không có danh mục"}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ) : (
                    <Chip label="Không có danh mục" size="small" color="default" />
                  )}
                </TableCell>
                <TableCell>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <ImageIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton onClick={() => navigate(`${product._id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => confirmDelete(product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
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
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontWeight: 500,
            },
          }}
        />
      </TableContainer>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa sản phẩm này không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert((a) => ({ ...a, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
}
