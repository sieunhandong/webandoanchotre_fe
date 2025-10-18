import React, { useEffect, useState } from "react";
import * as FoodService from "../../services/FoodService";
import { Link } from "react-router-dom";
import "./FoodPage.css";

const FoodPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");

    const fetchFoods = async (pageNum = 1, searchTerm = "") => {
        try {
            setLoading(true);
            const res = await FoodService.getAllFoods({ page: pageNum, limit, search: searchTerm });
            setFoods(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Lỗi khi lấy công thức:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods(page, search);
    }, [page, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="foodPage">
            {/* Banner */}
            <div className="foodPage__banner">
                <h1>🍲 Công Thức Nấu Ăn</h1>
                <p>Khám phá hàng trăm món ăn dặm bổ dưỡng và dễ làm cho bé yêu 💕</p>
            </div>

            {/* Search box */}
            <div className="foodPage__searchBox">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm món ăn hoặc nguyên liệu..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Grid hiển thị món ăn */}
            {loading ? (
                <div className="foodPage__loading">Đang tải công thức...</div>
            ) : foods.length === 0 ? (
                <p className="foodPage__empty">Không tìm thấy công thức nào 😢</p>
            ) : (
                <div className="foodPage__grid">
                    {foods.map((food, idx) => (
                        <div
                            className="foodCard"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            key={food._id}
                            onClick={() => (window.location.href = `/recipes/${food._id}`)}
                        >
                            <div className="foodCard__imageWrapper">
                                {food.images?.[0] && (
                                    <img src={food.images[0]} alt={food.name} className="foodCard__image" />
                                )}
                            </div>
                            <div className="foodCard__content">
                                <h3>{food.name}</h3>
                                <div className="foodCard__tags">
                                    <span className="tag tag--pink">Bổ dưỡng</span>
                                    <span className="tag tag--green">Dễ làm</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="foodPage__pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`pageBtn ${page === i + 1 ? "active" : ""}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Back to home */}
            <div className="foodPage__back">
                <Link to="/" className="backBtn">
                    ← Quay lại Trang chủ
                </Link>
            </div>
        </div>
    );
};

export default FoodPage;
