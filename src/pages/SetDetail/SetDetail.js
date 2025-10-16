import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  CircularProgress,
  TextField,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getMealSetById } from "../../services/MealSetService";
import { createOrder, getOrderStatus, deleteOrder } from "../../services/OrderService";
import { getProvinces, getDistricts, getWards } from "../../services/GHNService";
import "./SetDetail.css";

const SetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [setData, setSetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    address: "",
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    wardCode: "",
    wardName: "",
  });
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paying, setPaying] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  // popup QR + countdown + polling
  const [openQr, setOpenQr] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [countdown, setCountdown] = useState(180); // 3 phút
  const [polling, setPolling] = useState(false);

  // Load set & provinces
  useEffect(() => {
    const fetchSet = async () => {
      try {
        const res = await getMealSetById(id);
        const data = res.data?.data || res.data;
        setSetData(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy set ăn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSet();

    const fetchProvinces = async () => {
      try {
        const res = await getProvinces();
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setProvinces(list);
      } catch (err) {
        console.error("❌ Lỗi load tỉnh:", err);
      }
    };
    fetchProvinces();
  }, [id]);

  // Countdown + tự hủy order nếu hết thời gian
  useEffect(() => {
    let timer;
    if (openQr) {
      setCountdown(180); // reset countdown khi mở popup
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleCancelOrder();
            setAlert({ open: true, message: "Bạn chưa thanh toán đơn hàng.", severity: "warning" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [openQr]);

  // Polling payment status
  useEffect(() => {
    let pollInterval;
    if (openQr && orderCode) {
      pollInterval = setInterval(async () => {
        try {
          const res = await getOrderStatus(orderCode);
          if (res.data.paymentStatus === "completed") {
            clearInterval(pollInterval);
            setPolling(false);
            setOpenQr(false);
            navigate(`/payment-success?status=success&orderCode=${orderCode}`);
          }
        } catch (err) {
          console.error("❌ Lỗi poll payment status:", err);
        }
      }, 3000); // poll mỗi 3s
    }
    return () => clearInterval(pollInterval);
  }, [openQr, orderCode, navigate]);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    const provinceName =
      provinces.find((p) => p.ProvinceID == provinceId)?.ProvinceName || "";
    setAddress({
      ...address,
      provinceId,
      provinceName,
      districtId: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    });
    try {
      const res = await getDistricts(provinceId);
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setDistricts(list);
      setWards([]);
    } catch (err) {
      console.error("❌ Lỗi load huyện:", err);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    const districtName =
      districts.find((d) => d.DistrictID == districtId)?.DistrictName || "";
    setAddress({
      ...address,
      districtId,
      districtName,
      wardCode: "",
      wardName: "",
    });
    try {
      const res = await getWards(districtId);
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setWards(list);
    } catch (err) {
      console.error("❌ Lỗi load xã:", err);
    }
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const wardName = wards.find((w) => w.WardCode == wardCode)?.WardName || "";
    setAddress({ ...address, wardCode, wardName });
  };

  const handlePay = async () => {
    const token =
      localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      setAlert({
        open: true,
        message: "Vui lòng đăng nhập trước khi thanh toán.",
        severity: "error",
      });
      setTimeout(() => {
        navigate("/account/login", { state: { redirectTo: location.pathname } });
      }, 1500);
      return;
    }

    if (!deliveryTime || !address.address || !address.provinceId || !address.districtId || !address.wardCode) {
      setAlert({ open: true, message: "Vui lòng nhập đầy đủ thông tin.", severity: "error" });
      return;
    }

    setPaying(true);
    try {
      const res = await createOrder({
        setId: setData._id,
        duration: setData.duration,
        price: setData.price,
        deliveryTime,
        address,
      });
      if (res.data?.success) {
        const { paymentUrl, orderCode } = res.data.data;
        setQrUrl(paymentUrl);
        setOrderCode(orderCode);
        setOpenQr(true);
      } else {
        setAlert({ open: true, message: "Thanh toán thất bại, vui lòng thử lại.", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Lỗi khi thanh toán.", severity: "error" });
    } finally {
      setPaying(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token =
        localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!orderCode || !token) return;
      await deleteOrder(orderCode); // gọi API xóa order
    } catch (err) {
      console.error("❌ Lỗi khi hủy order:", err);
    } finally {
      setOpenQr(false);
      setOrderCode("");
      setQrUrl("");
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });
  const handleCloseQr = () => handleCancelOrder();

  if (loading) return <Container className="loading-container"><CircularProgress /></Container>;
  if (!setData)
    return (
      <Container maxWidth={false} className="empty-cart-paper">
        <Paper className="empty-cart-paper">
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Không tìm thấy set ăn.
          </Typography>
          <Button component={Link} to="/" variant="contained" startIcon={<ArrowBackIcon />}>
            Tiếp tục mua hàng
          </Button>
        </Paper>
      </Container>
    );

  return (
    <>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      {/* Popup QR */}
      <Dialog open={openQr} onClose={handleCloseQr}>
        <DialogTitle>Thanh toán đơn hàng</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography>Quét QR để thanh toán</Typography>
          <img src={qrUrl} alt="QR Payment" style={{ width: "200px", margin: "20px 0" }} />
          <Typography>Thời gian còn lại: {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)}</Typography>
          <Button variant="outlined" color="error" onClick={handleCloseQr} sx={{ mt: 2 }}>Hủy đơn</Button>
        </DialogContent>
      </Dialog>

      {/* Giao hàng & đơn hàng */}
      <Box className="order-container" sx={{ width: "100%", bgcolor: "#fafafa", py: { xs: 2, md: 4 }, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={{ xs: 1, md: 2 }} sx={{ width: "95%", maxWidth: "1800px", justifyContent: { xs: "flex-start", md: "center" } }}>
          {/* Thông tin giao hàng */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2, bgcolor: "white", width: "100%" }}>
              <Typography variant="h6" gutterBottom><LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />Thông tin giao hàng</Typography>
              <TextField fullWidth type="date" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} inputProps={{ min: new Date().toISOString().split("T")[0] }} label="Ngày giao hàng *" InputLabelProps={{ shrink: true }} sx={{ mb: { xs: 1.5, md: 2 } }} />
              <TextField fullWidth label="Địa chỉ cụ thể *" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} sx={{ mb: { xs: 1.5, md: 2 } }} />
              <Grid container spacing={{ xs: 0.5, md: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth label="Tỉnh/Thành phố *" value={address.provinceId} onChange={handleProvinceChange} sx={{ minWidth: { xs: "100%", sm: "200px" } }}>
                    <MenuItem value="">-- Chọn tỉnh/thành phố --</MenuItem>
                    {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth label="Quận/Huyện *" value={address.districtId} onChange={handleDistrictChange} disabled={!address.provinceId} sx={{ minWidth: { xs: "100%", sm: "200px" } }}>
                    <MenuItem value="">-- Chọn quận/huyện --</MenuItem>
                    {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth label="Phường/Xã *" value={address.wardCode} onChange={handleWardChange} disabled={!address.districtId} sx={{ minWidth: { xs: "100%", sm: "200px" } }}>
                    <MenuItem value="">-- Chọn phường/xã --</MenuItem>
                    {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Thông tin đơn hàng */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2, bgcolor: "white", width: "100%" }}>
              <Typography variant="h6" gutterBottom>Đơn hàng (1 sản phẩm)</Typography>
              <Typography variant="h6" fontWeight="bold" mb={1}>{setData.title}</Typography>
              <Typography color="text.secondary" mb={2}>{setData.description}</Typography>
              <Typography>⏱ Thời gian: {setData.duration} ngày</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary" mt={2}>{setData.price.toLocaleString("vi-VN")}₫</Typography>
              <Box mt={4} pt={2} borderTop="1px solid #ddd">
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Tổng cộng</Typography>
                  <Typography variant="body1">{setData.price.toLocaleString("vi-VN")}₫</Typography>
                </Box>
              </Box>
              <Box mt={3}>
                <Button variant="contained" color="primary" fullWidth onClick={handlePay} disabled={paying}>
                  {paying ? <CircularProgress size={24} /> : "Đặt hàng"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SetDetail;
