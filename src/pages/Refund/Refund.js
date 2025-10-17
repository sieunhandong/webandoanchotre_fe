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
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const Refund = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const REFUND_DAYS_LIMIT = 2;

  const handleComplaintNavigation = (e) => {
    e.preventDefault();
    navigate("/user/complaint");
  };

  const renderRefundConditions = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderLeft: "6px solid #72CDF1",
        backgroundColor: "#f9fcff",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <LocalDiningIcon sx={{ color: "#72CDF1", mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          Điều Kiện Đổi Trả & Hoàn Tiền
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          Sản phẩm chỉ được đổi trả khi{" "}
          <strong>sai sản phẩm, lỗi từ phía TinyYummy</strong> hoặc sản phẩm bị
          hư hỏng trong quá trình vận chuyển.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          Thời gian tiếp nhận yêu cầu đổi trả là trong vòng{" "}
          <strong>{REFUND_DAYS_LIMIT} ngày</strong> kể từ khi nhận hàng.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          Sản phẩm đổi trả cần còn nguyên bao bì, tem nhãn, chưa qua sử dụng và
          còn giữ hóa đơn mua hàng.
        </Typography>
        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
          Các sản phẩm khuyến mãi, giảm giá hoặc hàng dùng thử{" "}
          <strong>không áp dụng đổi trả</strong>.
        </Typography>
      </Box>
    </Paper>
  );

  const renderComplaintSection = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "#f0faff",
        borderLeft: "6px solid #72CDF1",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <ReportProblemIcon sx={{ color: "#72CDF1", mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="#2b2b2b">
          Khiếu Nại & Liên Hệ Hỗ Trợ
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: "#555" }}>
        TinyYummy luôn mong muốn mang đến trải nghiệm tốt nhất cho mẹ và bé 💕.
        Nếu có bất kỳ vấn đề nào liên quan đến đơn hàng hoặc chất lượng sản
        phẩm, mẹ vui lòng gửi yêu cầu tại&nbsp;
        <Link
          component="button"
          onClick={handleComplaintNavigation}
          color="primary"
          underline="hover"
          sx={{ fontWeight: "bold", color: "#72CDF1" }}
        >
          trang khiếu nại
        </Link>
        . Chúng tôi sẽ phản hồi trong vòng <strong>24 giờ</strong> qua Zalo hoặc
        email của mẹ.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          fontStyle: "italic",
          color: "#4a4a4a",
        }}
      >
        🌸 Mẹ có thể chủ động nhắn tin trực tiếp qua{" "}
        <strong>Zalo hoặc Facebook TinyYummy</strong> để được hỗ trợ sớm nhất
        nhé!
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <EmojiEmotionsIcon sx={{ color: "#72CDF1", fontSize: 40, mr: 1 }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="#2b2b2b"
        >
          Chính Sách Đổi Trả & Khiếu Nại - TinyYummy
        </Typography>
      </Box>

      {renderRefundConditions()}
      {renderComplaintSection()}

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
