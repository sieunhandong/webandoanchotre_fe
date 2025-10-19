import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { getOrderDetails } from "../../services/OrderService";
import { Snackbar, Alert } from "@mui/material";
import "./OrderDetailPage.css";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrderDetails(orderId);
        const data = res.data?.data ?? res.data;
        setOrderData(data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [orderId]);

  if (loadingData) {
    return (
      <div className="trackorderdetails-loadingcontainer">
        <div className="trackorderdetails-loadingspinner"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="trackorderdetails-errorcontainer">
        <p>Không tìm thấy thông tin đơn hàng</p>
      </div>
    );
  }

  const calcSubtotal = () => orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = calcSubtotal();
  const shippingFee = orderData.delivery?.fee || 0;
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="trackorderdetails-maincontainer">
      {/* Header */}
      <div className="trackorderdetails-headercontainer">
        <h2>Chi tiết đơn hàng</h2>
        <h3 className="trackorderdetails-orderdate">
          Ngày đặt: {dayjs(orderData.createdAt).format("DD/MM/YYYY HH:mm")}
        </h3>
        <h3 className="trackorderdetails-ordercode">
          Mã đơn hàng: {orderData.orderCode}
        </h3>
      </div>

      {/* Order Info */}
      <div className="trackorderdetails-orderinfo-card">
        <h3 className="trackorderdetails-cardtitle">Thông tin đơn hàng</h3>
        <div className="trackorderdetails-infogrid">
          <div className="trackorderdetails-infoitem">
            <span className="trackorderdetails-infolabel">Trạng thái đơn hàng:</span>
            <span className="trackorderdetails-infovalue">
              {orderData.status === "pending"
                ? "Chưa hoàn thành"
                : orderData.status === "completed"
                  ? "Hoàn thành"
                  : orderData.status}
            </span>
          </div>
        </div>
      </div>


      {/* Shipping Info */}
      <div className="trackorderdetails-shipping-card">
        <h3 className="trackorderdetails-cardtitle">Thông tin giao hàng</h3>
        <div className="trackorderdetails-shippingdetails">
          <div className="trackorderdetails-recipientinfo">
            <div className="trackorderdetails-inforow">
              <span className="trackorderdetails-infolabel">Địa chỉ:</span>
              <span className="trackorderdetails-infovalue">
                {orderData.delivery?.address?.address}, {orderData.delivery?.address?.wardName}, {orderData.delivery?.address?.districtName}, {orderData.delivery?.address?.provinceName}
              </span>
            </div>
            <div className="trackorderdetails-inforow">
              <span className="trackorderdetails-infolabel">Ngày giao:</span>
              <span className="trackorderdetails-infovalue">{dayjs(orderData.delivery?.time).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="trackorderdetails-items-card">
        <h3 className="trackorderdetails-cardtitle">Sản phẩm trong đơn</h3>
        <div className="trackorderdetails-itemslist">
          {orderData.items.map((item) => (
            <div key={item._id} className="trackorderdetails-orderitem">
              <div className="trackorderdetails-iteminfo">
                <span className="trackorderdetails-itemtitle">{item.setId?.title || "Sản phẩm đã xóa"}</span>
                <span className="trackorderdetails-itemprice">{item.price.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="trackorderdetails-itemquantity">x{item.quantity}</div>
              <div className="trackorderdetails-itemtotal">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</div>
            </div>
          ))}
        </div>

        <div className="trackorderdetails-summarycard">
          <div className="trackorderdetails-summaryrow">
            <span className="trackorderdetails-summarylabel">Tạm tính:</span>
            <span className="trackorderdetails-summaryvalue">{subtotal.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="trackorderdetails-summaryrow trackorderdetails-totalrow">
            <span className="trackorderdetails-summarylabel">Tổng cộng:</span>
            <span className="trackorderdetails-summaryvalue">{totalAmount.toLocaleString("vi-VN")} ₫</span>
          </div>
        </div>
      </div>

      {/* Meal Suggestions */}
      <div className="trackorderdetails-meals-card">
        <h3 className="trackorderdetails-cardtitle">Bữa ăn</h3>
        <div className="trackorderdetails-mealslist">
          {orderData.mealSuggestions?.map((meal) => (
            <div key={meal._id} className={`trackorderdetails-mealitem ${meal.isDone ? "trackorderdetails-mealdone" : "trackorderdetails-mealpending"}`}>
              <span className="trackorderdetails-mealday">Ngày {meal.day}:</span>
              <ul className="trackorderdetails-mealmenu">
                {meal.menu.map((menuItem, idx) => (
                  <li key={idx}>{menuItem}</li>
                ))}
              </ul>
              {meal.isDone ? <span className="trackorderdetails-mealstatus">Đã giao</span> : <span className="trackorderdetails-mealstatus">Chưa giao</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Snackbar */}
      {notifications.map((note) => (
        <Snackbar key={note.id} open autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setNotifications(prev => prev.filter(n => n.id !== note.id))}>
          <Alert severity={note.severity || "info"} onClose={() => setNotifications(prev => prev.filter(n => n.id !== note.id))}>
            {note.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
}
