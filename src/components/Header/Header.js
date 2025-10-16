import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import AuthService from "../../services/AuthService";

const Header = ({
  userEmail,
  updateUserEmail,
  updateWishlistCount,
}) => {
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  // ✅ Lấy userName từ localStorage hoặc sessionStorage
  useEffect(() => {
    const storedName =
      localStorage.getItem("userName") || sessionStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      localStorage.clear();
      sessionStorage.clear();
      updateUserEmail(null);
      if (typeof updateWishlistCount === "function") updateWishlistCount(0);
      navigate("/account/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  const toggleMoreMenu = () => setIsMoreMenuOpen(!isMoreMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Avatar: chữ cái đầu của userName hoặc 'U' nếu chưa có
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky-header">
      <div className="nav-bar-container">
        <div className="nav-bar">
          {/* Logo */}
          <div className="nav-logo">
            <Link to="/" className="logo-text">
              <img src="/NB (2).png" alt="Baby Food Logo" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Center Menu */}
          <nav className={`nav-center ${isMobileMenuOpen ? "open" : ""}`}>
            <Link to="/quiz" className="nav-link" onClick={handleMobileLinkClick}>Quiz</Link>
            <Link to="/about-us" className="nav-link" onClick={handleMobileLinkClick}>Về chúng tôi</Link>
            <Link to="/blog" className="nav-link" onClick={handleMobileLinkClick}>Blog</Link>
          </nav>

          {/* Right Menu */}
          <div className={`nav-buttons ${isMobileMenuOpen ? "open" : ""}`}>
            {userEmail ? (
              <div className="user-menu-container">
                <button
                  className="nav-button user-button"
                  onClick={toggleUserMenu}
                >
                  <span className="user-avatar">{firstLetter}</span>
                  <span className="cart-text">{userEmail || "User"}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="user-menu">
                    <Link to="/track-order" className="menu-item" onClick={handleMobileLinkClick}>Đơn hàng của tôi</Link>
                    <Link to="/user/profile" className="menu-item" onClick={handleMobileLinkClick}>Thông tin cá nhân</Link>
                    <button onClick={handleLogout} className="menu-item">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/account/login" className="nav-button" onClick={handleMobileLinkClick}>
                <span className="cart-text">Đăng nhập</span>
              </Link>
            )}

            <div className="more-menu-container">
              <button className="nav-button" onClick={toggleMoreMenu}>
                <span className="more-icon">⋮</span>
              </button>
              {isMoreMenuOpen && (
                <div className="more-menu">
                  <Link to="/user/refund" className="menu-item" onClick={handleMobileLinkClick}>Refund</Link>
                  <Link to="/user/complaint" className="menu-item" onClick={handleMobileLinkClick}>Complaint</Link>
                  <div className="menu-item">
                    <span className="phone-icon">📞</span>
                    <span>0969729035</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
