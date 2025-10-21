import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Link,
  Box,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const Refund = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleComplaintNavigation = (e) => {
    e.preventDefault();
    navigate("/user/complaint");
  };

  const renderPurposeScope = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#f9fcff",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <DescriptionIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          1. Mục Đích và Phạm Vi Áp Dụng
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
        Các điều khoản và chính sách này quy định quyền lợi và nghĩa vụ của <strong>TinyYummy Việt Nam</strong> và Khách hàng khi thực hiện đặt hàng, thanh toán và nhận sản phẩm thông qua website chính thức <strong>www.tinyyummy.com</strong>. Tất cả khách hàng khi truy cập và đặt hàng đều được xem như đã đọc, hiểu và đồng ý với các điều khoản dưới đây.
      </Typography>

      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
        Thông tin được sử dụng cho các mục đích:
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
          Xử lý đơn hàng: gọi điện/tin nhắn xác nhận việc đặt hàng, thông báo về trạng thái đơn hàng & thời gian giao hàng, xác nhận việc huỷ đơn hàng (nếu có).
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
          Gửi thư ngỏ/thư cảm ơn, giới thiệu sản phẩm mới, dịch vụ mới hoặc các chương trình khuyến mại của TinyYummy.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
          Giải quyết khiếu nại.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
          Các khảo sát để chăm sóc Khách Hàng tốt hơn.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
          Các trường hợp có sự yêu cầu của cơ quan nhà nước có thẩm quyền, hoặc bắt buộc phải cung cấp theo quy định của pháp luật.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
          Mục đích hợp lý khác nhằm phục vụ yêu cầu của Khách Hàng.
        </Typography>
      </Box>
    </Paper>
  );

  const renderOrderPolicy = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#fff9f0",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <ShoppingCartIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          2. Chính Sách Đặt Hàng
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          Khách hàng có thể đặt sản phẩm hoặc gói dịch vụ <strong>(3 ngày, 7 ngày, 1 tháng)</strong> thông qua website TinyYummy.com hoặc qua kênh tư vấn trực tuyến (hotline, fanpage), tuy nhiên mọi đơn hàng chỉ được <strong>xác nhận chính thức</strong> khi hoàn tất thanh toán trực tuyến trên website.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          Sau khi hoàn tất đơn hàng, hệ thống sẽ <strong>gửi thông báo xác nhận đơn hàng</strong> qua email đăng ký.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          Để đảm bảo chất lượng sản phẩm tươi mới, TinyYummy <strong>không nhận hủy đơn</strong> sau khi đơn đã được xác nhận và chuẩn bị chế biến.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          Khách hàng có thể <strong>thay đổi thông tin giao hàng</strong> (địa chỉ, khung giờ) trước ít nhất <strong>24 giờ</strong> so với thời gian giao dự kiến.
        </Typography>
      </Box>
    </Paper>
  );

  const renderPaymentPolicy = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#f0fff4",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <PaymentIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          3. Chính Sách Thanh Toán
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
        TinyYummy áp dụng hình thức <strong>thanh toán trả trước 100%</strong> để đảm bảo quy trình chuẩn bị nguyên liệu và chế biến theo thực đơn cá nhân hóa:
      </Typography>

      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
        Hình thức thanh toán:
      </Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" variant="body1" sx={{ mb: 0.5, color: "#555" }}>
          Thanh toán trực tuyến qua thẻ ngân hàng nội địa, thẻ quốc tế (Visa/MasterCard).
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#e8f5e9",
          border: "1px solid #4caf50",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: "#2e7d32" }}>
          🔒 Chính sách bảo mật:
        </Typography>
        <Typography variant="body2" sx={{ color: "#2e7d32" }}>
          Tất cả giao dịch thanh toán được xử lý qua hệ thống bảo mật đạt chuẩn <strong>PCI DSS</strong>, thông tin khách hàng được mã hóa và bảo mật tuyệt đối. TinyYummy <strong>không lưu trữ</strong> thông tin thẻ thanh toán của khách hàng trên hệ thống.
        </Typography>
      </Box>
    </Paper>
  );

  const renderShippingPolicy = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#fffbf0",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <LocalShippingIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          4. Chính Sách Vận Chuyển và Phí Giao Hàng
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          TinyYummy cung cấp dịch vụ <strong>giao hàng tận nơi</strong> tại các khu vực trung tâm <strong>TP. Hồ Chí Minh và Hà Nội</strong> (và mở rộng dần các tỉnh thành khác).
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          <strong>Thời gian giao hàng:</strong> từ <strong>7h - 9h sáng</strong> hằng ngày.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          <strong>Phí vận chuyển:</strong>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
              <strong>Miễn phí</strong> cho các đơn hàng/gói dịch vụ có giá trị từ <strong>600.000 VNĐ</strong> trở lên hoặc trong khu vực giao hàng nội thành được hỗ trợ.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5, color: "#555" }}>
              Các đơn hàng có giá trị thấp hơn hoặc ở ngoài khu vực hỗ trợ sẽ áp dụng phí ship cố định <strong>20.000 - 35.000 VNĐ/đơn</strong>, tùy theo khoảng cách và thời gian giao.
            </Typography>
          </Box>
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          TinyYummy cam kết giao sản phẩm <strong>đúng giờ - đúng nhiệt độ - đúng thực đơn</strong>, đảm bảo thức ăn luôn trong tình trạng tươi ngon và an toàn.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          Trong trường hợp <strong>bất khả kháng</strong> (thời tiết xấu, gián đoạn vận chuyển, sự cố hệ thống), thời gian giao có thể thay đổi. TinyYummy sẽ thông báo trước cho khách hàng và hỗ trợ sắp xếp lại lịch giao hợp lý.
        </Typography>
      </Box>
    </Paper>
  );

  const renderRefundPolicy = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#fff0f0",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <SwapHorizIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          5. Chính Sách Đổi/Trả Hàng
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
        TinyYummy chỉ chấp nhận đổi/trả hàng trong trường hợp:
      </Typography>

      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <Typography component="li" variant="body1" sx={{ mb: 1, color: "#555" }}>
          Sản phẩm bị <strong>hư hỏng, đổ vỡ</strong> trong quá trình giao hàng.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1, color: "#555" }}>
          Sản phẩm <strong>không đúng với đơn đặt hàng</strong> (sai món, sai khẩu phần).
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        <Typography variant="body1" sx={{ color: "#856404" }}>
          ⏰ Yêu cầu phản hồi phải được gửi trong vòng <strong>2 giờ</strong> kể từ khi nhận hàng, kèm hình ảnh chứng minh, liên hệ qua <strong>HOTLINE hoặc ZALO</strong> để được nhận phản hồi sớm nhất.
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#d1ecf1",
          border: "1px solid #bee5eb",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="body1" sx={{ color: "#0c5460" }}>
          ✅ TinyYummy sẽ tiến hành xử lý <strong>hoàn tiền</strong> hoặc <strong>giao bù sản phẩm mới</strong> trong vòng <strong>24 giờ</strong> (tùy trường hợp cụ thể).
        </Typography>
      </Box>
    </Paper>
  );

  const renderCommitment = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#f0f8ff",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <VerifiedUserIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          6. Cam Kết và Trách Nhiệm
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          TinyYummy cam kết tuân thủ các tiêu chuẩn về an toàn thực phẩm <strong>(HACCP, ISO 22000:2018)</strong> và quy định tại <strong>Nghị định 15/2018/NĐ-CP</strong> của Chính phủ.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1.5, color: "#555" }}>
          Khách hàng có trách nhiệm cung cấp thông tin chính xác (địa chỉ, số điện thoại, dị ứng thực phẩm…) để TinyYummy có thể đảm bảo trải nghiệm và an toàn dinh dưỡng tối đa.
        </Typography>
      </Box>
    </Paper>
  );

  const renderContact = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "#f0faff",
        borderLeft: "6px solid #72CDF1",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <ContactSupportIcon sx={{ color: "#72CDF1", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          7. Liên Hệ Hỗ Trợ
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          📞 <strong>Hotline:</strong> <Link href="tel:0969729035" sx={{ color: "#72CDF1", fontWeight: "bold" }}>0969729035</Link>
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          📧 <strong>Email:</strong> <Link href="mailto:tinyyummy03@gmail.com" sx={{ color: "#72CDF1", fontWeight: "bold" }}>tinyyummy03@gmail.com</Link>
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          🕐 <strong>Giờ làm việc:</strong> 8:00 – 18:00 (từ Thứ 2 đến Thứ 7, trừ ngày lễ)
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          📝 <strong>Gửi khiếu nại tại:</strong>{" "}
          <Link
            component="button"
            onClick={handleComplaintNavigation}
            color="primary"
            underline="hover"
            sx={{ fontWeight: "bold", color: "#72CDF1" }}
          >
            Trang khiếu nại
          </Link>
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: 2,
          fontStyle: "italic",
          color: "#4a4a4a",
          backgroundColor: "#e3f2fd",
          p: 2,
          borderRadius: 1,
        }}
      >
        🌸 Mẹ có thể chủ động nhắn tin trực tiếp qua{" "}
        <strong>Zalo hoặc Facebook TinyYummy</strong> để được hỗ trợ sớm nhất nhé!
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <DescriptionIcon sx={{ color: "#72CDF1", fontSize: 40, mr: 1 }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="#2b2b2b"
        >
          Điều Khoản và Chính Sách
        </Typography>
      </Box>

      <Typography
        variant="h6"
        textAlign="center"
        sx={{ mb: 4, color: "#555", fontStyle: "italic" }}
      >
        Đặt Hàng – Thanh Toán – Vận Chuyển
      </Typography>

      {renderPurposeScope()}
      {renderOrderPolicy()}
      {renderPaymentPolicy()}
      {renderShippingPolicy()}
      {renderRefundPolicy()}
      {renderCommitment()}
      {renderContact()}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ bgcolor: "#72CDF1" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Refund;