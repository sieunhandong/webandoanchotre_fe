import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import * as BlogService from "../../services/AdminService/blogService";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const BlogPage = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await BlogService.getBlogsByMainCategories();
        setMainCategories(res.categories);

        if (res.categories.length > 0) {
          setSelectedCategory(res.categories[0].category._id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy blog theo chủ đề:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchAllBlogs = async () => {
      try {
        setLoadingAll(true);
        const res = await BlogService.getAllBlogsByUser({ page: 1, limit: 50 });
        setAllBlogs(res.blogs);
      } catch (error) {
        console.error("Lỗi khi lấy tất cả blog:", error);
      } finally {
        setLoadingAll(false);
      }
    };

    fetchMainCategories();
    fetchAllBlogs();
  }, []);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const currentCategoryBlogs = mainCategories.find(
    (cat) => cat.category._id === selectedCategory
  )?.blogs;

  return (
    <Box sx={{ backgroundColor: "#F5FBFE", minHeight: "100vh" }}>
      {/* Hero Banner - Modern & Bold */}
      <Box
        sx={{
          height: { xs: "70vh", md: "75vh" },
          background:
            "linear-gradient(135deg, rgba(116, 206, 242, 0.92) 0%, rgba(116, 206, 242, 0.75) 100%), url('/homepage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.1rem", md: "1.75rem" },
              mb: 3,
              textShadow: "2px 3px 6px rgba(0,0,0,0.15)",
              letterSpacing: "0.5px",
            }}
          >
            Cùng mẹ chăm con khoa học
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "4.5rem", lg: "5rem" },
              mb: 4,
              textShadow: "3px 5px 10px rgba(0,0,0,0.2)",
              lineHeight: 1.2,
            }}
          >
            THỜI ĐIỂM VÀNG <br />
            CÙNG BÉ ĂN DẶM
          </Typography>
          <Box
            sx={{
              maxWidth: "900px",
              mx: "auto",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              padding: { xs: "20px", md: "30px" },
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.95rem", md: "1.15rem" },
                textShadow: "1px 2px 4px rgba(0,0,0,0.2)",
                lineHeight: 1.8,
              }}
            >
              Từ 6 tháng tuổi, bé bước vào "thời điểm vàng" - giai đoạn não bộ, hệ tiêu hóa và vị giác phát triển mạnh mẽ nhất.
              Đây chính là lúc cha mẹ đóng vai trò người bạn đồng hành quan trọng, giúp bé làm quen với mùi vị, kết cấu và thói quen ăn uống lành mạnh.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Category Section - Spacious & Modern */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 3, md: 6 } }}>
        {loadingCategories ? (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#74CEF2" }} size={60} />
          </Box>
        ) : (
          <>
            {/* Category Tabs */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                mb: 6,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {mainCategories.map((cat) => (
                <Chip
                  key={cat.category._id}
                  label={cat.category.name.toUpperCase()}
                  onClick={() => setSelectedCategory(cat.category._id)}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    padding: "24px 32px",
                    borderRadius: "50px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: selectedCategory === cat.category._id ? "#74CEF2" : "#fff",
                    color: selectedCategory === cat.category._id ? "#fff" : "#333",
                    border: selectedCategory === cat.category._id ? "none" : "2px solid #E0E0E0",
                    "&:hover": {
                      backgroundColor: selectedCategory === cat.category._id ? "#5CB8D9" : "#F0F8FC",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(116, 206, 242, 0.3)",
                    },
                  }}
                />
              ))}
            </Box>

            {/* Category Blog Grid - Fixed 3 columns */}
            {currentCategoryBlogs?.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 4,
                }}
              >
                {currentCategoryBlogs.map((blog) => (
                  <Card
                    key={blog._id}
                    component={Link}
                    to={`/blog/${blog._id}`}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      borderRadius: "24px",
                      overflow: "hidden",
                      boxShadow: "0 8px 30px rgba(116, 206, 242, 0.12)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid rgba(116, 206, 242, 0.1)",
                      backgroundColor: "#fff",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: "0 20px 50px rgba(116, 206, 242, 0.25)",
                        borderColor: "#74CEF2",
                      },
                    }}
                  >
                    {blog.images?.[0] && (
                      <CardMedia
                        component="img"
                        height="240"
                        image={blog.images[0]}
                        alt={blog.title}
                        sx={{
                          transition: "transform 0.4s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    )}
                    <CardContent sx={{ padding: "28px" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          color: "#1A1A1A",
                          fontSize: "1.35rem",
                        }}
                      >
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.7,
                          fontSize: "1rem",
                        }}
                      >
                        {blog.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  Chưa có bài viết nào cho category này.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* All Blogs Carousel Section */}
      <Box sx={{ backgroundColor: "#fff", py: 10 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Typography
            variant="h3"
            sx={{
              mb: 6,
              fontWeight: 800,
              textAlign: "center",
              color: "#1A1A1A",
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            TIPS NUÔI CON KHÔN LỚN
          </Typography>
          {loadingAll ? (
            <Box textAlign="center" py={8}>
              <CircularProgress sx={{ color: "#74CEF2" }} size={60} />
            </Box>
          ) : (
            <Box sx={{ position: "relative", px: { xs: 0, md: 6 } }}>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: { xs: -15, md: -30 },
                  top: "45%",
                  zIndex: 10,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 20px rgba(116, 206, 242, 0.3)",
                  width: 56,
                  height: 56,
                  "&:hover": {
                    backgroundColor: "#74CEF2",
                    color: "#fff",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ArrowBackIos sx={{ ml: 1 }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: { xs: -15, md: -30 },
                  top: "45%",
                  zIndex: 10,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 20px rgba(116, 206, 242, 0.3)",
                  width: 56,
                  height: 56,
                  "&:hover": {
                    backgroundColor: "#74CEF2",
                    color: "#fff",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ArrowForwardIos />
              </IconButton>

              <Swiper
                spaceBetween={30}
                slidesPerView={3}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  600: { slidesPerView: 2 },
                  960: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
              >
                {allBlogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <Card
                      component={Link}
                      to={`/blog/${blog._id}`}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(116, 206, 242, 0.12)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "1px solid rgba(116, 206, 242, 0.1)",
                        backgroundColor: "#fff",
                        "&:hover": {
                          transform: "translateY(-12px)",
                          boxShadow: "0 20px 50px rgba(116, 206, 242, 0.25)",
                          borderColor: "#74CEF2",
                        },
                      }}
                    >
                      {blog.images?.[0] && (
                        <CardMedia
                          component="img"
                          height="240"
                          image={blog.images[0]}
                          alt={blog.title}
                          sx={{
                            transition: "transform 0.4s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      )}
                      <CardContent sx={{ padding: "28px" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            color: "#1A1A1A",
                            fontSize: "1.25rem",
                          }}
                        >
                          {blog.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.7,
                          }}
                        >
                          {blog.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                        </Typography>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default BlogPage;