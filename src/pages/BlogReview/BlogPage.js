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

const CARD_IMAGE_HEIGHT = 240; // chiều cao ảnh trong mỗi card
const CARD_TOTAL_HEIGHT = 420; // tổng chiều cao mỗi card (ảnh + content)

const BlogPage = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAllCategory, setSelectedAllCategory] = useState(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await BlogService.getBlogsByMainCategories();
        setMainCategories(res.categories || []);
        if (res.categories?.length > 0) {
          setSelectedCategory(res.categories[0].category._id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy blog theo chủ đề:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchAllBlogs = async (categoryId = null) => {
      try {
        setLoadingAll(true);
        const params = { page: 1, limit: 50 };
        if (categoryId) params.blogCategoryId = categoryId;
        const res = await BlogService.getAllBlogsByUser(params);
        setAllBlogs(res.blogs || []);
      } catch (error) {
        console.error("Lỗi khi lấy tất cả blog:", error);
      } finally {
        setLoadingAll(false);
      }
    };

    const fetchAllCategories = async () => {
      try {
        // giả sử API trả về { categories: [...] } hoặc mảng trực tiếp
        const res = await BlogService.getAllCategories();
        if (res?.categories) setAllCategories(res.categories);
        else if (Array.isArray(res)) setAllCategories(res);
        else setAllCategories([]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách category:", error);
      }
    };

    fetchMainCategories();
    fetchAllCategories();
    fetchAllBlogs();
  }, []);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const handleFilterAllBlogs = async (categoryId) => {
    setSelectedAllCategory(categoryId ?? null);
    try {
      setLoadingAll(true);
      const params = { page: 1, limit: 50 };
      if (categoryId) params.blogCategoryId = categoryId;
      const res = await BlogService.getAllBlogsByUser(params);
      setAllBlogs(res.blogs || []);
    } catch (error) {
      console.error("Lỗi khi lọc blog:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  const currentCategoryBlogs = mainCategories.find(
    (cat) => cat.category._id === selectedCategory
  )?.blogs;

  // Helper render card (dùng chung cho grid + swiper)
  const renderBlogCard = (blog) => (
    <Card
      component={Link}
      to={`/blog/${blog._id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: CARD_TOTAL_HEIGHT,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(16, 92, 140, 0.08)",
        border: "1px solid rgba(116,206,242,0.08)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 30px 80px rgba(16, 92, 140, 0.12)",
        },
        textDecoration: "none",
      }}
    >
      {blog.images?.[0] ? (
        <CardMedia
          component="img"
          image={blog.images[0]}
          alt={blog.title}
          sx={{
            width: "100%",
            height: CARD_IMAGE_HEIGHT,
            objectFit: "cover",
            flexShrink: 0,
            transition: "transform 0.4s ease",
            "&:hover": { transform: "scale(1.03)" },
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: CARD_IMAGE_HEIGHT,
            backgroundColor: "#F0F4F8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8AA6BF",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          Ảnh đại diện
        </Box>
      )}

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 2, md: 3 },
          backgroundColor: "#fff",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#0F1724",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: { xs: "1rem", md: "1.15rem" },
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
              lineHeight: 1.6,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {blog.content.replace(/<[^>]+>/g, "").slice(0, 140)}...
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {blog.blogCategoryId?.name || ""}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ backgroundColor: "#F5FBFE", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "60vh", md: "70vh" },
          background:
            "linear-gradient(135deg, rgba(116, 206, 242, 0.9), rgba(116, 206, 242, 0.7)), url('/homepage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Container maxWidth="xl" sx={{ zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1rem", md: "1.25rem" },
              mb: 2,
              textShadow: "1px 2px 6px rgba(0,0,0,0.16)",
            }}
          >
            Cùng mẹ chăm con khoa học
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.1rem", md: "3rem", lg: "4rem" },
              lineHeight: 1.05,
              textShadow: "3px 6px 18px rgba(0,0,0,0.22)",
            }}
          >
            THỜI ĐIỂM VÀNG
            <br />
            CÙNG BÉ ĂN DẶM
          </Typography>
        </Container>
      </Box>

      {/* Category Blogs */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 3, md: 6 } }}>
        {loadingCategories ? (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#74CEF2" }} size={60} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                gap: 2,
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
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: "40px",
                    backgroundColor:
                      selectedCategory === cat.category._id ? "#74CEF2" : "#fff",
                    color:
                      selectedCategory === cat.category._id ? "#fff" : "#24303A",
                    border:
                      selectedCategory === cat.category._id
                        ? "none"
                        : "1px solid rgba(15,23,36,0.08)",
                    boxShadow:
                      selectedCategory === cat.category._id
                        ? "0 6px 18px rgba(116,206,242,0.12)"
                        : "none",
                  }}
                />
              ))}
            </Box>

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
                  <Box key={blog._id}>{renderBlogCard(blog)}</Box>
                ))}
              </Box>
            ) : (
              <Typography textAlign="center" color="text.secondary">
                Chưa có bài viết nào cho category này.
              </Typography>
            )}
          </>
        )}
      </Container>

      {/* All Blogs Section with Filter */}
      <Box sx={{ backgroundColor: "#fff", py: 10 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontWeight: 800,
              textAlign: "center",
              color: "#0F1724",
              fontSize: { xs: "1.6rem", md: "2.6rem" },
            }}
          >
            TIPS NUÔI CON KHÔN LỚN
          </Typography>

          {/* Filter Chips */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mb: 6,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label="TẤT CẢ"
              onClick={() => handleFilterAllBlogs(null)}
              sx={{
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: "40px",
                backgroundColor: selectedAllCategory === null ? "#74CEF2" : "#fff",
                color: selectedAllCategory === null ? "#fff" : "#24303A",
                border: selectedAllCategory === null ? "none" : "1px solid rgba(15,23,36,0.08)",
              }}
            />
            {allCategories.map((cat) => (
              <Chip
                key={cat._id}
                label={cat.name.toUpperCase()}
                onClick={() => handleFilterAllBlogs(cat._id)}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: "40px",
                  backgroundColor:
                    selectedAllCategory === cat._id ? "#74CEF2" : "#fff",
                  color: selectedAllCategory === cat._id ? "#fff" : "#24303A",
                  border: selectedAllCategory === cat._id ? "none" : "1px solid rgba(15,23,36,0.08)",
                }}
              />
            ))}
          </Box>

          {loadingAll ? (
            <Box textAlign="center" py={8}>
              <CircularProgress sx={{ color: "#74CEF2" }} size={60} />
            </Box>
          ) : (
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: { xs: -10, md: -40 },
                  top: "45%",
                  zIndex: 10,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 20px rgba(116, 206, 242, 0.18)",
                  width: 56,
                  height: 56,
                  "&:hover": { backgroundColor: "#74CEF2", color: "#fff" },
                }}
              >
                <ArrowBackIos sx={{ ml: 0.5 }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: { xs: -10, md: -40 },
                  top: "45%",
                  zIndex: 10,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 20px rgba(116, 206, 242, 0.18)",
                  width: 56,
                  height: 56,
                  "&:hover": { backgroundColor: "#74CEF2", color: "#fff" },
                }}
              >
                <ArrowForwardIos />
              </IconButton>

              <Swiper
                spaceBetween={24}
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
                    {renderBlogCard(blog)}
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
