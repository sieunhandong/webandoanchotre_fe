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
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  // popup QR + countdown + polling
  const [openQr, setOpenQr] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [countdown, setCountdown] = useState(180); // 3 phút
  // eslint-disable-next-line no-unused-vars
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
        // ✅ Lọc chỉ 4 thành phố lớn
        const allowedCities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Khánh Hòa"];
        const filtered = list.filter((p) => allowedCities.includes(p.ProvinceName));

        // ✅ Cập nhật state
        setProvinces(filtered);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      provinces.find((p) => p.ProvinceID === provinceId)?.ProvinceName || "";
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
      districts.find((d) => d.DistrictID === districtId)?.DistrictName || "";
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
    const wardName = wards.find((w) => w.WardCode === wardCode)?.WardName || "";
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
    if (!deliveryTime) {
      setAlert({
        open: true,
        message: "Vui lòng chọn ngày giao hàng mong muốn.",
        severity: "error",
      });
      return;
    }
    const selectedDate = new Date(deliveryTime);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // reset giờ về 0 để so sánh chính xác

    if (selectedDate < todayDate) {
      setAlert({
        open: true,
        message: "Ngày giao hàng không hợp lệ (phải từ hôm nay trở đi).",
        severity: "error",
      });
      return;
    }
    if (!phone) {
      setAlert({
        open: true,
        message: "Vui nhập số điện thoại.",
        severity: "error",
      });
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      setAlert({
        open: true,
        message: "Số điện thoại không hợp lệ (phải gồm 10 số)!",
        severity: "error",
      });
      return;
    }
    if (!address.address || !address.provinceId || !address.districtId || !address.wardCode) {
      setAlert({ open: true, message: "Vui lòng nhập đầy đủ địa chỉ giao hàng.", severity: "error" });
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
        phone
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
          <Typography>STK: VQRQAEQNT2617</Typography>
          <Typography>QUACH THI MINH HUONG</Typography>
          <Typography>Thời gian còn lại: {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)}</Typography>
          <Button variant="outlined" color="error" onClick={handleCloseQr} sx={{ mt: 2 }}>Hủy đơn</Button>
        </DialogContent>
      </Dialog>

      {/* Giao hàng & đơn hàng */}
      <Box className="order-container" sx={{ width: "100%", background: "linear-gradient(135deg, #f5f9ff 0%, #fff5f8 100%)", py: { xs: 3, md: 5 }, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: "95%", maxWidth: "1400px", justifyContent: { xs: "flex-start", md: "center" } }}>
          {/* Thông tin giao hàng */}
          <Grid item xs={12} md={8}>
            <Box className="shipping-box" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, boxShadow: "0 8px 32px rgba(114, 204, 241, 0.15)", bgcolor: "white", width: "100%", transition: "all 0.3s ease", "&:hover": { boxShadow: "0 12px 40px rgba(114, 204, 241, 0.25)", transform: "translateY(-4px)" } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3, pb: 2, borderBottom: "2px solid #72CCF1" }}>
                <LocationOnIcon sx={{ fontSize: 32, color: "#72CCF1", mr: 1.5, animation: "bounce 2s infinite" }} />
                <Typography variant="h5" fontWeight="700" sx={{ color: "#2c3e50" }}>Thông tin giao hàng</Typography>
              </Box>

              {/* Trust badges */}
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box className="trust-badge" sx={{ display: "flex", alignItems: "center", bgcolor: "#E8F6FC", px: 2, py: 1, borderRadius: 2, flex: "1 1 auto", minWidth: "fit-content" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#72CCF1", mr: 1, animation: "pulse 2s infinite" }} />
                  <Typography variant="body2" sx={{ color: "#2c3e50", fontWeight: 600 }}>✓ Giao hàng nhanh</Typography>
                </Box>
                <Box className="trust-badge" sx={{ display: "flex", alignItems: "center", bgcolor: "#FFF0F5", px: 2, py: 1, borderRadius: 2, flex: "1 1 auto", minWidth: "fit-content" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#FFB6C1", mr: 1, animation: "pulse 2s infinite" }} />
                  <Typography variant="body2" sx={{ color: "#2c3e50", fontWeight: 600 }}>✓ Bảo đảm an toàn</Typography>
                </Box>
                <Box className="trust-badge" sx={{ display: "flex", alignItems: "center", bgcolor: "#F0FFF4", px: 2, py: 1, borderRadius: 2, flex: "1 1 auto", minWidth: "fit-content" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#90EE90", mr: 1, animation: "pulse 2s infinite" }} />
                  <Typography variant="body2" sx={{ color: "#2c3e50", fontWeight: 600 }}>✓ Hoàn tiền 100%</Typography>
                </Box>
              </Box>

              <TextField fullWidth type="date" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} inputProps={{ min: new Date().toISOString().split("T")[0] }} label="Ngày giao hàng *" InputLabelProps={{ shrink: true }} sx={{ mb: { xs: 2, md: 2.5 }, "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#72CCF1" }, "&.Mui-focused fieldset": { borderColor: "#72CCF1", borderWidth: 2 } }, "& .MuiInputLabel-root.Mui-focused": { color: "#72CCF1" } }} />
              <TextField
                fullWidth
                label="Số điện thoại liên hệ *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Nhập số điện thoại của bạn"
                sx={{
                  mb: { xs: 2, md: 2.5 },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#72CCF1" },
                    "&.Mui-focused fieldset": { borderColor: "#72CCF1", borderWidth: 2 },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#72CCF1" },
                }}
                inputProps={{
                  pattern: "[0-9]{10}", // chỉ cho phép 10-11 chữ số
                }}
              />
              <TextField fullWidth label="Địa chỉ cụ thể *" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} placeholder="Số nhà, tên đường..." sx={{ mb: { xs: 2, md: 2.5 }, "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#72CCF1" }, "&.Mui-focused fieldset": { borderColor: "#72CCF1", borderWidth: 2 } }, "& .MuiInputLabel-root.Mui-focused": { color: "#72CCF1" } }} />
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth label="Tỉnh/Thành phố *" value={address.provinceId} onChange={handleProvinceChange} sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#72CCF1" }, "&.Mui-focused fieldset": { borderColor: "#72CCF1", borderWidth: 2 } }, "& .MuiInputLabel-root.Mui-focused": { color: "#72CCF1" }, minWidth: { xs: "100%", sm: "200px" } }}>
                    <MenuItem value="">-- Chọn tỉnh/thành phố --</MenuItem>
                    {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth label="Quận/Huyện *" value={address.districtId} onChange={handleDistrictChange} disabled={!address.provinceId} sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#72CCF1" }, "&.Mui-focused fieldset": { borderColor: "#72CCF1", borderWidth: 2 } }, "& .MuiInputLabel-root.Mui-focused": { color: "#72CCF1" }, minWidth: { xs: "100%", sm: "200px" } }}>
                    <MenuItem value="">-- Chọn quận/huyện --</MenuItem>
                    {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth label="Phường/Xã *" value={address.wardCode} onChange={handleWardChange} disabled={!address.districtId} sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#72CCF1" }, "&.Mui-focused fieldset": { borderColor: "#72CCF1", borderWidth: 2 } }, "& .MuiInputLabel-root.Mui-focused": { color: "#72CCF1" }, minWidth: { xs: "100%", sm: "200px" } }}>
                    <MenuItem value="">-- Chọn phường/xã --</MenuItem>
                    {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                  </TextField>
                </Grid>
              </Grid>

              {/* Security note */}
              <Box sx={{ mt: 3, p: 2, bgcolor: "#FFF9E6", borderRadius: 2, borderLeft: "4px solid #FFD93D" }}>
                <Typography variant="body2" sx={{ color: "#856404", display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "8px", fontSize: "18px" }}>🔒</span>
                  Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng cho mục đích giao hàng
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thông tin đơn hàng */}
          <Grid item xs={12} md={4}>
            <Box className="order-summary-box" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, boxShadow: "0 8px 32px rgba(255, 182, 193, 0.15)", bgcolor: "white", width: "100%", position: "sticky", top: 20, transition: "all 0.3s ease", "&:hover": { boxShadow: "0 12px 40px rgba(255, 182, 193, 0.25)" } }}>
              <Box sx={{ background: "linear-gradient(135deg, #72CCF1 0%, #FFB6C1 100%)", color: "white", px: 2, py: 1.5, borderRadius: 2, mb: 3, textAlign: "center" }}>
                <Typography variant="h6" fontWeight="700">Đơn hàng (1 sản phẩm)</Typography>
              </Box>

              <Box sx={{ bgcolor: "#F8FCFF", p: 2, borderRadius: 2, mb: 2, border: "2px dashed #72CCF1" }}>
                <Typography variant="h6" fontWeight="bold" mb={1} sx={{ color: "#2c3e50" }}>{setData.title}</Typography>
                <Typography color="text.secondary" mb={2} sx={{ fontSize: "0.9rem" }}>{setData.description}</Typography>
                <Typography color="text.secondary" mb={2} sx={{ fontSize: "0.9rem" }}>✓ Tiện lợi</Typography>
                <Typography color="text.secondary" mb={2} sx={{ fontSize: "0.9rem" }}>✓ Tiết kiệm thời gian</Typography>
                <Typography color="text.secondary" mb={2} sx={{ fontSize: "0.9rem" }}>✓ Đầy đủ dinh dưỡng</Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "white", px: 2, py: 1, borderRadius: 1 }}>
                  <span style={{ fontSize: "20px" }}>⏱</span>
                  <Typography fontWeight="600" sx={{ color: "#72CCF1" }}>Thời gian: {setData.duration} ngày</Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: "center", my: 3, py: 2, background: "linear-gradient(135deg, #E8F6FC 0%, #FFF0F5 100%)", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>Tổng thanh toán</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ background: "linear-gradient(135deg, #72CCF1 0%, #FF69B4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "glow 2s ease-in-out infinite" }}>{setData.price.toLocaleString("vi-VN")}₫</Typography>
              </Box>

              <Box sx={{ bgcolor: "#F0FFF4", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" fontWeight="600" mb={1} sx={{ color: "#2c3e50" }}>✨ Ưu đãi đặc biệt:</Typography>
                <Typography variant="body2" sx={{ color: "#4a5568", mb: 0.5 }}>• Tư vấn miễn phí</Typography>
                <Typography variant="body2" sx={{ color: "#4a5568", mb: 0.5 }}>• Tặng kèm hướng dẫn sử dụng</Typography>
                <Typography variant="body2" sx={{ color: "#4a5568" }}>• Hỗ trợ 24/7 qua hotline</Typography>
              </Box>

              <Button variant="contained" fullWidth onClick={handlePay} disabled={paying} sx={{ py: 1.5, fontSize: "1.1rem", fontWeight: 700, background: "linear-gradient(135deg, #72CCF1 0%, #5AB9EA 100%)", boxShadow: "0 4px 15px rgba(114, 204, 241, 0.4)", transition: "all 0.3s ease", "&:hover": { background: "linear-gradient(135deg, #5AB9EA 0%, #72CCF1 100%)", boxShadow: "0 6px 20px rgba(114, 204, 241, 0.6)", transform: "translateY(-2px)" }, "&:disabled": { background: "#ccc" } }}>
                {paying ? <CircularProgress size={24} sx={{ color: "white" }} /> : "🛒 Đặt hàng ngay"}
              </Button>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "#72CCF1", fontWeight: 700 }}>99+</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">Đơn hàng</Typography>
                </Box>
                <Box sx={{ width: "1px", bgcolor: "#ddd" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "#ffe762ff", fontWeight: 700 }}>4.9★</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">Đánh giá</Typography>
                </Box>
                <Box sx={{ width: "1px", bgcolor: "#ddd" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "#72CCF1", fontWeight: 700 }}>99%</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">Hài lòng</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SetDetail;
