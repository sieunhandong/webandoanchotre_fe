import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Chip,
  Rating,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
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
    featured: useRef(null),
  };

  // Banner slides data
  const bannerSlides = [
    {
      title: "",
      subtitle: "",
      image: "/banner5.jpg",
      gradient: "linear-gradient(135deg, rgba(114, 205, 241, 0.95) 0%, rgba(114, 205, 241, 0.7) 100%)",
    },
    {
      title: "",
      subtitle: "",
      image: "/banner8.jpg",
      gradient: "linear-gradient(135deg, rgba(255, 183, 197, 0.95) 0%, rgba(255, 183, 197, 0.7) 100%)",
    },
    {
      title: " ",
      subtitle: " ",
      image: "/banner2.jpg",
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

  // Partners data
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

  // Enhanced Intersection Observer với threshold tốt hơn
  useEffect(() => {
    const observers = {};
    const observerOptions = {
      threshold: 0.15, // Trigger khi 15% element xuất hiện
      rootMargin: '0px 0px -50px 0px' // Trigger sớm hơn một chút
    };

    Object.keys(sectionRefs).forEach((key) => {
      if (sectionRefs[key].current) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => ({ ...prev, [key]: true }));
              // Unobserve sau khi đã visible để tránh re-trigger
              observers[key].unobserve(entry.target);
            }
          },
          observerOptions
        );
        observers[key].observe(sectionRefs[key].current);
      }
    });

    // Observer cho featured grid section
    const featuredSection = document.querySelector('.featured-grid-section');
    if (featuredSection) {
      const featuredObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            featuredSection.classList.add('visible');
            featuredObserver.unobserve(entry.target);
          }
        },
        observerOptions
      );
      featuredObserver.observe(featuredSection);
    }

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  // };

  return (
    <Box className="homepage-container">
      {/* BANNER SLIDER */}
      <Box className="banner-slider">
        {bannerSlides.map((slide, index) => (
          <Box
            key={index}
            className={`banner-slide ${currentSlide === index ? 'active' : ''}`}
            sx={{
              background: `url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Container maxWidth="lg">
              <Box className={`banner-content ${currentSlide === index ? 'animate' : ''}`}>
                {/* <Typography variant="h2" className="banner-title">
                  {slide.title}
                </Typography>
                <Typography variant="h5" className="banner-subtitle">
                  {slide.subtitle}
                </Typography> */}
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/quiz"
                  className="banner-button"
                >
                  Bắt đầu Quiz ngay 🚀
                </Button>
              </Box>
            </Container>
          </Box>
        ))}

        {/* Navigation Arrows */}
        {/* <IconButton onClick={prevSlide} className="banner-arrow banner-arrow-left">
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton onClick={nextSlide} className="banner-arrow banner-arrow-right">
          <ArrowForwardIosIcon />
        </IconButton> */}

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
      <section id="about-section" className="about-section">
        <div className="about-container">
          {/* ẢNH */}
          <div className="about-image-wrapper">
            <img
              src="/home_banner1.png"
              alt="Chuyện nhà TinyYummy"
              className="about-image"
            />
          </div>

          {/* NỘI DUNG */}
          <div className="about-content-wrapper">
            <h2 className="about-title">Chuyện nhà TY</h2>
            <p className="about-text">
              TinyYummy là thương hiệu Việt trong lĩnh vực đồ ăn dặm cho trẻ em,
              cam kết mang đến những sản phẩm dinh dưỡng an toàn, tiện lợi và chất lượng cao,
              đồng hành cùng ba mẹ trong hành trình chăm sóc và phát triển toàn diện cho bé yêu.
            </p>
            <p className="about-text">
              Với đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm, chúng tôi nghiên cứu
              và phát triển các công thức ăn dặm khoa học, phù hợp với từng giai đoạn phát triển của trẻ.
            </p>
            <a href="/about-us" className="about-button">Tìm hiểu thêm về chúng tôi ✨</a>
          </div>
        </div>
      </section>


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
            BÀI VIẾT NỔI BẬT
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
                  sx={{
                    cursor: 'pointer'
                  }}
                  onClick={() => window.location.href = `/mealset/${set._id}`}
                >
                  {idx === 1 && (
                    <Box className="popular-badge" sx={{ marginTop: '1rem' }}>
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
                      <span>Menu cá nhân hóa</span>
                    </Typography>
                    <Typography variant="body2" className="feature">
                      <Box component="span" className="checkmark">✓</Box>
                      <span>Giao hàng tận nơi trong {set.duration} ngày</span>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    Mua ngay 🛒
                  </Button>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>



      {/* FEATURED IMAGE SECTION - HIỆU ỨNG ẢNH BỊ CẮT */}
      <section
        ref={sectionRefs.featured}
        className="featured-grid-section"
        style={{
          backgroundImage: "url('/homepage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="featured-overlay"></div>

        <div className="featured-grid">
          {[
            { icon: "🍎", title: "Dinh dưỡng khoa học", text: "Công thức cân đối dinh dưỡng" },
            { icon: "💚", title: "Organic 100%", text: "Không chất bảo quản" },
            { icon: "👶", title: "An toàn cho bé", text: "Nguyên liệu tươi ngon, sạch" },
            { icon: "⭐", title: "Tin cậy nhất", text: "Được hàng nghìn mẹ lựa chọn" },
            { icon: "👩‍🍳", title: "Dễ dàng chế biến", text: "Hướng dẫn chi tiết từng bước" },
            { icon: "🌈", title: "Đa dạng món ăn", text: "Phù hợp từng giai đoạn phát triển" },
          ].map((item, i) => (
            <div key={i} className={`featured-tile tile-${i + 1}`}>
              <div className="tile-content">
                <h3 className="tile-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* RECIPES SECTION */}
      <section id="recipes-section" className="recipes-section" ref={sectionRefs.recipes}>
        <div className="recipes-header">
          <div className="recipes-header-text">
            <h2 className="recipes-title">KHÁM PHÁ CÔNG THỨC</h2>
            <p className="recipes-subtitle">
              Các công thức nấu ăn bổ dưỡng, dễ làm cho bé yêu của bạn
            </p>
          </div>
        </div>

        {loadingRecipes ? (
          <div className="recipes-loading">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="recipe-card-plain"
                  onClick={() => (window.location.href = `/recipes/${recipe._id}`)}
                >
                  <div className="recipe-image-wrapper-plain">
                    <img
                      src={recipe.images?.[0]}
                      alt={recipe.name}
                      className="recipe-image-plain"
                    />
                  </div>

                  <div className="recipe-content-plain">
                    <h3 className="recipe-name-plain">{recipe.name}</h3>
                    <div className="recipe-tags-plain">
                      <span className="tag tag-blue">Bổ dưỡng</span>
                      <span className="tag tag-green">Dễ làm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="recipes-more">
              <a href="/recipes" className="recipes-btn">
                Xem thêm công thức →
              </a>
            </div>
          </>
        )}
      </section>



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
              KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
            </Typography>
            <Typography variant="body1" color="text.secondary" className="section-subtitle">
              Hàng ngàn phụ huynh tin tưởng và lựa chọn
            </Typography>
          </Box>

          <Box className="reviews-scroll">
            {reviews.map((review, idx) => (
              <Card key={idx} className="review-card">
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
              ĐỐI TÁC TIN CẬY
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
              to="/"
              className="btn-cta-outline"
            >
              Liên hệ tư vấn 📞
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;