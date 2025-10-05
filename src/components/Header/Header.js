import React, { useState } from "react";
import "./Header.css";
import {
  Typography,
  Button,
  Box,
  MenuItem,
  Menu,
  Badge,
  Popper,
  Fade,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagIcon from "@mui/icons-material/Flag";
import PhoneIcon from "@mui/icons-material/Phone";
import AuthService from "../../services/AuthService";

const Header = ({
  userEmail,
  updateUserEmail,
  wishlistCount = 0,
  updateWishlistCount,
}) => {
  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const handleOpenMenu = (event) => setAnchorEl2(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl2(null);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      localStorage.clear();
      sessionStorage.clear();
      updateUserEmail(null);
      if (typeof updateWishlistCount === "function") updateWishlistCount(0);
      navigate("/account/login");
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    }
  };

  const handleUserMenuMouseEnter = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuMouseLeave = () => setUserMenuAnchorEl(null);

  const userMenuOpen = Boolean(userMenuAnchorEl);

  return (
    <Box className="sticky-header">
      <div className="nav-bar-container">
        <Box className="nav-bar">
          {/* --- Logo --- */}
          <Box className="nav-logo">
            <img src="/NB (2).png" alt="logo" />
            <Typography component={Link} to="/" className="logo-text">
              NewBooks
            </Typography>
          </Box>

          {/* --- Menu giữa --- */}
          <Box className="nav-center">
            <Button className="custom-icon-button" component={Link} to="/quiz">
              <Typography variant="body2" className="custom-typography">
                Quiz
              </Typography>
            </Button>

            <Button className="custom-icon-button" component={Link} to="/about">
              <Typography variant="body2" className="custom-typography">
                Về chúng tôi
              </Typography>
            </Button>
          </Box>

          {/* --- Menu phải --- */}
          <div className="nav-buttons">
            {userEmail ? (
              <Box
                className="user-menu-container"
                onMouseEnter={handleUserMenuMouseEnter}
                onMouseLeave={handleUserMenuMouseLeave}
              >
                <Button className="custom-icon-button">
                  <PersonPinOutlinedIcon className="custom-icon" />
                  <Typography
                    variant="body2"
                    className="cart-text custom-typography"
                  >
                    {userEmail.split("@")[0]}
                  </Typography>
                </Button>

                {/* 🔽 Popper menu trượt xuống */}
                <Popper
                  open={userMenuOpen}
                  anchorEl={userMenuAnchorEl}
                  placement="bottom-start"
                  transition
                  className="user-menu-popper"
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={250}>
                      <Paper
                        className="user-menu-list"
                        elevation={3}
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          overflow: "hidden",
                          minWidth: 180,
                        }}
                      >
                        <MenuItem
                          component={Link}
                          to="/user/profile"
                          className="user-menu-item"
                        >
                          Tài khoản của tôi
                        </MenuItem>
                        <MenuItem onClick={handleLogout} className="user-menu-item">
                          Thoát tài khoản
                        </MenuItem>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            ) : (
              <Button
                className="custom-icon-button"
                component={Link}
                to="/account/login"
              >
                <PersonPinOutlinedIcon className="custom-icon" />
                <Typography variant="body2" className="cart-text custom-typography">
                  Đăng nhập
                </Typography>
              </Button>
            )}

            <Button
              className="custom-icon-button"
              component={Link}
              to="/user/wishlist"
            >
              <Badge
                badgeContent={userEmail ? wishlistCount : 0}
                color="error"
                showZero
              >
                <FavoriteBorderIcon className="custom-icon" />
              </Badge>
            </Button>

            <Box className="more-menu-container">
              <Button onClick={handleOpenMenu}>
                <MoreVertIcon className="custom-icon" />
              </Button>

              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleCloseMenu}
                className="more-menu"
              >
                <MenuItem
                  onClick={handleCloseMenu}
                  component={Link}
                  to="/user/refund"
                  className="more-menu-item user-menu-item"
                >
                  <FlagIcon className="more-menu-icon" />
                  Hoàn trả
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={Link}
                  to="/user/complaint"
                  className="more-menu-item user-menu-item"
                >
                  <FlagIcon className="more-menu-icon" />
                  Khiếu nại
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} className="more-menu-item">
                  <PhoneIcon />
                  <Typography>0123123123</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default Header;
