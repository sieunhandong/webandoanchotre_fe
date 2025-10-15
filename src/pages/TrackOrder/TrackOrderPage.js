import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getMyOrders, createPayment, cancelOrder } from "../../services/OrderService";
import "./TrackOrderPage.css";

const TrackOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyOrders();
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(list);
      } catch (error) {
        console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  console.log(orders);
  const calcTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="track-container">
      <h1 className="track-title">Đơn hàng của tôi</h1>
      <p className="track-subtitle">
        Theo dõi tiến trình gói ăn và trạng thái thanh toán của bạn
      </p>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có đơn hàng nào.</p>
          <button onClick={() => navigate("/")} className="btn primary">
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, idx) => {
            const item = order.items?.[0];
            const setName = item?.setId?.title || "Gói ăn";
            const duration = item?.duration || 0;
            const total = calcTotal(order.items);
            const deliveryDate = order.delivery?.time
              ? dayjs(order.delivery.time)
              : null;

            let dayProgress = 0;
            if (deliveryDate) {
              const diff = dayjs().diff(deliveryDate, "day");
              dayProgress = diff >= duration ? duration : diff + 1;
              if (dayProgress < 1) dayProgress = 0;
            }

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h2>#{idx + 1} – {setName}</h2>
                  <span
                    className={`status ${order.status}`}
                  >
                    {order.status === "completed"
                      ? "Hoàn tất"
                      : order.status === "pending"
                        ? "Đang xử lý"
                        : "Đã hủy"}
                  </span>
                </div>

                {deliveryDate && (
                  <p className="order-date">
                    📅 Ngày bắt đầu giao: <strong>{deliveryDate.format("DD/MM/YYYY")}</strong>
                  </p>
                )}

                {duration > 0 && (
                  <div className="progress-section">
                    <p>
                      ⏳ Tiến trình gói ăn: <strong>{dayProgress}/{duration} ngày</strong>
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min((dayProgress / duration) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {order.progress?.todayMenu && (
                  <div className="meal-suggestion">
                    <p className="meal-title">
                      🍽️ Thực đơn ngày {order.progress.currentDay}:
                    </p>
                    <p className="meal-content">{order.progress.todayMenu}</p>
                  </div>
                )}


                <div className="order-footer">
                  <p>
                    💰 Tổng: <span className="price">{total.toLocaleString()}₫</span>
                  </p>

                  <div className="actions">
                    <button
                      onClick={() => navigate(`/track-order/${order._id}`)}
                      className="btn outline"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
