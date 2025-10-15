import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Snackbar,
  Alert,
  Tooltip,
  TextField,
  Checkbox
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { getOrders, updateMealDone } from "../../../services/AdminService/orderService";
import OrderDetailsDialog from "./OrderDetailsDialog";

const statusLabels = {
  pending: "Chưa hoàn thành",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const statusColors = {
  pending: "#FFA500",
  completed: "#008000",
  cancelled: "#DC143C",
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const showAlert = (msg, sev = "info") =>
    setAlert({ open: true, message: msg, severity: sev });
  const closeAlert = () => setAlert((a) => ({ ...a, open: false }));

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (err) {
      showAlert("Không thể tải danh sách đơn hàng", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders
      .filter(
        (o) =>
          filterStatus === "All" ||
          o.status?.toLowerCase() === filterStatus.toLowerCase()
      )
      .filter((o) =>
        o.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "newest"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [orders, filterStatus, searchTerm, sortOrder]);

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: 2 }}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Quản lý đơn hàng
      </Typography>

      {/* Bộ lọc & tìm kiếm */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          backgroundColor: "#fff",
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          label="Tìm khách hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="All">Tất cả</MenuItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            label="Sắp xếp"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="oldest">Cũ nhất</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bảng đơn hàng */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#2c3e50" }}>
            <TableRow>
              {[
                "Khách hàng",
                "Ngày đặt",
                "Trạng thái",
                "Ngày giao bắt đầu",
                "Ngày hiện tại",
                "Thực đơn hôm nay",
                "Tổng tiền",
                "Hành động",
              ].map((text) => (
                <TableCell key={text} sx={{ color: "#fff", fontWeight: 600 }}>
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.userId?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color:
                          statusColors[order.status?.toLowerCase()] || "gray",
                      }}
                    >
                      {statusLabels[order.status?.toLowerCase()] ||
                        order.status ||
                        "N/A"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {order.progress?.startDate
                      ? new Date(order.progress.startDate).toLocaleDateString(
                        "vi-VN"
                      )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    Ngày {order.progress?.currentDay || 0}/
                    {order.progress?.duration || 0}
                  </TableCell>
                  <TableCell>
                    {order.progress?.todayMenu ? (
                      <Box>
                        <Box sx={{ mb: 1 }}>
                          {order.progress.todayMenu.map((item, i) => (
                            <Typography key={i} variant="body2">
                              {item}
                            </Typography>
                          ))}
                        </Box>

                        {/* ✅ Checkbox trạng thái hoàn thành */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Checkbox
                            checked={
                              order.mealSuggestions?.find(
                                (m) => m.day === order.progress?.currentDay
                              )?.isDone || false
                            }
                            onChange={async (e) => {
                              const day = order.progress?.currentDay;
                              const current =
                                order.mealSuggestions?.find((m) => m.day === day)?.isDone ||
                                false;
                              try {
                                await updateMealDone(order._id, day, !current);
                                await fetchOrders(); // refresh lại list sau khi cập nhật
                                showAlert("Đã cập nhật trạng thái món hôm nay", "success");
                              } catch (err) {
                                console.error("❌ updateMealDone error:", err);
                                showAlert("Không thể cập nhật trạng thái món", "error");
                              }
                            }}
                            color="success"
                          />
                          <Typography variant="body2">
                            {order.mealSuggestions?.find(
                              (m) => m.day === order.progress?.currentDay
                            )?.isDone
                              ? "Đã hoàn thành"
                              : "Chưa xong"}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      "Chưa có thực đơn"
                    )}
                  </TableCell>

                  <TableCell>{order.total?.toLocaleString()} VNĐ</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                      <IconButton onClick={() => setSelectedOrder(order)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Dialog chi tiết đơn hàng */}
      <OrderDetailsDialog
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        refresh={fetchOrders}
      />

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
