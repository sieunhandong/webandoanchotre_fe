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
  Checkbox,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { getOrders, updateMealDone } from "../../../services/AdminService/orderService";
import OrderDetailsDialog from "./OrderDetailsDialog";

const statusLabels = {
  all: "Tất cả",
  pending: "Chưa hoàn thành",
  completed: "Hoàn thành",
  undoneToday: "Có món hôm nay chưa làm",
};

const statusColors = {
  pending: "#FFA500",
  completed: "#008000",
  cancelled: "#DC143C",
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let filteredOrders = orders;

    // --- Lọc theo trạng thái ---
    if (filterStatus !== "all") {
      switch (filterStatus) {
        case "delivered":
          filteredOrders = filteredOrders.filter(
            (o) => o.progress?.currentDay > 0 && !o.progress?.isCompleted
          );
          break;
        case "undoneToday":
          filteredOrders = filteredOrders.filter((o) => {
            const todayMeal = o.mealSuggestions?.find(
              (m) => Number(m.day) === Number(o.progress?.currentDay)
            );
            return todayMeal && !todayMeal.isDone;
          });
          break;
        default:
          filteredOrders = filteredOrders.filter(
            (o) => o.status?.toLowerCase() === filterStatus.toLowerCase()
          );
      }
    }

    // --- Lọc theo tìm kiếm (tên hoặc số điện thoại) ---
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (o) =>
          o.userId?.name?.toLowerCase().includes(term) ||
          o?.delivery?.phone?.toLowerCase().includes(term)
      );
    }

    // --- Sắp xếp ---
    filteredOrders = filteredOrders.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return filteredOrders;
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
          label="Tìm khách hàng hoặc số điện thoại"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo</InputLabel>
          <Select
            label="Lọc theo"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
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
                "Số điện thoại",
                "Ngày đặt",
                "Trạng thái đơn hàng",
                "Trạng thái thanh toán",
                "Ngày giao bắt đầu",
                "Ngày hiện tại",
                "Thực đơn hôm nay",
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
                  <TableCell>{order?.delivery?.phone || "N/A"}</TableCell>
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
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        fontWeight: 600,
                        color:
                          order.paymentStatus?.toLowerCase() === "completed"
                            ? "#0f5132"
                            : "#842029",
                        backgroundColor:
                          order.paymentStatus?.toLowerCase() === "completed"
                            ? "#d1e7dd" // xanh nhạt: đã thanh toán
                            : "#f8d7da", // đỏ nhạt: chưa thanh toán
                      }}
                    >
                      {order.paymentStatus?.toLowerCase() === "completed"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
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
                                order.mealSuggestions?.find((m) => m.day === day)
                                  ?.isDone || false;
                              try {
                                await updateMealDone(order._id, day, !current);
                                await fetchOrders();
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

      <OrderDetailsDialog
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        refresh={fetchOrders}
      />

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
