import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import * as BlogService from "../../services/AdminService/blogService";
import * as MealSetService from "../../services/MealSetService";
import * as FoodService from "../../services/FoodService";

const HomePage = () => {
  const [homeBlogs, setHomeBlogs] = useState([]);
  const [mealSets, setMealSets] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingMealSets, setLoadingMealSets] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

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

  return (
    <Box sx={{ backgroundColor: "#FFFFFF" }}>
      {/* Banner */}
      <Box
        sx={{
          height: "85vh",
          background: "linear-gradient(135deg, rgba(114, 205, 241, 0.95) 0%, rgba(114, 205, 241, 0.7) 100%), url('/homepage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background: "linear-gradient(to top, #FFFFFF, transparent)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3.5rem" },
              textShadow: "2px 4px 8px rgba(0,0,0,0.2)",
              mb: 2,
            }}
          >
            Khám phá thế giới ăn dặm & công thức dinh dưỡng
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.5rem" },
              textShadow: "1px 2px 4px rgba(0,0,0,0.2)",
              mb: 4,
            }}
          >
            Tư vấn dinh dưỡng, công thức ăn dặm cho bé yêu của bạn
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/quiz"
            sx={{
              mt: 2,
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#72CDF1",
              borderRadius: "50px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#FFFFFF",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
              },
            }}
          >
            Bắt đầu Quiz ngay
          </Button>
        </Container>
      </Box>

      {/* Blog Section */}
      <Container maxWidth="xl" sx={{ my: 10 }}>
        <Box textAlign="center" mb={6}>
          <Chip
            label="BLOG MỚI NHẤT"
            sx={{
              backgroundColor: "#72CDF1",
              color: "#FFFFFF",
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#333",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Bài viết nổi bật
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cập nhật kiến thức dinh dưỡng mới nhất cho bé yêu
          </Typography>
        </Box>

        {loadingBlogs ? (
          <Box textAlign="center">
            <CircularProgress sx={{ color: "#72CDF1" }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {homeBlogs.map((blog) => (
              <Card
                key={blog._id}
                sx={{
                  flex: "1 1 calc(33.333% - 32px)",
                  cursor: "pointer",
                  minWidth: 280,
                  maxWidth: 400,
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(114, 205, 241, 0.15)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 12px 35px rgba(114, 205, 241, 0.3)",
                    border: "2px solid #72CDF1",
                  },
                }}
                onClick={() => (window.location.href = `/blog/${blog._id}`)}
              >
                {blog.images?.[0] && (
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={blog.images[0]}
                      alt={blog.title}
                      sx={{
                        transition: "transform 0.4s ease",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        backgroundColor: "#72CDF1",
                        color: "#FFFFFF",
                        px: 2,
                        py: 0.5,
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Mới
                    </Box>
                  </Box>
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: "#333",
                      lineHeight: 1.4,
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
                    }}
                  >
                    {blog.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

        )}
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/blog"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              backgroundColor: "#B4E7CE",
              color: "#2D5F4C",
              borderRadius: "50px",
              boxShadow: "0 6px 20px rgba(180, 231, 206, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#9DD9B8",
                transform: "translateY(-3px)",
                boxShadow: "0 10px 28px rgba(180, 231, 206, 0.4)",
              },
            }}
          >
            Xem thêm
          </Button>
        </Box>
      </Container>

      {/* Meal Sets Section */}
      <Box sx={{ backgroundColor: "#F8FCFF", py: 10 }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={6}>
            <Chip
              label="GÓI ĂN DẶM"
              sx={{
                backgroundColor: "#72CDF1",
                color: "#FFFFFF",
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#333",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              SET ĂN DẶM
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lựa chọn gói phù hợp nhất cho bé yêu của bạn
            </Typography>
          </Box>

          {loadingMealSets ? (
            <Box textAlign="center">
              <CircularProgress sx={{ color: "#72CDF1" }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {mealSets.map((set, idx) => (
                <Card
                  key={set._id}
                  sx={{
                    flex: "1 1 320px",
                    maxWidth: 380,
                    textAlign: "center",
                    borderRadius: "24px",
                    p: 4,
                    position: "relative",
                    backgroundColor: "#FFFFFF",
                    boxShadow: idx === 1
                      ? "0 10px 40px rgba(114, 205, 241, 0.3)"
                      : "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: idx === 1 ? "3px solid #72CDF1" : "2px solid #f0f0f0",
                    transform: idx === 1 ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: idx === 1 ? "scale(1.08)" : "scale(1.03)",
                      boxShadow: "0 12px 45px rgba(114, 205, 241, 0.3)",
                    },
                  }}
                >
                  {idx === 1 && (
                    <Chip
                      label="PHỔ BIẾN NHẤT"
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#72CDF1",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}

                  <Typography
                    variant="h5"
                    fontWeight="700"
                    sx={{ mb: 3, color: "#333" }}
                  >
                    {set.title}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h3"
                      fontWeight="800"
                      sx={{ color: "#72CDF1", display: "inline" }}
                    >
                      {(set.price / 1000).toFixed(0)}K
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#999", display: "inline", ml: 1 }}
                    >
                      VND
                    </Typography>
                  </Box>

                  <Box
                    textAlign="left"
                    sx={{
                      mb: 4,
                      backgroundColor: "#F8FCFF",
                      borderRadius: "16px",
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        color: "#555",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: "#72CDF1",
                          fontWeight: 700,
                          mr: 1.5,
                          fontSize: "1.2rem",
                        }}
                      >
                        ✓
                      </Box>
                      Thời gian: {set.duration} ngày
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        color: "#555",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: "#72CDF1",
                          fontWeight: 700,
                          mr: 1.5,
                          fontSize: "1.2rem",
                        }}
                      >
                        ✓
                      </Box>
                      <span>{set.description}</span>
                    </Typography>
                    {set.extraInfo?.map((info, i) => (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          color: "#555",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#72CDF1",
                            fontWeight: 700,
                            mr: 1.5,
                            fontSize: "1.2rem",
                          }}
                        >
                          ✓
                        </Box>
                        <span>{info}</span>
                      </Typography>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/mealset/${set._id}`}
                    sx={{
                      py: 1.5,
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "1rem",
                      backgroundColor: idx === 1 ? "#72CDF1" : "#FFFFFF",
                      color: idx === 1 ? "#FFFFFF" : "#72CDF1",
                      border: idx === 1 ? "none" : "2px solid #72CDF1",
                      boxShadow: idx === 1 ? "0 4px 15px rgba(114, 205, 241, 0.4)" : "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#72CDF1",
                        color: "#FFFFFF",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(114, 205, 241, 0.4)",
                      },
                    }}
                  >
                    Mua ngay
                  </Button>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Recipes Section - IMPROVED */}
      <Container maxWidth="lg" sx={{ my: 10 }}>
        <Box textAlign="center" mb={6}>
          <Chip
            label="CÔNG THỨC NẤU ĂN"
            sx={{
              backgroundColor: "#B4E7CE",
              color: "#2D5F4C",
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#333",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Khám phá công thức
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Các công thức nấu ăn bổ dưỡng cho bé yêu
          </Typography>
        </Box>

        {loadingRecipes ? (
          <Box textAlign="center">
            <CircularProgress sx={{ color: "#72CDF1" }} />
          </Box>
        ) : (
          <>
            <Grid
              container
              spacing={4}
              sx={{
                mb: 5,
                justifyContent: "center",
              }}
            >
              {recipes.map((recipe) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={recipe._id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      height: 420,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "24px",
                      overflow: "hidden",
                      boxShadow: "0 6px 25px rgba(180, 231, 206, 0.25)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      border: "2px solid transparent",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: "0 15px 40px rgba(180, 231, 206, 0.4)",
                        border: "2px solid #B4E7CE",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 240,
                        overflow: "hidden",
                      }}
                    >
                      {recipe.images?.[0] && (
                        <CardMedia
                          component="img"
                          image={recipe.images[0]}
                          alt={recipe.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            "&:hover": { transform: "scale(1.15)" },
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "50%",
                          background: "linear-gradient(to top, rgba(180, 231, 206, 0.9) 0%, transparent 100%)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          backgroundColor: "#FFB4D6",
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(255, 180, 214, 0.4)",
                        }}
                      >
                        <Typography sx={{ fontSize: "1.5rem" }}>
                          🍽️
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent
                      sx={{
                        p: 3,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#2D5F4C",
                          mb: 2,
                          lineHeight: 1.4,
                          height: 56,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {recipe.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label="Bổ dưỡng"
                          size="small"
                          sx={{
                            backgroundColor: "#FFF4E6",
                            color: "#E67E22",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                        <Chip
                          label="Dễ làm"
                          size="small"
                          sx={{
                            backgroundColor: "#E8F5E9",
                            color: "#4CAF50",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
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
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  backgroundColor: "#B4E7CE",
                  color: "#2D5F4C",
                  borderRadius: "50px",
                  boxShadow: "0 6px 20px rgba(180, 231, 206, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#9DD9B8",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 28px rgba(180, 231, 206, 0.4)",
                  },
                }}
              >
                Xem thêm công thức
              </Button>
            </Box>
          </>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #72CDF1 0%, #5AB8E0 100%)",
          py: 6,
          textAlign: "center",
          mt: 8,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#FFFFFF", fontWeight: 500 }}
        >
          © 2025 Baby Food Blog. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.8)", mt: 1 }}
        >
          Dinh dưỡng tốt nhất cho bé yêu của bạn
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;