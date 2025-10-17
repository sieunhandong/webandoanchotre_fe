// HomePage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Chip,
  IconButton,
  Rating,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import * as BlogService from "../../services/AdminService/blogService";
import * as MealSetService from "../../services/MealSetService";
import * as FoodService from "../../services/FoodService";
import "./HomePage.css";

const HomePage = () => {
  const [homeBlogs, setHomeBlogs] = useState([]);
  const [mealSets, setMealSets] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingMealSets, setLoadingMealSets] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  const sectionRefs = {
    blogs: useRef(null),
    mealSets: useRef(null),
    recipes: useRef(null),
    reviews: useRef(null),
    partners: useRef(null),
  };

  // Banner slides data
  const bannerSlides = [
    {
      title: "Khám phá thế giới ăn dặm",
      subtitle: "Dinh dưỡng khoa học cho bé yêu phát triển toàn diện",
      image: "/banner1.jpg",
      gradient: "linear-gradient(135deg, rgba(114, 205, 241, 0.95) 0%, rgba(114, 205, 241, 0.7) 100%)",
    },
    {
      title: "Công thức nấu ăn đa dạng",
      subtitle: "Hàng trăm món ăn dặm bổ dưỡng, dễ làm",
      image: "/banner2.jpg",
      gradient: "linear-gradient(135deg, rgba(255, 183, 197, 0.95) 0%, rgba(255, 183, 197, 0.7) 100%)",
    },
    {
      title: "Tư vấn từ chuyên gia",
      subtitle: "Đội ngũ dinh dưỡng viên giàu kinh nghiệm",
      image: "/banner3.jpg",
      gradient: "linear-gradient(135deg, rgba(180, 231, 206, 0.95) 0%, rgba(180, 231, 206, 0.7) 100%)",
    },
  ];

  // Reviews data
  const reviews = [
    {
      name: "Đào Hoàng Mai",
      avatar: "/feedback1.jpg",
      rating: 5,
      comment: "Các công thức ăn dặm rất chi tiết và dễ làm. Bé nhà mình rất thích ăn!",
      date: "2 tuần trước",
    },
    {
      name: "Nguyễn Việt Anh",
      avatar: "/feedback2.jpg",
      rating: 5,
      comment: "Set ăn dặm rất đa dạng, giúp mình tiết kiệm thời gian suy nghĩ món ăn cho bé.",
      date: "1 tháng trước",
    },
    {
      name: "Nguyễn Văn Đông",
      avatar: "/feedback3.jpg",
      rating: 5,
      comment: "Blog có nhiều bài viết bổ ích về dinh dưỡng, giúp vợ chồng mình học hỏi nhiều.",
      date: "3 tuần trước",
    },
    {
      name: "Thanh Đoan",
      avatar: "/feedback4.jpg",
      rating: 5,
      comment: "Dịch vụ tư vấn nhiệt tình, chuyên nghiệp. Rất hài lòng!",
      date: "1 tuần trước",
    },
  ];

  // Partners data - ĐÃ CẬP NHẬT: Dùng ảnh từ local
  const partners = [
    { name: "Vinamilk", logo: "/partner1.jpg" },
    { name: "Nutricare", logo: "/partner2.jpg" },
    { name: "Nestlé", logo: "/partner3.jpg" },
    { name: "Organic", logo: "/partner4.jpg" },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const homeData = await BlogService.getHomeBlogs();
        setHomeBlogs(homeData.blogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    const fetchMealSets = async () => {
      try {
        setLoadingMealSets(true);
        const mealData = await MealSetService.getAllMealSets();
        setMealSets(mealData.data.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMealSets(false);
      }
    };

    const fetchRecipes = async () => {
      try {
        setLoadingRecipes(true);
        const res = await FoodService.getFoodHome();
        setRecipes(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
    fetchBlogs();
    fetchMealSets();
  }, []);

  // Auto slide banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    const observers = {};

    Object.keys(sectionRefs).forEach((key) => {
      if (sectionRefs[key].current) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.1 }
        );
        observers[key].observe(sectionRefs[key].current);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <Box className="homepage-container">
      {/* BANNER SLIDER */}
      <Box className="banner-slider">
        {bannerSlides.map((slide, index) => (
          <Box
            key={index}
            className={`banner-slide ${currentSlide === index ? 'active' : ''}`}
            sx={{
              background: `${slide.gradient}, url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
            }}
          >
            <Container maxWidth="lg">
              <Box className={`banner-content ${currentSlide === index ? 'animate' : ''}`}>
                <Typography variant="h2" className="banner-title">
                  {slide.title}
                </Typography>
                <Typography variant="h5" className="banner-subtitle">
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/quiz"
                  className="banner-button"
                >
                  Bắt đầu ngay 🚀
                </Button>
              </Box>
            </Container>
          </Box>
        ))}

        {/* Navigation Arrows */}
        <IconButton onClick={prevSlide} className="banner-arrow banner-arrow-left">
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton onClick={nextSlide} className="banner-arrow banner-arrow-right">
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Dots Indicator */}
        <Box className="banner-dots">
          {bannerSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`banner-dot ${currentSlide === index ? 'active' : ''}`}
            />
          ))}
        </Box>
      </Box>

      {/* Decorative Wave */}
      <Box className="decorative-wave" />

      {/* Section 1: Chuyện nhà TinnyYummy */}
      <Container
        className="section-about"
        maxWidth="xl"
      >
        <Grid container spacing={6} alignItems="center" justifyContent="center" sx={{ display: 'flex', flexWrap: 'wrap' }}>

          {/* Ảnh */}
          <Grid item xs={12} sm={6} md={6} className="about-image" sx={{ maxWidth: '600px', width: '100%' }}>
            <CardMedia
              component="img"
              image="/home_banner1.png"
              alt="Chuyện nhà TinyYummy"
              className="about-image-img"
              sx={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}
            />
          </Grid>

          {/* Thông tin */}
          <Grid item xs={12} sm={6} md={6} className="about-content" sx={{ maxWidth: '500px', width: '100%' }}>
            <Typography variant="h3" className="about-title">
              Chuyện nhà TinyYummy
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              TinyYummy là thương hiệu Việt tiên phong trong lĩnh vực
              đồ ăn dặm cho trẻ em, cam kết mang đến những sản phẩm dinh
              dưỡng an toàn, tiện lợi và chất lượng cao, đồng hành cùng ba
              mẹ trong hành trình chăm sóc và phát triển toàn diện cho bé yêu.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              Với đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm, chúng tôi nghiên cứu
              và phát triển các công thức ăn dặm khoa học, phù hợp với từng giai đoạn
              phát triển của trẻ.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/about-us"
              className="btn-about"
            >
              Tìm hiểu thêm về chúng tôi ✨
            </Button>
          </Grid>

        </Grid>
      </Container>

      {/* BLOG SECTION */}
      <Container
        ref={sectionRefs.blogs}
        maxWidth="xl"
        className={`section ${visibleSections.blogs ? 'visible' : ''}`}
        sx={{ my: 10 }}
      >
        <Box className="section-header">
          <Box className="section-icon-chip">
            <Typography sx={{ fontSize: "2rem" }}>📚</Typography>
            <Chip label="BLOG MỚI NHẤT" className="chip-primary" />
          </Box>
          <Typography variant="h3" className="section-title">
            Bài viết nổi bật
          </Typography>
          <Typography variant="body1" color="text.secondary" className="section-subtitle">
            Cập nhật kiến thức dinh dưỡng mới nhất cho bé yêu từ các chuyên gia hàng đầu
          </Typography>
        </Box>

        {loadingBlogs ? (
          <Box textAlign="center">
            <CircularProgress sx={{ color: "#72CDF1" }} />
          </Box>
        ) : (
          <>
            <Box className="blog-grid">
              {homeBlogs.map((blog, idx) => (
                <Card
                  key={blog._id}
                  className="blog-card"
                  sx={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => (window.location.href = `/blog/${blog._id}`)}
                >
                  {blog.images?.[0] && (
                    <Box className="blog-image-wrapper">
                      <CardMedia
                        component="img"
                        height="220"
                        image={blog.images[0]}
                        alt={blog.title}
                        className="blog-image"
                      />
                      <Box className="blog-overlay" />
                      <Chip label="Mới" className="blog-badge" />
                    </Box>
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" className="blog-title">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="blog-excerpt">
                      {blog.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box textAlign="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/blog"
                className="btn-primary"
              >
                Xem thêm bài viết →
              </Button>
            </Box>
          </>
        )}
      </Container>


      {/* MEAL SETS SECTION */}
      <Box
        ref={sectionRefs.mealSets}
        className={`section section-mealsets ${visibleSections.mealSets ? 'visible' : ''}`}
      >
        <Container maxWidth="xl">
          <Box className="section-header">
            <Box className="section-icon-chip">
              <Typography sx={{ fontSize: "2rem" }}>🍱</Typography>
              <Chip label="GÓI ĂN DẶM" className="chip-pink" />
            </Box>
            <Typography variant="h3" className="section-title">
              SET ĂN DẶM ĐA DẠNG
            </Typography>
            <Typography variant="body1" color="text.secondary" className="section-subtitle">
              Lựa chọn gói phù hợp nhất cho hành trình ăn dặm của bé yêu
            </Typography>
          </Box>

          {loadingMealSets ? (
            <Box textAlign="center">
              <CircularProgress sx={{ color: "#72CDF1" }} />
            </Box>
          ) : (
            <Box className="mealsets-grid">
              {mealSets.map((set, idx) => (
                <Card
                  key={set._id}
                  className={`mealset-card ${idx === 1 ? 'popular' : ''}`}
                  sx={{ animationDelay: `${idx * 0.15}s` }}
                >
                  {idx === 1 && (
                    <Box className="popular-badge" sx={{ marginTop: '1rem' }}>
                      {/* <Typography sx={{ fontSize: "1.5rem" }}>⭐</Typography> */}
                      <Chip label="PHỔ BIẾN NHẤT" className="chip-popular" />
                    </Box>
                  )}

                  <Typography variant="h5" className="mealset-title">
                    {set.title}
                  </Typography>

                  <Box className="mealset-price">
                    <Typography variant="h3" className="price">
                      {(set.price).toLocaleString('vi-VN')}
                    </Typography>
                    <Typography variant="body2" className="currency">
                      VND
                    </Typography>
                  </Box>

                  <Box className="mealset-features">
                    <Typography variant="body2" className="feature">
                      <Box component="span" className="checkmark">✓</Box>
                      Thời gian: {set.duration} ngày
                    </Typography>
                    <Typography variant="body2" className="feature">
                      <Box component="span" className="checkmark">✓</Box>
                      <span>{set.description}</span>
                    </Typography>
                    <Typography variant="body2" className="feature">
                      <Box component="span" className="checkmark">✓</Box>
                      <span>Dinh dưỡng</span>
                    </Typography>
                    <Typography variant="body2" className="feature">
                      <Box component="span" className="checkmark">✓</Box>
                      <span>Tiện lợi</span>
                    </Typography>
                    {set.extraInfo?.map((info, i) => (
                      <Typography key={i} variant="body2" className="feature">
                        <Box component="span" className="checkmark">✓</Box>
                        <span>{info}</span>
                      </Typography>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/mealset/${set._id}`}
                    className={`btn-mealset ${idx === 1 ? 'primary' : 'outline'}`}
                  >
                    Mua ngay 🛒
                  </Button>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* RECIPES SECTION */}
      <Container
        ref={sectionRefs.recipes}
        maxWidth="xl"
        className={`section ${visibleSections.recipes ? 'visible' : ''}`}
        sx={{ my: 10 }}
      >
        <Box className="section-header">
          <Box className="section-icon-chip">
            <Typography sx={{ fontSize: "2rem" }}>👨‍🍳</Typography>
            <Chip label="CÔNG THỨC NẤU ĂN" className="chip-green" />
          </Box>
          <Typography variant="h3" className="section-title">
            Khám phá công thức
          </Typography>
          <Typography variant="body1" color="text.secondary" className="section-subtitle">
            Các công thức nấu ăn bổ dưỡng, dễ làm cho bé yêu của bạn
          </Typography>
        </Box>

        {loadingRecipes ? (
          <Box textAlign="center">
            <CircularProgress sx={{ color: "#72CDF1" }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={4} sx={{ mb: 5, justifyContent: "center" }}>
              {recipes.map((recipe, idx) => (
                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                  <Card className="recipe-card" sx={{ animationDelay: `${idx * 0.1}s` }}>
                    <Box className="recipe-image-wrapper">
                      {recipe.images?.[0] && (
                        <CardMedia
                          component="img"
                          image={recipe.images[0]}
                          alt={recipe.name}
                          className="recipe-image"
                        />
                      )}
                      <Box className="recipe-gradient" />
                      <Box className="recipe-icon bounce">
                        <Typography sx={{ fontSize: "1.8rem" }}>🍽️</Typography>
                      </Box>
                    </Box>

                    <CardContent className="recipe-content">
                      <Typography variant="h6" className="recipe-title">
                        {recipe.name}
                      </Typography>
                      <Box className="recipe-tags">
                        <Chip label="Bổ dưỡng" size="small" className="tag-nutrition" />
                        <Chip label="Dễ làm" size="small" className="tag-easy" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box textAlign="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/recipes"
                className="btn-green"
              >
                Xem thêm công thức →
              </Button>
            </Box>
          </>
        )}
      </Container>

      {/* FEATURED IMAGE SECTION - ĐÃ THÊM MỚI */}
      <Box className="section-featured">
        <Container maxWidth="xl">
          <Box className="featured-content">
            <Box className="featured-image-wrapper">
              <img src="/homepage.jpeg" alt="Featured Banner" className="featured-image" />
              <Box className="featured-overlay-cut">
                <Box className="cut-piece cut-1"></Box>
                <Box className="cut-piece cut-2"></Box>
                <Box className="cut-piece cut-3"></Box>
                <Box className="cut-piece cut-4"></Box>
                <Box className="cut-piece cut-5"></Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* REVIEWS SECTION */}
      <Box
        ref={sectionRefs.reviews}
        className={`section section-reviews ${visibleSections.reviews ? 'visible' : ''}`}
      >
        <Container maxWidth="xl">
          <Box className="section-header">
            <Box className="section-icon-chip">
              <Typography sx={{ fontSize: "2rem" }}>💬</Typography>
              <Chip label="ĐÁNH GIÁ KHÁCH HÀNG" className="chip-gold" />
            </Box>
            <Typography variant="h3" className="section-title">
              Khách hàng nói gì về chúng tôi
            </Typography>
            <Typography variant="body1" color="text.secondary" className="section-subtitle">
              Hàng ngàn phụ huynh tin tưởng và lựa chọn
            </Typography>
          </Box>

          <Box className="reviews-scroll">
            {reviews.map((review, idx) => (
              <Card key={idx} className="review-card" sx={{ animationDelay: `${idx * 0.1}s` }}>
                <FormatQuoteIcon className="quote-icon" />

                <Box className="review-header">
                  <Avatar
                    className="review-avatar"
                    src={review.avatar}
                    alt={review.name}
                  >
                    {!review.avatar && review.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="review-name">
                      {review.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                </Box>

                <Rating value={review.rating} readOnly className="review-rating" />

                <Typography variant="body1" className="review-comment">
                  "{review.comment}"
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* PARTNERS SECTION */}
      <Box
        ref={sectionRefs.partners}
        className={`section section-partners ${visibleSections.partners ? 'visible' : ''}`}
      >
        <Container maxWidth="xl">
          <Box className="section-header">
            <Box className="section-icon-chip">
              <Typography sx={{ fontSize: "2rem" }}>🤝</Typography>
              <Chip label="ĐỐI TÁC" className="chip-gray" />
            </Box>
            <Typography variant="h3" className="section-title">
              Đối tác tin cậy
            </Typography>
            <Typography variant="body1" color="text.secondary" className="section-subtitle">
              Hợp tác cùng các thương hiệu hàng đầu
            </Typography>
          </Box>

          <Box className="partners-grid">
            {partners.map((partner, idx) => (
              <Box key={idx} className="partner-card">
                <img src={partner.logo} alt={partner.name} className="partner-image" />
                <Typography variant="body2" className="partner-name">
                  {partner.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CALL TO ACTION */}
      <Box className="section-cta">
        <Container maxWidth="md" className="cta-container">
          <Typography variant="h3" className="cta-title">
            Bắt đầu hành trình ăn dặm ngay hôm nay! 🌟
          </Typography>
          <Typography variant="h6" className="cta-subtitle">
            Nhận tư vấn miễn phí từ chuyên gia dinh dưỡng
          </Typography>
          <Box className="cta-buttons">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/quiz"
              className="btn-cta-primary"
            >
              Làm Quiz ngay 🎯
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contact"
              className="btn-cta-outline"
            >
              Liên hệ tư vấn 📞
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box className="footer">
        <Typography variant="h6" className="footer-title">
          © 2025 Baby Food Blog. All rights reserved.
        </Typography>
        <Typography variant="body2" className="footer-subtitle">
          Dinh dưỡng tốt nhất cho bé yêu của bạn ❤️
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;