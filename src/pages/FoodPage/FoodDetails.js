import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as FoodService from "../../services/FoodService";
import "./FoodDetails.css";

const FoodDetails = () => {
    const { id } = useParams();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const res = await FoodService.getFoodById(id);
                setFood(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy món ăn:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFood();
    }, [id]);

    if (loading) {
        return (
            <div className="foodDetail__loading">
                <div className="spinner"></div>
                <p>Đang tải thông tin món ăn...</p>
            </div>
        );
    }

    if (!food) {
        return (
            <div className="foodDetail__wrapper">
                <div className="foodDetail__notFound">
                    <div className="foodDetail__notFoundIcon">😢</div>
                    <h2>Không tìm thấy món ăn</h2>
                    <p>Món ăn bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
                    <Link to="/recipes" className="foodDetail__backButton">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="foodDetail__wrapper">
            <div className="foodDetail__container">
                {/* Hàng trên: Ảnh + Nguyên liệu */}
                <div className="foodDetail__topRow">
                    {/* Ảnh */}
                    <div className="foodDetail__imageWrapper">
                        {food.images?.[0] ? (
                            <img src={food.images[0]} alt={food.name} className="foodDetail__image" />
                        ) : (
                            <div className="foodDetail__imagePlaceholder">
                                <span>🍽️</span>
                            </div>
                        )}
                    </div>

                    {/* Thông tin + Nguyên liệu */}
                    <div className="foodDetail__info">
                        <h1 className="foodDetail__title">{food.name}</h1>

                        {/* Meta badges */}
                        <div className="foodDetail__meta">
                            <div className="foodDetail__metaBadge foodDetail__metaBadge--time">
                                ⏱️ 30 phút
                            </div>
                            <div className="foodDetail__metaBadge foodDetail__metaBadge--difficulty">
                                ⭐ Dễ làm
                            </div>
                            <div className="foodDetail__metaBadge foodDetail__metaBadge--servings">
                                👶 1-2 người
                            </div>
                        </div>

                        {/* Nguyên liệu */}
                        <div className="foodDetail__section foodDetail__ingredients">
                            <h2 className="foodDetail__sectionTitle">🥘 Nguyên liệu</h2>
                            <div dangerouslySetInnerHTML={{ __html: food.ingredients }}></div>
                        </div>
                    </div>
                </div>

                {/* Hàng dưới: Công thức */}
                <div className="foodDetail__section foodDetail__recipe">
                    <h2 className="foodDetail__sectionTitle">👨‍🍳 Cách làm</h2>
                    <div dangerouslySetInnerHTML={{ __html: food.recipe }}></div>
                </div>

                {/* Nút quay lại */}
                <Link to="/recipes" className="foodDetail__backButton">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Quay lại danh sách
                </Link>
            </div>
        </div>
    );
};

export default FoodDetails;