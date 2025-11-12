import React, { useState, useEffect } from "react";
import {
  ReportProblem,
  History,
  Send,
  Cancel,
  Login,
  EmojiEmotions,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  cancelComplaint,
  getComplaints,
  getProfile,
  submitComplaint,
} from "../../services/UserService";
import "./ComplaintPage.css";

const ComplaintPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ type: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ name: decoded.name || "Tài khoản" });
      } catch {
        console.error("Token không hợp lệ");
      }
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile();
        if (res.data?.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          fetchComplaints();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        navigate("/account/login");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const res = await getComplaints();
      const sorted = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComplaints(sorted);
    } catch {
      setError("Không thể tải phản ánh");
      setShowSnackbar(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.description.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      setShowSnackbar(true);
      return;
    }

    try {
      await submitComplaint(formData);
      setFormData({ type: "", description: "" });
      setSuccess("Phản ánh của mẹ đã được gửi thành công 💕");
      fetchComplaints();
    } catch {
      setError("Không thể gửi phản ánh. Vui lòng thử lại sau.");
    } finally {
      setShowSnackbar(true);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelComplaint(id);
      setSuccess("Đã hủy phản ánh thành công!");
      fetchComplaints();
    } catch {
      setError("Không thể hủy phản ánh. Vui lòng thử lại sau.");
    } finally {
      setShowSnackbar(true);
    }
  };

  const formatDate = (str) =>
    new Date(str).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang chờ xử lý":
        return "#f5a623";
      case "Đã tiếp nhận":
        return "#72CDF1";
      case "Đã giải quyết":
        return "#4caf50";
      case "Đã hủy":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  if (isLoading) return <div className="loading">Đang tải...</div>;

  if (!isAuthenticated)
    return (
      <div className="container">
        <div className="card login-card">
          <h2 className="title">
            <Login style={{ color: "#72CDF1" }} /> Vui lòng đăng nhập
          </h2>
          <p>Bạn cần đăng nhập để gửi phản ánh</p>
          <Link to="/account/login" className="button primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container">
      <h1 className="main-title">
        <EmojiEmotions style={{ color: "#72CDF1" }} /> Phản ánh & Hỗ trợ TinyYummy
      </h1>
      <p className="subtitle">
        TinyYummy luôn lắng nghe để phục vụ mẹ và bé tốt hơn 💕
      </p>

      <div className="grid">
        <div className="left">
          <div className="card">
            <h3 className="title">
              <ReportProblem style={{ color: "#72CDF1" }} /> Gửi phản ánh
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Chủ đề phản ánh</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="">-- Chọn --</option>
                  <option value="Đơn hàng">Vấn đề về đơn hàng</option>
                  <option value="Payment">Thanh toán</option>
                  <option value="Website">Giao diện / Website</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nội dung phản ánh</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Mẹ hãy mô tả chi tiết vấn đề để TinyYummy hỗ trợ nhanh nhất nhé 💙"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <p className="note">
                💌 Sau khi gửi, TinyYummy sẽ liên hệ lại qua Zalo hoặc email để
                hỗ trợ sớm nhất.
              </p>

              <button type="submit" className="button primary">
                <Send fontSize="small" /> Gửi phản ánh
              </button>
            </form>
          </div>
        </div>

        <div className="right">
          <div className="card">
            <h3 className="title">
              <History style={{ color: "#72CDF1" }} /> Lịch sử phản ánh
            </h3>
            {complaints.length > 0 ? (
              complaints.map((item) => (
                <div key={item._id} className="complaint-card">
                  <div className="status-row">
                    <strong>{item.type}</strong>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(item.status)}22`,
                        color: getStatusColor(item.status),
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="time">{formatDate(item.createdAt)}</p>
                  <p>{item.description}</p>
                  {item.status === "Đang chờ xử lý" && (
                    <button
                      className="button danger"
                      onClick={() => handleCancel(item._id)}
                    >
                      <Cancel fontSize="small" /> Hủy phản ánh
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="empty">Mẹ chưa có phản ánh nào.</p>
            )}
          </div>
        </div>
      </div>

      {showSnackbar && (
        <div
          className={`snackbar ${error ? "error" : "success"}`}
          onClick={() => setShowSnackbar(false)}
        >
          {error || success}
        </div>
      )}
    </div>
  );
};

export default ComplaintPage;
