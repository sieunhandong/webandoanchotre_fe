import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QuizIcon from "@mui/icons-material/Quiz";
import InfoIcon from "@mui/icons-material/Info";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import "./Header.css";
const Header = ({ userEmail, updateUserEmail }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      updateUserEmail(null);
      setDrawerOpen(false);
      handleMoreMenuClose();
      navigate("/account/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
    handleMoreMenuClose();
  };

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  // Mobile menu items
  const mobileMenuItems = [
    { text: "Quiz", icon: <QuizIcon />, path: "/quiz" },
    { text: "Về chúng tôi", icon: <InfoIcon />, path: "/about-us" },
    { text: "Blog", icon: <ArticleIcon />, path: "/blog" },
    ...(userEmail ? [
      { divider: true },
      { text: "Thông tin cá nhân", icon: <PersonIcon />, path: "/user/profile" },
      { text: "Đơn hàng của tôi", icon: <ShoppingBagIcon />, path: "/track-order" },
      { text: "Phản hồi", icon: <FeedbackIcon />, path: "/user/refund" },
      { text: "Khiếu lại", icon: <ReportProblemIcon />, path: "/user/complaint" },
    ] : []),
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "linear-gradient(180deg, #72CCF1 0%, #B4E4FF 100%)",
        color: "#fff",
      }}
      role="presentation"
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {userEmail ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: "#72CCF1",
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: "1.25rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {firstLetter}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                {userEmail.split("@")[0]}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                {userEmail}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
        )}
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{ color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

      {/* Menu Items */}
      <List sx={{ px: 1, py: 2 }}>
        {mobileMenuItems.map((item, index) => {
          if (item.divider) {
            return (
              <Divider
                key={`divider-${index}`}
                sx={{ my: 1.5, borderColor: "rgba(255, 255, 255, 0.2)" }}
              />
            );
          }
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    transform: "translateX(8px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Logout button */}
        {userEmail && (
          <>
            <Divider sx={{ my: 1.5, borderColor: "rgba(255, 255, 255, 0.2)" }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255, 107, 107, 0.3)",
                    transform: "translateX(8px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Đăng xuất"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PhoneIcon sx={{ fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          0969729035
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #72CCF1 0%, #5BAED8 100%)",
          boxShadow: "0 4px 20px rgba(114, 204, 241, 0.3)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/NB (2).png"
              alt="Baby Food Logo"
              sx={{
                height: { xs: 50, md: 70 },
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.08) rotate(-2deg)",
                },
              }}
            />
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                component={Link}
                to="/quiz"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                Quiz
              </Button>
              <Button
                component={Link}
                to="/about-us"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                Về chúng tôi
              </Button>
              <Button
                component={Link}
                to="/blog"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                Blog
              </Button>
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Desktop User Section */}
            {!isMobile && (
              <>
                {userEmail ? (
                  <Button
                    component={Link}
                    to="/user/profile"
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.25)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#fff",
                        color: "#72CCF1",
                        width: 32,
                        height: 32,
                        fontSize: "0.9rem",
                        fontWeight: 700,
                      }}
                    >
                      {firstLetter}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
                      {userEmail.slice(0, 8)}...
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to="/account/login"
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.25)",
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                )}

                {/* More Menu */}
                <IconButton
                  onClick={handleMoreMenuOpen}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>

                <Menu
                  anchorEl={moreMenuAnchor}
                  open={Boolean(moreMenuAnchor)}
                  onClose={handleMoreMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 200,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {userEmail && (
                    <>
                      <MenuItem onClick={() => handleNavigation("/track-order")}>
                        <ListItemIcon>
                          <ShoppingBagIcon fontSize="small" />
                        </ListItemIcon>
                        Đơn hàng của tôi
                      </MenuItem>
                      <Divider />
                    </>
                  )}
                  <MenuItem onClick={() => handleNavigation("/user/refund")}>
                    <ListItemIcon>
                      <FeedbackIcon fontSize="small" />
                    </ListItemIcon>
                    Phản hồi
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation("/user/complaint")}>
                    <ListItemIcon>
                      <ReportProblemIcon fontSize="small" />
                    </ListItemIcon>
                    Khiếu lại
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled>
                    <ListItemIcon>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    0969729035
                  </MenuItem>
                  {userEmail && (
                    <>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        Đăng xuất
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;