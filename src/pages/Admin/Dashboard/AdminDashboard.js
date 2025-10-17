import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventNoteIcon from "@mui/icons-material/EventNote";
import {
  AttachMoney,
  People,
  RestaurantMenu,
  HourglassEmpty,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AdminDashboard.css";
import { getDashboardStats } from "../../../services/AdminService/dashboardService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueTab, setRevenueTab] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleRevenueTabChange = (event, newValue) => {
    setRevenueTab(newValue);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

  if (loading)
    return (
      <Box className="loadingContainer">
        <CircularProgress color="primary" />
      </Box>
    );

  if (error)
    return (
      <Box className="dashboardContainer">
        <Alert severity="error">Lỗi: {error}</Alert>
      </Box>
    );

  if (!stats)
    return (
      <Box className="dashboardContainer">
        <Alert severity="warning">Không có dữ liệu thống kê</Alert>
      </Box>
    );

  const revenueData = stats.revenueAnalysis?.map((item) => ({
    name: `${item._id.day}/${item._id.month}/${item._id.year}`,
    revenue: item.dailyRevenue,
    orderCount: item.orderCount,
  }));

  const statusIcons = {
    "Chờ xử lý": <HourglassEmpty className="statusIcon pending" />,
    "Hoàn thành": <CheckCircle className="statusIcon completed" />,
    "Đã hủy": <Cancel className="statusIcon cancelled" />,
  };

  return (
    <Box className="dashboardContainer">
      {/* --- Tổng quan --- */}
      <Grid container spacing={6} sx={{ justifyContent: "space-around" }}>
        <Grid item xs={12} md={4} sx={{ width: "300px", height: "250px" }}>
          <Paper className="statCard">
            <AttachMoney className="statIcon revenue" sx={{ fontSize: "3rem" }} />
            <Typography variant="h5" className="statTitle">
              Tổng Doanh Thu
            </Typography>
            <Typography variant="subtitle2" className="statSubtitle">
              (Chỉ tính đơn đã thanh toán)
            </Typography>
            <Typography variant="h4" className="statValue revenue">
              {formatCurrency(stats.totalRevenue)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={{ width: "300px", height: "250px" }}>
          <Paper className="statCard">
            <People className="statIcon users" sx={{ fontSize: "3rem" }} />
            <Typography variant="h5" className="statTitle">
              Tổng số người dùng
            </Typography>
            <Typography variant="h4" className="statValue users">
              {stats.totalUsers?.toLocaleString("vi-VN") || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={{ width: "300px", height: "250px" }}>
          <Paper className="statCard">
            <RestaurantMenu className="statIcon sets" sx={{ fontSize: "3rem" }} />
            <Typography variant="h5" className="statTitle">
              Tổng số set ăn dặm
            </Typography>
            <Typography variant="h4" className="statValue sets">
              {stats.totalMealSets?.toLocaleString("vi-VN") || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* --- Trạng thái đơn hàng --- */}
      <Box className="sectionContainer">
        <Typography variant="h4" className="sectionTitle" sx={{ display: "flex", textAlign: "center", justifyContent: "center" }}>
          Tổng số đơn hàng theo trạng thái
        </Typography>
        {stats.orderStatusCount && stats.orderStatusCount.length > 0 ? (
          <Grid container spacing={2} sx={{ justifyContent: "space-around" }}>
            {stats.orderStatusCount.map((item) => (
              <Grid item xs={12} md={4} key={item.status} sx={{ width: "250px", height: "300px" }}>
                <Paper className="statusCard">
                  {statusIcons[item.status] || null}
                  <Typography variant="subtitle1" className="statusTitle">
                    {item.status}
                  </Typography>
                  <Typography
                    variant="h4"
                    className="statusValue"
                    style={{ color: getStatusColor(item.status) }}
                  >
                    {item.count?.toLocaleString("vi-VN") || 0}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">Không có dữ liệu đơn hàng</Alert>
        )}
      </Box>

      {/* --- Phân tích doanh thu + Tỉ lệ set ăn dặm --- */}
      <Box className="sectionContainer">
        <Grid container spacing={2}>
          {/* Biểu đồ doanh thu theo thời gian */}
          <Grid item xs={12} md={6} sx={{ width: "50%" }}>
            <Typography variant="h6" className="sectionTitle">
              Phân tích doanh thu theo thời gian
            </Typography>

            <Tabs
              value={revenueTab}
              onChange={handleRevenueTabChange}
              aria-label="revenue analysis tabs"
              className="revenueTabs"
            >
              <Tab label="Ngày" icon={<TodayIcon />} iconPosition="start" />
              <Tab label="Tháng" icon={<CalendarMonthIcon />} iconPosition="start" />
              <Tab label="Năm" icon={<EventNoteIcon />} iconPosition="start" />
            </Tabs>

            <Paper className="chartContainer">
              {revenueData && revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value), "Doanh Thu"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh Thu"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">Không có dữ liệu doanh thu</Alert>
              )}
            </Paper>
          </Grid>

          {/* Biểu đồ PieChart theo set ăn dặm */}
          <Grid item xs={12} md={6} sx={{ width: "45%" }}>
            <Typography variant="h6" className="sectionTitle">
              Tỉ lệ doanh thu theo set ăn dặm
            </Typography>

            <Paper className="chartContainer" sx={{ height: 440 }}>
              {stats.mealSetSales && stats.mealSetSales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.mealSetSales}
                      dataKey="totalRevenue"
                      nameKey="title"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      label
                    >
                      {stats.mealSetSales.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">Không có dữ liệu set ăn dặm</Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* --- Bảng thống kê bán set ăn --- */}
      <Box className="sectionContainer">
        <Typography variant="h5" className="sectionTitle">
          Thống kê set ăn đã bán
        </Typography>
        {stats.mealSetSales && stats.mealSetSales.length > 0 ? (
          <TableContainer component={Paper} className="productsTable">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: 16, fontWeight: "bold" }}>STT</TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: "bold" }}>Tên Set Ăn</TableCell>
                  <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>Thời lượng (ngày)</TableCell>
                  <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>Giá</TableCell>
                  <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>Số lượng đã bán</TableCell>
                  <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>Doanh thu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.mealSetSales.map((set, index) => (
                  <TableRow key={set.mealSetId}>
                    <TableCell sx={{ fontSize: 14, fontWeight: "bold" }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontSize: 16, fontWeight: "bold" }}>{set.title}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>{set.duration}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>
                      {formatCurrency(set.price)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>
                      {set.totalQuantity?.toLocaleString("vi-VN") || 0}
                    </TableCell >
                    <TableCell align="right" sx={{ fontSize: 16, fontWeight: "bold" }}>
                      {formatCurrency(set.totalRevenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">Chưa có dữ liệu bán set ăn</Alert>
        )}
      </Box>
    </Box>
  );
};

const getStatusColor = (status) => {
  const colors = {
    "Chờ xử lý": "#f39c12",
    "Hoàn thành": "#2ecc71",
    "Đã hủy": "#e74c3c",
  };
  return colors[status] || "#3498db";
};

export default AdminDashboard;
