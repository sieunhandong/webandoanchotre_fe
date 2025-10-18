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
            </div>
        );
    }

    if (!food) {
        return <p className="foodDetail__notFound">Không tìm thấy món ăn 😢</p>;
    }

    return (
        <div className="foodDetail__wrapper">
            <div className="foodDetail__container">
                {/* Ảnh */}
                <div className="foodDetail__imageWrapper">
                    <img src={food.images?.[0]} alt={food.name} className="foodDetail__image" />
                </div>

                {/* Thông tin */}
                <div className="foodDetail__info">
                    <h1 className="foodDetail__title">{food.name}</h1>

                    <div
                        className="foodDetail__ingredients"
                        dangerouslySetInnerHTML={{ __html: food.ingredients }}
                    ></div>

                    <div
                        className="foodDetail__recipe"
                        dangerouslySetInnerHTML={{ __html: food.recipe }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;
