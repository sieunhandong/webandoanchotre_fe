import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Login as LoginIcon,
  Home as HomeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { getProfile, updateProfile } from "../../services/UserService";
import "./Profile.css";
import AccountLayout from "../../components/BreadCrumb/AccountLayout";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    babyInfo: {
      age: "",
      weight: "",
      allergies: [],
      feedingMethod: "traditional",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editError, setEditError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        if (res.data?.user) {
          const u = res.data.user;
          setUser(u);

          setEditData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            babyInfo: u.userInfo?.babyInfo || {
              age: "",
              weight: "",
              allergies: [],
              feedingMethod: "traditional",
            },
          });

          setIsAuthenticated(true);
        } else {
          setError("Dữ liệu người dùng không hợp lệ");
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
        } else {
          setError("Không thể kết nối đến server");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (["age", "weight", "feedingMethod"].includes(name)) {
      setEditData((prev) => ({
        ...prev,
        babyInfo: { ...prev.babyInfo, [name]: value },
      }));
    } else if (name === "allergies") {
      // Phân tách chuỗi thành mảng, ví dụ: "trứng,sữa"
      setEditData((prev) => ({
        ...prev,
        babyInfo: { ...prev.babyInfo, allergies: value.split(",") },
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditError("");
    setSuccess(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      babyInfo: user.userInfo?.babyInfo || {
        age: "",
        weight: "",
        allergies: [],
        feedingMethod: "traditional",
      },
    });
    setEditError("");
  };

  const saveEdit = async () => {
    setSaving(true);
    setEditError("");
    try {
      await updateProfile(editData);
      // cập nhật state local
      setUser({ ...user, ...editData, userInfo: { babyInfo: editData.babyInfo } });
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
        "Cập nhật thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="centered">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <div className="login-box">
          <div className="avatar-large">
            <LoginIcon fontSize="large" />
          </div>
          <h2>Vui lòng đăng nhập để tiếp tục</h2>
          <p>Bạn cần đăng nhập để xem thông tin tài khoản của mình.</p>
          <div className="login-actions">
            <Link className="btn primary" to="/login">
              <LoginIcon /> Đăng nhập
            </Link>
            <Link className="btn" to="/">
              <HomeIcon /> Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccountLayout user={user}>
      <div className="profile-header">
        <h1>THÔNG TIN TÀI KHOẢN</h1>
        {!isEditing ? (
          <button className="btn-edit" onClick={startEdit}>
            <EditIcon /> Chỉnh sửa
          </button>
        ) : (
          <div className="edit-actions">
            <button
              className="btn btn-cancel"
              onClick={cancelEdit}
              disabled={saving}
            >
              <CancelIcon /> Hủy
            </button>
            <button
              className="btn btn-save primary"
              onClick={saveEdit}
              disabled={saving}
            >
              {saving ? <div className="spinner-small" /> : <><SaveIcon /> Lưu</>}
            </button>
          </div>
        )}
      </div>

      {editError && <div className="error-message">{editError}</div>}
      {success && <div className="success-message">Cập nhật thông tin thành công!</div>}

      {/* Thông tin account */}
      <div className="info-row">
        <div className="info-label"><PersonIcon /> Họ tên:</div>
        <div className="info-value">
          {isEditing ? (
            <input
              className="field-input"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              placeholder="Nhập họ và tên"
            />
          ) : user.name || "Chưa cập nhật"}
        </div>
      </div>

      <div className="info-row">
        <div className="info-label"><EmailIcon /> Email:</div>
        <div className="info-value">
          {isEditing ? (
            <input
              className="field-input"
              name="email"
              type="email"
              value={editData.email}
              onChange={handleEditChange}
              placeholder="Nhập email"
              disabled
            />
          ) : user.email || "Chưa cập nhật"}
        </div>
      </div>

      <div className="info-row">
        <div className="info-label"><PhoneIcon /> Số điện thoại:</div>
        <div className="info-value">
          {isEditing ? (
            <input
              className="field-input"
              name="phone"
              value={editData.phone}
              onChange={handleEditChange}
              placeholder="Nhập số điện thoại"
            />
          ) : user.phone || "Chưa cập nhật"}
        </div>
      </div>

      {/* Thông tin babyInfo */}
      <h2>THÔNG TIN TRẺ</h2>

      <div className="info-row">
        <div className="info-label">Tuổi:</div>
        <div className="info-value">
          {isEditing ? (
            <input
              className="field-input"
              name="age"
              value={editData.babyInfo.age}
              onChange={handleEditChange}
              placeholder="Ví dụ: 8 tháng"
            />
          ) : editData.babyInfo.age || "Chưa cập nhật"}
        </div>
      </div>

      <div className="info-row">
        <div className="info-label">Cân nặng:</div>
        <div className="info-value">
          {isEditing ? (
            <input
              className="field-input"
              name="weight"
              value={editData.babyInfo.weight}
              onChange={handleEditChange}
              placeholder="Ví dụ: 8kg"
            />
          ) : editData.babyInfo.weight || "Chưa cập nhật"}
        </div>
      </div>

      <div className="info-row">
        <div className="info-label">Dị ứng:</div>
        <div className="info-value">
          {isEditing ? (
            <input
              className="field-input"
              name="allergies"
              value={editData.babyInfo.allergies.join(",")}
              onChange={handleEditChange}
              placeholder="Nhập, phân cách bằng dấu ,"
            />
          ) : editData.babyInfo.allergies.length > 0
            ? editData.babyInfo.allergies.join(", ")
            : "Chưa cập nhật"}
        </div>
      </div>

      <div className="info-row">
        <div className="info-label">Phương pháp ăn:</div>
        <div className="info-value">
          {isEditing ? (
            <select
              className="field-input"
              name="feedingMethod"
              value={editData.babyInfo.feedingMethod}
              onChange={handleEditChange}
            >
              <option value="traditional">Truyền thống</option>
              <option value="blw">BLW</option>
              <option value="japanese">Nhật</option>
            </select>
          ) : editData.babyInfo.feedingMethod || "Chưa cập nhật"}
        </div>
      </div>
    </AccountLayout>
  );
}
