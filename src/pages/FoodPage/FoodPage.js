import React, { useEffect, useState, useRef } from "react";
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
    const [visibleCards, setVisibleCards] = useState(new Set());
    const observerRef = useRef(null);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    // Intersection Observer cho lazy loading animation
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("data-id");
                        setVisibleCards((prev) => new Set([...prev, id]));
                    }
                });
            },
            { threshold: 0.1, rootMargin: "50px" }
        );

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const cards = document.querySelectorAll(".foodCard");
        cards.forEach((card) => {
            if (observerRef.current) {
                observerRef.current.observe(card);
            }
        });
    }, [foods]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
        setVisibleCards(new Set());
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setVisibleCards(new Set());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="foodPage">
            {/* Floating decoration elements */}
            <div className="foodPage__decorations">
                <div className="float-shape float-shape--1"></div>
                <div className="float-shape float-shape--2"></div>
                <div className="float-shape float-shape--3"></div>
            </div>

            {/* Banner with enhanced design */}
            <div className="foodPage__banner">
                <div className="foodPage__banner-content">
                    <div className="banner-icon">🍲</div>
                    <h1>Công Thức Nấu Ăn</h1>
                    <p>Khám phá hàng trăm món ăn dặm bổ dưỡng và dễ làm cho bé yêu</p>
                    <div className="banner-stats">
                        <div className="stat-item">
                            <span className="stat-number">{total}+</span>
                            <span className="stat-label">Công thức</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">An toàn</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">⭐ 5.0</span>
                            <span className="stat-label">Đánh giá</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Search box */}
            <div className="foodPage__searchWrapper">
                <div className="foodPage__searchBox">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn hoặc nguyên liệu..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    {search && (
                        <button className="clear-btn" onClick={() => handleSearchChange({ target: { value: "" } })}>
                            ✕
                        </button>
                    )}
                </div>
                <div className="search-suggestions">
                    <span className="suggestion-label">Gợi ý:</span>
                    <button className="suggestion-tag" onClick={() => handleSearchChange({ target: { value: "cháo" } })}>Cháo</button>
                    <button className="suggestion-tag" onClick={() => handleSearchChange({ target: { value: "súp" } })}>Súp</button>
                    <button className="suggestion-tag" onClick={() => handleSearchChange({ target: { value: "rau củ" } })}>Rau củ</button>
                </div>
            </div>

            {/* Content section */}
            <div className="foodPage__content">
                {loading ? (
                    <div className="foodPage__loading">
                        <div className="loading-spinner"></div>
                        <p>Đang tải công thức...</p>
                    </div>
                ) : foods.length === 0 ? (
                    <div className="foodPage__empty">
                        <div className="empty-icon">🔍</div>
                        <h3>Không tìm thấy công thức nào</h3>
                        <p>Hãy thử tìm kiếm với từ khóa khác nhé!</p>
                    </div>
                ) : (
                    <>
                        <div className="foodPage__results-header">
                            <h2>
                                {search ? `Kết quả cho "${search}"` : "Tất cả công thức"}
                                <span className="results-count">({total} món)</span>
                            </h2>
                        </div>

                        <div className="foodPage__grid">
                            {foods.map((food, idx) => (
                                <div
                                    className={`foodCard ${visibleCards.has(food._id) ? "foodCard--visible" : ""}`}
                                    data-id={food._id}
                                    key={food._id}
                                    onClick={() => (window.location.href = `/recipes/${food._id}`)}
                                >
                                    <div className="foodCard__imageWrapper">
                                        {food.images?.[0] ? (
                                            <img src={food.images[0]} alt={food.name} className="foodCard__image" />
                                        ) : (
                                            <div className="foodCard__placeholder">
                                                <span>🍽️</span>
                                            </div>
                                        )}
                                        <div className="foodCard__badge">
                                            <span>✨ Mới</span>
                                        </div>
                                    </div>
                                    <div className="foodCard__content">
                                        <h3>{food.name}</h3>
                                        <div className="foodCard__meta">
                                            <span className="meta-item">
                                                <svg viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                30 phút
                                            </span>
                                            <span className="meta-item">
                                                <svg viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                                Dễ
                                            </span>
                                        </div>
                                        <div className="foodCard__tags">
                                            <span className="tag tag--nutrition">🥗 Bổ dưỡng</span>
                                            <span className="tag tag--easy">👶 Phù hợp bé</span>
                                        </div>
                                        <button className="foodCard__viewBtn">
                                            Xem công thức
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                    <div className="foodPage__pagination">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="pageBtn pageBtn--nav"
                        >
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Trước
                        </button>

                        <div className="pagination-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((num) => {
                                    if (totalPages <= 7) return true;
                                    if (num === 1 || num === totalPages) return true;
                                    if (num >= page - 1 && num <= page + 1) return true;
                                    return false;
                                })
                                .map((num, idx, arr) => (
                                    <React.Fragment key={num}>
                                        {idx > 0 && arr[idx - 1] !== num - 1 && (
                                            <span className="pagination-dots">...</span>
                                        )}
                                        <button
                                            onClick={() => handlePageChange(num)}
                                            className={`pageBtn ${page === num ? "active" : ""}`}
                                        >
                                            {num}
                                        </button>
                                    </React.Fragment>
                                ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="pageBtn pageBtn--nav"
                        >
                            Sau
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Back button */}
            <div className="foodPage__back">
                <Link to="/" className="backBtn">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Quay lại Trang chủ
                </Link>
            </div>
        </div>
    );
};

export default FoodPage;