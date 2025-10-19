import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import * as BlogService from "../../services/AdminService/blogService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const CARD_IMAGE_HEIGHT = 240;
const CARD_TOTAL_HEIGHT = 420;

const BlogPage = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [mainPagination, setMainPagination] = useState({});
  const [allBlogs, setAllBlogs] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAllCategory, setSelectedAllCategory] = useState(null);
  const [allBlogsPage, setAllBlogsPage] = useState(1);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);
  const swiperRef = useRef(null);
  const observerTarget = useRef(null);
  const isLoadingRef = useRef(false);

  // Fetch main categories
  const fetchMainCategories = async (page = 1) => {
    try {
      setLoadingCategories(true);
      const res = await BlogService.getBlogsByMainCategories({ page, limit: 6 });
      setMainCategories(res.categories || []);

      if (res.categories?.length > 0 && !selectedCategory) {
        setSelectedCategory(res.categories[0].category._id);
      }

      const paginations = {};
      res.categories?.forEach((cat) => {
        paginations[cat.category._id] = cat.pagination;
      });
      setMainPagination(paginations);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Infinite scroll - Fetch more blogs
  const fetchMoreBlogs = useCallback(async (categoryId = null, page = 1) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoadingAll(true);

    try {
      const params = { page, limit: 12 };
      if (categoryId) params.blogCategoryId = categoryId;
      const res = await BlogService.getAllBlogsByUser(params);

      const newBlogs = res.blogs || [];
      if (page === 1) {
        setAllBlogs(newBlogs);
      } else {
        setAllBlogs((prev) => [...prev, ...newBlogs]);
      }

      setHasMoreBlogs(newBlogs.length >= 12);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setHasMoreBlogs(false);
    } finally {
      setLoadingAll(false);
      isLoadingRef.current = false;
    }
  }, []);

  // Fetch categories
  const fetchAllCategories = async () => {
    try {
      const res = await BlogService.getAllCategories();
      if (res?.categories) setAllCategories(res.categories);
      else if (Array.isArray(res)) setAllCategories(res);
      else setAllCategories([]);
    } catch (error) {
      console.error("Error fetching categories list:", error);
    }
  };

  useEffect(() => {
    fetchMainCategories();
    fetchMoreBlogs(null, 1);
    fetchAllCategories();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreBlogs && !isLoadingRef.current) {
          fetchMoreBlogs(selectedAllCategory, allBlogsPage + 1);
          setAllBlogsPage((p) => p + 1);
        }
      },
      { threshold: 0.3 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMoreBlogs, selectedAllCategory, allBlogsPage]);

  // Handle page change for category
  const handlePageChange = async (categoryId, direction) => {
    const pagination = mainPagination[categoryId];
    if (!pagination) return;

    let newPage = pagination.page;
    if (direction === "next" && pagination.page < pagination.totalPages) {
      newPage++;
    } else if (direction === "prev" && pagination.page > 1) {
      newPage--;
    } else {
      return;
    }

    try {
      setLoadingCategories(true);
      const res = await BlogService.getBlogsByMainCategories({
        page: newPage,
        limit: pagination.limit,
      });

      const updated = res.categories.find(
        (cat) => cat.category._id === categoryId
      );
      if (updated) {
        setMainCategories((prev) =>
          prev.map((cat) =>
            cat.category._id === categoryId ? updated : cat
          )
        );
        setMainPagination((prev) => ({
          ...prev,
          [categoryId]: updated.pagination,
        }));
      }
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleFilterAllBlogs = async (categoryId) => {
    setSelectedAllCategory(categoryId ?? null);
    setAllBlogsPage(1);
    fetchMoreBlogs(categoryId, 1);
  };

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const currentCategoryBlogs = mainCategories.find(
    (cat) => cat.category._id === selectedCategory
  )?.blogs;

  // Blog Card Component
  const renderBlogCard = (blog) => (
    <Card
      component={Link}
      to={`/blog/${blog._id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: CARD_TOTAL_HEIGHT,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(114, 205, 241, 0.12)",
        border: "1px solid rgba(114, 205, 241, 0.15)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        backgroundColor: "#fff",
        textDecoration: "none",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(114, 205, 241, 0.08), rgba(255, 179, 198, 0.08))",
          opacity: 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: 1,
        },
        "&:hover": {
          transform: "translateY(-12px) scale(1.01)",
          boxShadow: "0 20px 48px rgba(114, 205, 241, 0.2)",
          "&::before": { opacity: 1 },
        },
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
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            ".MuiCard-root:hover &": {
              transform: "scale(1.08)",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: CARD_IMAGE_HEIGHT,
            background: "linear-gradient(135deg, #E0F7FF 0%, #FFE5F0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#72CDF1",
            fontWeight: 600,
            fontSize: "0.95rem",
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
          p: { xs: 2, md: 2.5 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: "#0F1724",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.4,
            }}
          >
            {blog.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6,
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              color: "#5A6B7A",
            }}
          >
            {blog.content.replace(/<[^>]+>/g, "").slice(0, 140)}...
          </Typography>
        </Box>
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(114, 205, 241, 0.1)" }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "#72CDF1",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {blog.blogCategoryId?.name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ backgroundColor: "#F8FCFE", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "55vh", md: "65vh" },
          background:
            "linear-gradient(135deg, rgba(114, 205, 241, 0.85) 0%, rgba(255, 179, 198, 0.7) 100%), url('/homepage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            background:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1), transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              opacity: 0.95,
              animation: "fadeInUp 0.8s ease 0.2s both",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Cùng mẹ chăm con khoa học
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              fontSize: { xs: "2rem", md: "3.5rem" },
              animation: "fadeInUp 0.8s ease 0.4s both",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            THỜI ĐIỂM VÀNG <br /> CÙNG BÉ ĂN DẶM
          </Typography>
        </Container>
      </Box>

      {/* Main Category Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 } }}>
        {loadingCategories ? (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#72CDF1" }} size={50} />
          </Box>
        ) : (
          <>
            {/* Category Tabs */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1.5, md: 2.5 },
                mb: 6,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {mainCategories.map((cat, idx) => (
                <Box
                  key={cat.category._id}
                  onClick={() => setSelectedCategory(cat.category._id)}
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 1.25,
                    borderRadius: "50px",
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    backgroundColor:
                      selectedCategory === cat.category._id ? "#72CDF1" : "#fff",
                    color:
                      selectedCategory === cat.category._id ? "#fff" : "#0F1724",
                    border:
                      selectedCategory === cat.category._id
                        ? "2px solid #72CDF1"
                        : "2px solid rgba(114, 205, 241, 0.25)",
                    boxShadow:
                      selectedCategory === cat.category._id
                        ? "0 8px 20px rgba(114, 205, 241, 0.3)"
                        : "none",
                    animation: `fadeInUp 0.5s ease ${idx * 0.1}s both`,
                    "@keyframes fadeInUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 28px rgba(114, 205, 241, 0.25)",
                    },
                  }}
                >
                  {cat.category.name.toUpperCase()}
                </Box>
              ))}
            </Box>

            {/* Blog Grid */}
            {currentCategoryBlogs?.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: { xs: 3, md: 4 },
                    mb: 8,
                  }}
                >
                  {currentCategoryBlogs.map((blog, idx) => (
                    <Box
                      key={blog._id}
                      sx={{
                        animation: `fadeInUp 0.5s ease ${idx * 0.1}s both`,
                        "@keyframes fadeInUp": {
                          from: { opacity: 0, transform: "translateY(20px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      {renderBlogCard(blog)}
                    </Box>
                  ))}
                </Box>

                {/* Pagination */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 6,
                    animation: "fadeInUp 0.6s ease 0.3s both",
                    "@keyframes fadeInUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <Box
                    onClick={() =>
                      handlePageChange(selectedCategory, "prev")
                    }
                    sx={{
                      px: { xs: 3, md: 4 },
                      py: 1.25,
                      borderRadius: "50px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor:
                        mainPagination[selectedCategory]?.page === 1
                          ? "not-allowed"
                          : "pointer",
                      backgroundColor:
                        mainPagination[selectedCategory]?.page === 1
                          ? "#E8F5FB"
                          : "#fff",
                      color:
                        mainPagination[selectedCategory]?.page === 1
                          ? "#A0C4D8"
                          : "#0F1724",
                      border: "2px solid rgba(114, 205, 241, 0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          mainPagination[selectedCategory]?.page === 1
                            ? "#E8F5FB"
                            : "#72CDF1",
                        color:
                          mainPagination[selectedCategory]?.page === 1
                            ? "#A0C4D8"
                            : "#fff",
                        transform:
                          mainPagination[selectedCategory]?.page === 1
                            ? "none"
                            : "translateY(-2px)",
                      },
                      opacity:
                        mainPagination[selectedCategory]?.page === 1
                          ? 0.6
                          : 1,
                    }}
                  >
                    ← Trang trước
                  </Box>
                  <Box
                    onClick={() => handlePageChange(selectedCategory, "next")}
                    sx={{
                      px: { xs: 3, md: 4 },
                      py: 1.25,
                      borderRadius: "50px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor:
                        mainPagination[selectedCategory]?.page ===
                          mainPagination[selectedCategory]?.totalPages
                          ? "not-allowed"
                          : "pointer",
                      backgroundColor:
                        mainPagination[selectedCategory]?.page ===
                          mainPagination[selectedCategory]?.totalPages
                          ? "#E8F5FB"
                          : "#72CDF1",
                      color:
                        mainPagination[selectedCategory]?.page ===
                          mainPagination[selectedCategory]?.totalPages
                          ? "#A0C4D8"
                          : "#fff",
                      border:
                        mainPagination[selectedCategory]?.page ===
                          mainPagination[selectedCategory]?.totalPages
                          ? "2px solid rgba(114, 205, 241, 0.15)"
                          : "2px solid #72CDF1",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow:
                          mainPagination[selectedCategory]?.page ===
                            mainPagination[selectedCategory]?.totalPages
                            ? "none"
                            : "0 8px 20px rgba(114, 205, 241, 0.3)",
                        transform:
                          mainPagination[selectedCategory]?.page ===
                            mainPagination[selectedCategory]?.totalPages
                            ? "none"
                            : "translateY(-2px)",
                      },
                      opacity:
                        mainPagination[selectedCategory]?.page ===
                          mainPagination[selectedCategory]?.totalPages
                          ? 0.6
                          : 1,
                    }}
                  >
                    Trang sau →
                  </Box>
                </Box>
              </>
            ) : (
              <Typography
                textAlign="center"
                sx={{
                  color: "#5A6B7A",
                  fontSize: "1.05rem",
                  py: 8,
                }}
              >
                Chưa có bài viết nào cho danh mục này.
              </Typography>
            )}
          </>
        )}
      </Container>

      {/* All Blogs Section with Infinite Scroll */}
      <Box sx={{ backgroundColor: "#fff", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 800,
              textAlign: "center",
              color: "#0F1724",
              fontSize: { xs: "1.8rem", md: "2.8rem" },
              animation: "fadeInUp 0.6s ease both",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            TIPS NUÔI CON KHÔN LỚN
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "#72CDF1",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              mb: 6,
              fontWeight: 600,
              letterSpacing: "0.5px",
              animation: "fadeInUp 0.6s ease 0.1s both",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Khám phá những bài viết bổ ích về nuôi dạy con yêu
          </Typography>

          {/* Filter Chips */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 1.5, md: 2 },
              mb: 8,
              flexWrap: "wrap",
            }}
          >
            <Box
              onClick={() => handleFilterAllBlogs(null)}
              sx={{
                px: { xs: 2.5, md: 3.5 },
                py: 1.1,
                borderRadius: "50px",
                fontWeight: 600,
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                backgroundColor: selectedAllCategory === null ? "#72CDF1" : "#fff",
                color: selectedAllCategory === null ? "#fff" : "#0F1724",
                border:
                  selectedAllCategory === null
                    ? "2px solid #72CDF1"
                    : "2px solid rgba(114, 205, 241, 0.2)",
                boxShadow:
                  selectedAllCategory === null
                    ? "0 8px 20px rgba(114, 205, 241, 0.3)"
                    : "none",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 28px rgba(114, 205, 241, 0.25)",
                },
              }}
            >
              TẤT CẢ
            </Box>
            {allCategories.map((cat, idx) => (
              <Box
                key={cat._id}
                onClick={() => handleFilterAllBlogs(cat._id)}
                sx={{
                  px: { xs: 2.5, md: 3.5 },
                  py: 1.1,
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  backgroundColor:
                    selectedAllCategory === cat._id ? "#72CDF1" : "#fff",
                  color: selectedAllCategory === cat._id ? "#fff" : "#0F1724",
                  border:
                    selectedAllCategory === cat._id
                      ? "2px solid #72CDF1"
                      : "2px solid rgba(114, 205, 241, 0.2)",
                  boxShadow:
                    selectedAllCategory === cat._id
                      ? "0 8px 20px rgba(114, 205, 241, 0.3)"
                      : "none",
                  animation: `fadeInUp 0.5s ease ${idx * 0.05}s both`,
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 28px rgba(114, 205, 241, 0.25)",
                  },
                }}
              >
                {cat.name.toUpperCase()}
              </Box>
            ))}
          </Box>

          {/* Horizontal Scroll with Swiper */}
          {loadingAll && allBlogs.length === 0 ? (
            <Box textAlign="center" py={8}>
              <CircularProgress sx={{ color: "#72CDF1" }} size={50} />
            </Box>
          ) : (
            <Box sx={{ position: "relative", mb: 4 }}>
              {/* Previous Button */}
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: { xs: 0, md: -50 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  backgroundColor: "#72CDF1",
                  width: { xs: 40, md: 56 },
                  height: { xs: 40, md: 56 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(114, 205, 241, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": {
                    backgroundColor: "#5AB8D4",
                    transform: "translateY(-50%) scale(1.1)",
                    boxShadow: "0 12px 32px rgba(114, 205, 241, 0.4)",
                  },
                }}
              >
                <ChevronLeft size={24} color="white" strokeWidth={3} />
              </IconButton>

              {/* Next Button */}
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: { xs: 0, md: -50 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  backgroundColor: "#72CDF1",
                  width: { xs: 40, md: 56 },
                  height: { xs: 40, md: 56 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(114, 205, 241, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": {
                    backgroundColor: "#5AB8D4",
                    transform: "translateY(-50%) scale(1.1)",
                    boxShadow: "0 12px 32px rgba(114, 205, 241, 0.4)",
                  },
                }}
              >
                <ChevronRight size={24} color="white" strokeWidth={3} />
              </IconButton>

              {/* Swiper Container */}
              <Swiper
                ref={swiperRef}
                spaceBetween={24}
                slidesPerView={4}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                  0: { slidesPerView: 1.2, spaceBetween: 12 },
                  480: { slidesPerView: 1.5, spaceBetween: 16 },
                  768: { slidesPerView: 2.2, spaceBetween: 20 },
                  1024: { slidesPerView: 3.2, spaceBetween: 24 },
                  1440: { slidesPerView: 4, spaceBetween: 24 },
                }}
                style={{ paddingBottom: "20px" }}
              >
                {allBlogs.map((blog, idx) => (
                  <SwiperSlide key={`${blog._id}-${idx}`}>
                    <Box
                      sx={{
                        animation: `fadeInUp 0.4s ease ${idx * 0.05}s both`,
                        "@keyframes fadeInUp": {
                          from: { opacity: 0, transform: "translateY(20px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                        height: "100%",
                      }}
                    >
                      {renderBlogCard(blog)}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Load More Trigger */}
              <Box
                ref={observerTarget}
                sx={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: "1px",
                  height: "1px",
                  pointerEvents: "none",
                }}
              />

              {/* Loading Indicator */}
              {loadingAll && hasMoreBlogs && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 60,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "rgba(114, 205, 241, 0.1)",
                    px: 2,
                    py: 1,
                    borderRadius: "50px",
                    animation: "pulse 1.5s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 0.6 },
                      "50%": { opacity: 1 },
                    },
                  }}
                >
                  <CircularProgress sx={{ color: "#72CDF1" }} size={20} />
                  <Typography sx={{ color: "#72CDF1", fontSize: "0.85rem", fontWeight: 600 }}>
                    Tải thêm...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default BlogPage;