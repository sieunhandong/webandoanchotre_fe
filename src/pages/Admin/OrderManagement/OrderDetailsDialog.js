import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  TextField,
  IconButton,
  Tooltip,
  DialogContentText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  updateMealMenu,
  aiSuggestMenu,
} from "../../../services/AdminService/orderService";

const formatCurrency = (v) =>
  v ? `${v.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";

export default function OrderDetailsDialog({ open, order, onClose, refresh }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedMenu, setEditedMenu] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMenu, setAiMenu] = useState([]); // dữ liệu thực đơn từ AI
  const [showAIPopup, setShowAIPopup] = useState(false); // popup xác nhận AI

  if (!open || !order) return null;

  const delivery = order.delivery || {};
  const address = delivery.address || {};
  const baby = order.userId?.userInfo?.babyInfo || {};
  const items = order.items || [];
  const menus = order.mealSuggestions || [];

  // 🚀 Gọi AI để gợi ý thực đơn mới
  const handleAISuggest = async () => {
    try {
      setLoadingAI(true);
      const res = await aiSuggestMenu(order._id);
      if (res.success && res.data) {
        setAiMenu(res.data); // backend đã trả đúng { day, menu: [] }
        setShowAIPopup(true);
      } else {
        alert("❌ AI không trả về dữ liệu hợp lệ");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi gợi ý thực đơn bằng AI");
    } finally {
      setLoadingAI(false);
    }
  };
  // 💾 Admin xác nhận dùng thực đơn AI
  const handleConfirmAI = async () => {
    try {
      await updateMealMenu(order._id, aiMenu);
      alert("✅ Đã cập nhật thực đơn AI vào đơn hàng!");
      setShowAIPopup(false);
      refresh();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật thực đơn AI");
    }
  };

  // 📝 Lưu khi admin sửa menu thủ công
  const handleSaveMenu = async (menuId) => {
    try {
      const updatedMenus = [...menus];
      updatedMenus[editingIndex].menu = editedMenu;
      await updateMealMenu(order._id, updatedMenus);
      alert("✅ Đã cập nhật thực đơn thành công");
      setEditingIndex(null);
      refresh();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật thực đơn");
    }
  };

  return (
    <>
      {/* --- POPUP CHÍNH: Chi tiết đơn hàng --- */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h6">
            Chi tiết đơn hàng{" "}
            <Typography component="span" color="primary" fontWeight="600">
              #{order._id}
            </Typography>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Thông tin khách hàng */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={1}>
                  👤 Thông tin khách hàng
                </Typography>
                <Typography>Tên: {order.userId?.name || "N/A"}</Typography>
                <Typography>Email: {order.userId?.email || "N/A"}</Typography>
                <Typography>Điện thoại: {order.userId?.phone || "N/A"}</Typography>
                <Typography>
                  Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </Typography>
              </Paper>
            </Grid>

            {/* Địa chỉ giao hàng */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={1}>
                  🚚 Địa chỉ giao hàng
                </Typography>
                <Typography>
                  {address.address}, {address.wardName}, {address.districtName},{" "}
                  {address.provinceName}
                </Typography>
                <Typography>Ngày giao dự kiến: {delivery.time}</Typography>
              </Paper>
            </Grid>

            {/* Thông tin bé */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={1}>
                  👶 Thông tin bé
                </Typography>
                <Typography>Tuổi: {baby.age || "Chưa cập nhật"} tháng</Typography>
                <Typography>Cân nặng: {baby.weight || "Chưa cập nhật"} kg</Typography>
                <Typography>
                  Phương pháp ăn dặm:{" "}
                  {baby.feedingMethod === "traditional"
                    ? "Truyền thống"
                    : baby.feedingMethod === "blw"
                      ? "BLW"
                      : "Kết hợp"}
                </Typography>
                <Typography>
                  Dị ứng:{" "}
                  {baby.allergies?.length
                    ? baby.allergies.join(", ")
                    : "Không có"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Danh sách sản phẩm */}
          <Box mt={3}>
            <Paper>
              <Box p={2} bgcolor="grey.50">
                <Typography fontWeight="600">
                  Sản phẩm ({items.length})
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên set</TableCell>
                      <TableCell align="center">Số ngày</TableCell>
                      <TableCell align="right">Giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.setId?.title || "N/A"}</TableCell>
                        <TableCell align="center">
                          {item.duration || "-"}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider />
              <Box p={2} display="flex" justifyContent="space-between">
                <Typography fontWeight="bold">Tổng tiền:</Typography>
                <Typography color="primary" fontWeight="bold">
                  {formatCurrency(order.total)}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Thực đơn gợi ý */}
          <Box mt={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight="600">🍱 Thực đơn gợi ý</Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleAISuggest}
                disabled={loadingAI}
              >
                {loadingAI ? "Đang gợi ý..." : "Gợi ý lại bằng AI"}
              </Button>
            </Box>

            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Ngày</TableCell>
                      <TableCell>Thực đơn</TableCell>
                      <TableCell align="center">Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {menus.map((m, idx) => (
                      <TableRow key={m._id || idx}>
                        <TableCell align="center">Ngày {m.day}</TableCell>
                        <TableCell>
                          {editingIndex === idx ? (
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              value={editedMenu}
                              onChange={(e) => setEditedMenu(e.target.value)}
                            />
                          ) : (
                            Array.isArray(m.menu)
                              ? m.menu.join(" | ")
                              : typeof m.menu === "string"
                                ? m.menu
                                : "Không có dữ liệu"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editingIndex === idx ? (
                            <IconButton
                              color="success"
                              onClick={() => handleSaveMenu(m._id)}
                            >
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <Tooltip title="Sửa thực đơn">
                              <IconButton
                                onClick={() => {
                                  setEditingIndex(idx);
                                  setEditedMenu(
                                    Array.isArray(m.menu)
                                      ? m.menu.join(" | ")
                                      : m.menu
                                  );
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- POPUP XÁC NHẬN THỰC ĐƠN AI --- */}
      <Dialog open={showAIPopup} onClose={() => setShowAIPopup(false)} fullWidth maxWidth="sm">
        <DialogTitle>🤖 Thực đơn AI đề xuất</DialogTitle>
        <DialogContent dividers>
          {aiMenu && aiMenu.length > 0 ? (
            <Box>
              {aiMenu.length > 0 ? (
                aiMenu.map((m, idx) => {
                  // Nếu m bị trả về là object JSON string thì parse
                  let dayData = typeof m === "string" ? JSON.parse(m) : m;
                  const menus = Array.isArray(dayData.menu)
                    ? dayData.menu
                    : [dayData.menu].filter(Boolean);

                  return (
                    <Box key={idx} mb={2}>
                      <Typography fontWeight="bold">
                        Ngày {dayData.day || idx + 1}
                      </Typography>

                      {menus.map((meal, i) => {
                        let text =
                          typeof meal === "string"
                            ? meal
                            : typeof meal === "object"
                              ? JSON.stringify(meal)
                              : String(meal);

                        return (
                          <Typography key={i} sx={{ ml: 2, color: "text.secondary" }}>
                            • {text}
                          </Typography>
                        );
                      })}

                      <Divider sx={{ my: 1 }} />
                    </Box>
                  );
                })
              ) : (
                <DialogContentText>Không có dữ liệu thực đơn từ AI.</DialogContentText>
              )}
            </Box>
          ) : (
            <DialogContentText>
              Không có dữ liệu thực đơn từ AI.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAIPopup(false)}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmAI}>
            Dùng thực đơn này
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
