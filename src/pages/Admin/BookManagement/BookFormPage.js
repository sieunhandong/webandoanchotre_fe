import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../../services/AdminService/productService";
import { getCategories } from "../../../services/AdminService/categoryService";
import "./ProductFormPage.css";

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    nutrition: "",
    category: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // 🔹 Lấy danh mục + dữ liệu sản phẩm khi sửa
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);

    if (isEdit) {
      getProductById(id)
        .then((p) => {
          setForm({
            name: p.name || "",
            description: p.description || "",
            nutrition: p.nutrition || "",
            category: p.category?._id || "",
            image: p.image || null,
          });
        })
        .catch(console.error);
    }
  }, [id, isEdit]);

  // 🔹 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setForm((f) => ({ ...f, image: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors((err) => ({ ...err, [name]: null }));
  };

  // 🔹 Validate dữ liệu
  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Vui lòng nhập tên sản phẩm";
    if (!form.category) err.category = "Vui lòng chọn danh mục";
    if (!form.description.trim()) err.description = "Vui lòng nhập mô tả";
    setErrors(err);
    return !Object.keys(err).length;
  };

  // 🔹 Gửi dữ liệu lên API
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("images", value); // backend multer dùng field `images`
        } else {
          formData.append(key, value ?? "");
        }
      });

      if (isEdit) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }

      setAlert({ open: true, message: "Lưu sản phẩm thành công!", severity: "success" });
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Lỗi khi lưu sản phẩm!", severity: "error" });
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-paper">
        <h2 className="product-form-title">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        <div className="product-form-grid">
          {/* 🔸Tên sản phẩm */}
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* 🔸Danh mục */}
          <div className="form-group">
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* 🔸Dinh dưỡng */}
          <div className="form-group form-group-full">
            <label htmlFor="nutrition">Thành phần dinh dưỡng</label>
            <textarea
              id="nutrition"
              name="nutrition"
              value={form.nutrition}
              onChange={handleChange}
              rows={2}
            />
          </div>

          {/* 🔸Độ tuổi phù hợp */}
          {/* <div className="form-group">
            <label htmlFor="suitableAge">Độ tuổi phù hợp</label>
            <input
              type="text"
              id="suitableAge"
              name="suitableAge"
              value={form.suitableAge}
              onChange={handleChange}
            />
          </div> */}

          {/* 🔸Rủi ro dị ứng */}
          {/* <div className="form-group">
            <label htmlFor="allergicRisk">Rủi ro dị ứng</label>
            <input
              type="text"
              id="allergicRisk"
              name="allergicRisk"
              value={form.allergicRisk}
              onChange={handleChange}
            />
          </div> */}

          {/* 🔸Mô tả */}
          <div className="form-group form-group-full">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          {/* 🔸Ảnh sản phẩm */}
          <div className="form-group form-group-full">
            <label>Ảnh sản phẩm</label>

            {form.image && typeof form.image === "string" && (
              <img
                src={form.image}
                alt="preview"
                className="preview-image"
              />
            )}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="file-input"
            />
            <span className="helper-text">
              Chọn ảnh mới để thay thế ảnh cũ (nếu có).
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Lưu
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>

        {alert.open && (
          <div className={`alert alert-${alert.severity}`}>
            <span>{alert.message}</span>
            <button
              className="alert-close"
              onClick={() => setAlert((a) => ({ ...a, open: false }))}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
