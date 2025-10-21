// Profile.js
import React, { useState, useEffect } from "react";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { getProfile, updateProfile } from "../../services/UserService";
import AccountLayout from "../../components/BreadCrumb/AccountLayout";
import "./Profile.css";

// MUI Alert wrapper
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    babyInfo: {
      age: "",
      weight: "",
      allergies: [],
      feedingMethod: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        if (res?.data?.user && mounted) {
          const u = res.data.user;
          setUser(u);

          setEditData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            babyInfo: {
              age: u.userInfo?.babyInfo?.age || "",
              weight: u.userInfo?.babyInfo?.weight || "",
              allergies: Array.isArray(u.userInfo?.babyInfo?.allergies)
                ? u.userInfo?.babyInfo?.allergies
                : u.userInfo?.babyInfo?.allergies || [],
              feedingMethod: u.userInfo?.babyInfo?.feedingMethod || "",
            },
          });
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Không thể lấy thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const startEdit = () => {
    setIsEditing(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setErrorMessage("");
    setSuccessMessage("");
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        babyInfo: {
          age: user.userInfo?.babyInfo?.age || "",
          weight: user.userInfo?.babyInfo?.weight || "",
          allergies: Array.isArray(user.userInfo?.babyInfo?.allergies)
            ? user.userInfo?.babyInfo?.allergies
            : user.userInfo?.babyInfo?.allergies || [],
          feedingMethod: user.userInfo?.babyInfo?.feedingMethod || "traditional",
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["age", "weight", "feedingMethod"].includes(name)) {
      setEditData((prev) => ({
        ...prev,
        babyInfo: { ...prev.babyInfo, [name]: value },
      }));
    } else if (name === "allergies") {
      const arr = value
        .split(",")
        .map((it) => it.trim())
        .filter(Boolean);
      setEditData((prev) => ({
        ...prev,
        babyInfo: { ...prev.babyInfo, allergies: arr },
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      if (!editData.name || !editData.phone) {
        setErrorMessage("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
        setSaving(false);
        return;
      }

      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
      if (!phoneRegex.test(editData.phone)) {
        setErrorMessage("Số điện thoại không hợp lệ (phải gồm 10 chữ số).");
        setSaving(false);
        return;
      }

      await updateProfile(editData);

      setUser((prev) => ({
        ...prev,
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        userInfo: { ...prev?.userInfo, babyInfo: { ...editData.babyInfo } },
      }));

      setIsEditing(false);
      setSuccessMessage("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  const getFeedingLabel = (val) => {
    const map = {
      traditional: "Truyền thống",
      blw: "Tự chỉ huy (BLW)",
      japanese: "Kiểu Nhật",
    };
    return map[val] || "Chưa cập nhật";
  };

  if (loading) {
    return (
      <div className="tiny_profilepage__centered">
        <div className="tiny_profilepage__spinner" />
      </div>
    );
  }

  return (
    <AccountLayout user={user}>
      <div className="tiny_profilepage__root">
        <div className="tiny_profilepage__header">
          <h1 className="tiny_profilepage__header_title">THÔNG TIN TÀI KHOẢN</h1>

          {!isEditing ? (
            <button
              className="tiny_profilepage__btn_edit"
              onClick={startEdit}
              aria-label="Chỉnh sửa thông tin"
            >
              <EditIcon /> Chỉnh sửa
            </button>
          ) : (
            <div className="tiny_profilepage__edit_actions">
              <button
                className="tiny_profilepage__btn_cancel"
                onClick={cancelEdit}
                disabled={saving}
              >
                <CancelIcon /> Hủy
              </button>
              <button
                className="tiny_profilepage__btn_save"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <div className="tiny_profilepage__spinner_small" />
                ) : (
                  <>
                    <SaveIcon /> Lưu
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">
            <PersonIcon /> Họ tên:
          </div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <input
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
                placeholder="Nhập họ và tên"
              />
            ) : (
              user?.name || "Chưa cập nhật"
            )}
          </div>
        </div>

        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">
            <EmailIcon /> Email:
          </div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <input
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
                type="email"
                placeholder="Nhập email"
                disabled
                aria-disabled
              />
            ) : (
              user?.email || "Chưa cập nhật"
            )}
          </div>
        </div>

        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">
            <PhoneIcon /> Số điện thoại:
          </div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <input
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
                placeholder="Nhập số điện thoại"
              />
            ) : (
              user?.phone || "Chưa cập nhật"
            )}
          </div>
        </div>

        {/* Baby info section */}
        <h2 className="tiny_profilepage__baby_section_title">THÔNG TIN TRẺ</h2>

        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">🍼 Tuổi:</div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <input
                name="age"
                value={editData.babyInfo.age}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
                placeholder="Ví dụ: 8 tháng"
              />
            ) : (
              editData.babyInfo.age || "Chưa cập nhật"
            )}
          </div>
        </div>

        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">⚖️ Cân nặng:</div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <input
                name="weight"
                value={editData.babyInfo.weight}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
                placeholder="Ví dụ: 8kg"
              />
            ) : (
              editData.babyInfo.weight || "Chưa cập nhật"
            )}
          </div>
        </div>

        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">🚫 Dị ứng:</div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <input
                name="allergies"
                value={(editData.babyInfo.allergies || []).join(", ")}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
                placeholder="Nhập, phân cách bằng dấu ,"
              />
            ) : editData.babyInfo.allergies &&
              editData.babyInfo.allergies.length > 0 ? (
              editData.babyInfo.allergies.join(", ")
            ) : (
              "Chưa cập nhật"
            )}
          </div>
        </div>

        <div className="tiny_profilepage__info_row">
          <div className="tiny_profilepage__label">🍽️ Phương pháp ăn:</div>
          <div className="tiny_profilepage__value">
            {isEditing ? (
              <select
                name="feedingMethod"
                value={editData.babyInfo.feedingMethod}
                onChange={handleChange}
                className="tiny_profilepage__field_input"
              >
                <option value="">-- Chưa chọn phương pháp --</option>
                <option value="traditional">Truyền thống</option>
                <option value="blw">Tự chỉ huy (BLW)</option>
                <option value="japanese">Kiểu Nhật</option>
              </select>
            ) : (
              getFeedingLabel(editData.babyInfo.feedingMethod)
            )}
          </div>
        </div>
      </div>

      {/* Snackbar Notifications */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </AccountLayout>
  );
}
