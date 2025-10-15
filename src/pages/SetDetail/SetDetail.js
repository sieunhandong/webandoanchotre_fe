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
} from "@mui/material";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getMealSetById } from "../../services/MealSetService";
import { step7 } from "../../services/QuizService";
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
      navigate("/account/login", { state: { redirectTo: location.pathname } });
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
    if (!address.address || !address.provinceId || !address.districtId || !address.wardCode) {
      setAlert({
        open: true,
        message: "Vui lòng nhập đầy đủ địa chỉ giao hàng.",
        severity: "error",
      });
      return;
    }

    setPaying(true);
    try {
      const res = await step7({
        sessionId: localStorage.getItem("quiz_sessionId"),
        deliveryTime,
        address,
      });
      if (res.data?.success) {
        const { paymentUrl } = res.data.data;
        window.location.href = paymentUrl;
      } else {
        setAlert({
          open: true,
          message: "Thanh toán thất bại, vui lòng thử lại.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        open: true,
        message: "Lỗi khi thanh toán.",
        severity: "error",
      });
    } finally {
      setPaying(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress />
      </Container>
    );
  }

  if (!setData) {
    return (
      <Container maxWidth={false} className="empty-cart-paper">
        <Paper className="empty-cart-paper">
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Không tìm thấy set ăn.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            className="continue-shopping-button"
            startIcon={<ArrowBackIcon />}
          >
            Tiếp tục mua hàng
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
      <Box
        className="order-container"
        sx={{
          width: "100%",
          bgcolor: "#fafafa",
          py: { xs: 2, md: 4 }, // Giảm padding trên mobile
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={{ xs: 1, md: 2 }} // Giảm spacing trên mobile
          sx={{
            width: "95%",
            maxWidth: "1800px",
            justifyContent: { xs: "flex-start", md: "center" },
          }}
        >
          <Grid item xs={12} md={8}>
            <Box
              className="shipping-paper"
              sx={{
                p: { xs: 2, md: 3 }, // Giảm padding trên mobile
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: "white",
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Thông tin giao hàng
              </Typography>

              <Typography variant="subtitle1" mb={1}>
                📅 Ngày giao hàng mong muốn
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
                label="Ngày giao hàng *"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: { xs: 1.5, md: 2 } }} // Giảm margin-bottom trên mobile
              />

              <TextField
                fullWidth
                label="Địa chỉ cụ thể *"
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                sx={{ mb: { xs: 1.5, md: 2 } }}
              />

              <Grid container spacing={{ xs: 0.5, md: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label="Tỉnh/Thành phố *"
                    value={address.provinceId}
                    onChange={handleProvinceChange}
                    sx={{ minWidth: { xs: "100%", sm: "200px" } }}
                  >
                    <MenuItem value="">-- Chọn tỉnh/thành phố --</MenuItem>
                    {provinces.map((p) => (
                      <MenuItem key={p.ProvinceID} value={p.ProvinceID}>
                        {p.ProvinceName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label="Quận/Huyện *"
                    value={address.districtId}
                    onChange={handleDistrictChange}
                    disabled={!address.provinceId}
                    sx={{ minWidth: { xs: "100%", sm: "200px" } }}
                  >
                    <MenuItem value="">-- Chọn quận/huyện --</MenuItem>
                    {districts.map((d) => (
                      <MenuItem key={d.DistrictID} value={d.DistrictID}>
                        {d.DistrictName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label="Phường/Xã *"
                    value={address.wardCode}
                    onChange={handleWardChange}
                    disabled={!address.districtId}
                    sx={{ minWidth: { xs: "100%", sm: "200px" } }}
                  >
                    <MenuItem value="">-- Chọn phường/xã --</MenuItem>
                    {wards.map((w) => (
                      <MenuItem key={w.WardCode} value={w.WardCode}>
                        {w.WardName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              className="order-summary-paper"
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: "white",
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom className="order-summary-title">
                Đơn hàng (1 sản phẩm)
              </Typography>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                {setData.title}
              </Typography>
              <Typography color="text.secondary" mb={2}>
                {setData.description}
              </Typography>
              <Typography>⏱ Thời gian: {setData.duration} ngày</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary" mt={2}>
                {setData.price.toLocaleString("vi-VN")}₫
              </Typography>

              <Box mt={4} pt={2} borderTop="1px solid #ddd" className="summary-section">
                <Box className="summary-row">
                  <Typography variant="body1">Tổng cộng</Typography>
                  <Typography variant="body1" className="summary-total-amount">
                    {setData.price.toLocaleString("vi-VN")}₫
                  </Typography>
                </Box>
              </Box>

              <Box className="action-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="place-order-button"
                  onClick={handlePay}
                  disabled={paying}
                  sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
                >
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