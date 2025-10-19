import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import {
  Box,
  Typography,
  Paper,
  Container,
  Chip,
  IconButton,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  BookmarkBorder,
  AccessTime,
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';
import * as BlogService from '../../services/AdminService/blogService';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const swiperRef = useRef(null);
  // Fetch blog detail
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await BlogService.getBlogById(id);
        setBlog(res);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Lỗi khi lấy blog:', error);
        setNotifications(prev => [
          ...prev,
          { id: Date.now(), message: 'Không tìm thấy bài blog', severity: 'error' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Fetch related blogs by category
  useEffect(() => {
    const fetchRelated = async () => {
      if (!blog) return;
      try {
        setLoadingRelated(true);
        // Truyền trực tiếp blogCategoryId
        const res = await BlogService.getBlogsByCategory(blog.blogCategoryId._id);
        // Lọc bỏ bài hiện tại
        const filtered = res.blogs.filter(b => b._id !== blog._id);
        setRelatedBlogs(filtered);
      } catch (error) {
        console.error("Lỗi khi lấy blog liên quan:", error);
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelated();
  }, [blog]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), message: 'Đã thích bài viết', severity: 'success' }
      ]);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), message: 'Đã lưu bài viết', severity: 'success' }
      ]);
    }
  };
  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), message: 'Đã copy link bài viết', severity: 'success' }
      ]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#F5FBFE", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Skeleton variant="text" width="70%" height={80} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: "24px", mb: 4 }} />
          <Skeleton variant="text" width="100%" height={40} />
          <Skeleton variant="text" width="100%" height={40} />
          <Skeleton variant="text" width="90%" height={40} />
        </Container>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ backgroundColor: "#F5FBFE", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, textAlign: "center" }}>
          <Typography variant="h4" color="text.secondary" sx={{ mb: 3 }}>
            Không tìm thấy bài blog
          </Typography>
          <Box
            component="button"
            onClick={() => navigate('/blog')}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#74CEF2",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              px: 4,
              py: 2,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#5CB8D9",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(116, 206, 242, 0.4)",
              },
            }}
          >
            <ArrowBack />
            Quay lại
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5FBFE", minHeight: "100vh" }}>
      {/* Hero Section with Image */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", md: "65vh" },
          background: blog.images?.[0]
            ? `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%), url('${blog.images[0]}')`
            : "linear-gradient(135deg, #74CEF2 0%, #5CB8D9 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          mb: -8,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, pb: 8 }}>
          <IconButton
            onClick={() => navigate('/blog')}
            sx={{
              backgroundColor: "rgba(255,255,255,0.95)",
              mb: 3,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#fff",
                transform: "scale(1.05)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              },
            }}
          >
            <ArrowBack />
          </IconButton>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, position: "relative" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "32px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 20px 60px rgba(116, 206, 242, 0.15)",
            p: { xs: 3, md: 6, lg: 8 },
            mb: 8,
          }}
        >
          {/* Category & Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
            {blog.blogCategoryId?.name && (
              <Chip
                label={blog.blogCategoryId.name}
                sx={{
                  backgroundColor: "#74CEF2",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 2,
                  height: "40px",
                  borderRadius: "20px",
                }}
              />
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
              <AccessTime sx={{ fontSize: "1.3rem" }} />
              <Typography variant="body1" fontWeight={500}>
                {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 4,
              lineHeight: 1.3,
              color: "#1A1A1A",
              fontSize: { xs: "2rem", md: "3.5rem" },
            }}
          >
            {blog.title}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 5,
              pb: 5,
              borderBottom: "2px solid #F0F0F0",
            }}
          >
            <IconButton
              onClick={handleLike}
              sx={{
                backgroundColor: isLiked ? "#FFE5E5" : "#F5F5F5",
                color: isLiked ? "#FF4444" : "#666",
                width: 50,
                height: 50,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isLiked ? "#FFD0D0" : "#E8E8E8",
                  transform: "scale(1.15)",
                },
              }}
            >
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              onClick={handleSave}
              sx={{
                backgroundColor: isSaved ? "#E5F4FF" : "#F5F5F5",
                color: isSaved ? "#74CEF2" : "#666",
                width: 50,
                height: 50,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isSaved ? "#D0EBFF" : "#E8E8E8",
                  transform: "scale(1.15)",
                },
              }}
            >
              <BookmarkBorder />
            </IconButton>
            <IconButton
              onClick={handleShare}
              sx={{
                backgroundColor: "#F5F5F5",
                color: "#666",
                width: 50,
                height: 50,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#E8E8E8",
                  transform: "scale(1.15)",
                },
              }}
            >
              <Share />
            </IconButton>
          </Box>

          {/* Blog Content */}
          <Box
            sx={{
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: "20px",
                my: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              },
              "& p": {
                fontSize: "1.15rem",
                lineHeight: 2,
                color: "#333",
                mb: 3,
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                fontWeight: 700,
                color: "#1A1A1A",
                mt: 5,
                mb: 3,
              },
              "& h2": {
                fontSize: "2.2rem",
                borderLeft: "6px solid #74CEF2",
                paddingLeft: "24px",
                background: "linear-gradient(90deg, rgba(116, 206, 242, 0.05) 0%, transparent 100%)",
                py: 2,
                borderRadius: "0 8px 8px 0",
              },
              "& h3": {
                fontSize: "1.7rem",
                color: "#74CEF2",
              },
              "& ul, & ol": {
                pl: 5,
                mb: 4,
              },
              "& li": {
                fontSize: "1.15rem",
                lineHeight: 2,
                mb: 2,
                color: "#333",
                "&::marker": {
                  color: "#74CEF2",
                  fontWeight: 700,
                },
              },
              "& blockquote": {
                borderLeft: "5px solid #74CEF2",
                backgroundColor: "#F5FBFE",
                padding: "24px 32px",
                margin: "40px 0",
                borderRadius: "0 16px 16px 0",
                fontStyle: "italic",
                fontSize: "1.2rem",
                boxShadow: "0 4px 20px rgba(116, 206, 242, 0.1)",
              },
              "& a": {
                color: "#74CEF2",
                textDecoration: "none",
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#5CB8D9",
                },
              },
              "& code": {
                backgroundColor: "#F5F5F5",
                padding: "4px 10px",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontSize: "0.95em",
                color: "#d63384",
                fontWeight: 500,
              },
              "& pre": {
                backgroundColor: "#2D2D2D",
                color: "#f8f8f2",
                padding: "24px",
                borderRadius: "16px",
                overflow: "auto",
                my: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                "& code": {
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                },
              },
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                my: 4,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                "& th, & td": {
                  border: "1px solid #E0E0E0",
                  padding: "16px",
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "#74CEF2",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                },
                "& tr:nth-of-type(even)": {
                  backgroundColor: "#F5FBFE",
                },
              },
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Paper>

        {/* Related Posts Section */}
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
              BÀI VIẾT LIÊN QUAN
            </Typography>
            {loadingRelated ? (
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
                  {relatedBlogs.map((blog) => (
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
      </Container>

      {/* Notifications */}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() =>
            setNotifications(prev => prev.filter(n => n.id !== notification.id))
          }
        >
          <Alert
            severity={notification.severity || 'info'}
            onClose={() =>
              setNotifications(prev => prev.filter(n => n.id !== notification.id))
            }
            sx={{
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default BlogDetail;