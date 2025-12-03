// src/utils/GAListener.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// Chỉ initialize 1 lần duy nhất
ReactGA.initialize("G-S0K68FSDCJ");

// Tùy chọn: bật debug để kiểm tra lúc dev (xóa đi khi production)
// ReactGA.set({ debug: true });

function GAListener({ children }) {
    const location = useLocation();

    useEffect(() => {
        const page = location.pathname + location.search;

        // Cách chuẩn nhất với react-ga4 v2+
        ReactGA.send({ hitType: "pageview", page });
        // Hoặc viết ngắn gọn hơn (từ v2.0 trở lên hỗ trợ):
        // ReactGA.pageview(page);

        // Nếu bạn muốn thêm title (rất hữu ích cho báo cáo)
        ReactGA.send({
            hitType: "pageview",
            page,
            title: document.title || page,
        });
    }, [location]);

    return children || null;
}

export default GAListener;