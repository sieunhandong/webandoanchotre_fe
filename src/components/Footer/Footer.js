import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Divider, Link, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import './footer.css';

const Footer = () => {
  const quickLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Công thức', path: '/recipes' },
    { name: 'Blog', path: '/blog' },
    { name: 'Về chúng tôi', path: '/about-us' },
  ];

  const socialLinks = [
    { icon: <Facebook />, url: '#', color: '#1877F2', name: 'Facebook' },
    { icon: <Instagram />, url: '#', color: '#E4405F', name: 'Instagram' },
    { icon: <YouTube />, url: '#', color: '#FF0000', name: 'YouTube' },
    { icon: <Twitter />, url: '#', color: '#1DA1F2', name: 'Twitter' },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      url: '#',
      color: '#000000',
      name: 'TikTok'
    },
  ];

  return (
    <Box component="footer" className="tinyyummy-footer-main-wrapper">
      {/* Decorative Wave */}
      <Box className="tinyyummy-footer-decorative-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </Box>

      <Container maxWidth="xl" className="tinyyummy-footer-content-container">
        {/* Main Footer Content */}
        <Grid container spacing={4} className="tinyyummy-footer-main-grid">
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box className="tinyyummy-footer-brand-section">
              <Box className="tinyyummy-footer-brand-logo-wrapper">
                <Typography variant="h4" className="tinyyummy-footer-brand-name-text" sx={{ fontSize: "3rem", color: "#ffffff" }}>
                  TinyYummy
                </Typography>
                <Box className="tinyyummy-footer-brand-underline-decorator"></Box>
              </Box>

              <Typography variant="body1" className="tinyyummy-footer-brand-description-text" sx={{ fontSize: " 1.2rem", color: "#000000" }}>
                Đồng hành cùng ba mẹ trong hành trình ăn dặm, mang đến dinh dưỡng
                tốt nhất cho sự phát triển toàn diện của bé yêu.
              </Typography>

              {/* Social Media Box */}
              <Box className="tinyyummy-footer-social-connection-box">
                <Typography variant="h6" className="tinyyummy-footer-social-connection-title">
                  Kết nối với chúng tôi 💫
                </Typography>
                <Box className="tinyyummy-footer-social-media-section">
                  <Stack direction="row" spacing={1.5} className="tinyyummy-footer-social-links-stack">
                    {socialLinks.map((social, idx) => (
                      <IconButton
                        key={idx}
                        component="a"
                        href={social.url}
                        className="tinyyummy-footer-social-icon-button"
                        sx={{
                          '--social-color': social.color,
                          animationDelay: `${idx * 0.1}s`
                        }}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          {/* <Grid item xs={12} sm={6} md={4}>
            <Box className="tinyyummy-footer-quicklinks-section">
              <Typography variant="h6" className="tinyyummy-footer-section-title-text">
                <Box component="span" className="tinyyummy-footer-section-title-icon">🔗</Box>
                Liên kết nhanh
              </Typography>
              <Divider className="tinyyummy-footer-section-divider-line" />
              <Stack spacing={1.5} className="tinyyummy-footer-quicklinks-stack">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    component={RouterLink}
                    to={link.path}
                    className="tinyyummy-footer-navigation-link"
                    sx={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <Box component="span" className="tinyyummy-footer-navigation-link-arrow">→</Box>
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Box>
          </Grid> */}

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Box className="tinyyummy-footer-contact-info-section">
              <Typography variant="h6" className="tinyyummy-footer-section-title-text">
                <Box component="span" className="tinyyummy-footer-section-title-icon">📞</Box>
                Liên hệ
              </Typography>
              <Divider className="tinyyummy-footer-section-divider-line" />
              <Stack spacing={2.5} className="tinyyummy-footer-contact-info-stack">
                <Box className="tinyyummy-footer-contact-info-item">
                  <Box className="tinyyummy-footer-contact-info-icon">
                    <MapPin size={20} />
                  </Box>
                  <Box>
                    <Typography variant="body2" className="tinyyummy-footer-contact-info-label">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body2" className="tinyyummy-footer-contact-info-text">
                      FPT University, Hòa Lạc, Hà Nội
                    </Typography>
                  </Box>
                </Box>

                <Box className="tinyyummy-footer-contact-info-item">
                  <Box className="tinyyummy-footer-contact-info-icon">
                    <Phone size={20} />
                  </Box>
                  <Box>
                    <Typography variant="body2" className="tinyyummy-footer-contact-info-label">
                      Hotline
                    </Typography>
                    <Typography variant="body2" className="tinyyummy-footer-contact-info-text">
                      0969 729 035
                    </Typography>
                  </Box>
                </Box>

                <Box className="tinyyummy-footer-contact-info-item">
                  <Box className="tinyyummy-footer-contact-info-icon">
                    <Mail size={20} />
                  </Box>
                  <Box>
                    <Typography variant="body2" className="tinyyummy-footer-contact-info-label">
                      Email
                    </Typography>
                    <Typography variant="body2" className="tinyyummy-footer-contact-info-text">
                      tinyyummy03@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider className="tinyyummy-footer-bottom-divider-line" />
        <Box className="tinyyummy-footer-bottom-bar-wrapper">
          <Typography variant="body2" className="tinyyummy-footer-copyright-text">
            &copy; {new Date().getFullYear()} TinyYummy. All rights reserved.
          </Typography>
          <Box className="tinyyummy-footer-bottom-links-wrapper">
            <Link href="#" className="tinyyummy-footer-bottom-policy-link">Chính sách bảo mật</Link>
            <Box component="span" className="tinyyummy-footer-bottom-link-separator">•</Box>
            <Link href="#" className="tinyyummy-footer-bottom-policy-link">Điều khoản sử dụng</Link>
            <Box component="span" className="tinyyummy-footer-bottom-link-separator">•</Box>
            <Link href="#" className="tinyyummy-footer-bottom-policy-link">Cookie Policy</Link>
          </Box>
          <Typography variant="body2" className="tinyyummy-footer-made-with-love-text">
            Made with <Heart size={14} className="tinyyummy-footer-heartbeat-icon" /> for babies
          </Typography>
        </Box>
      </Container>

      {/* Floating Shapes */}
      <Box className="tinyyummy-footer-floating-shapes-container">
        <Box className="tinyyummy-footer-floating-shape tinyyummy-footer-floating-shape-1">🍎</Box>
        <Box className="tinyyummy-footer-floating-shape tinyyummy-footer-floating-shape-2">🥕</Box>
        <Box className="tinyyummy-footer-floating-shape tinyyummy-footer-floating-shape-3">🥦</Box>
        <Box className="tinyyummy-footer-floating-shape tinyyummy-footer-floating-shape-4">🍌</Box>
      </Box>
    </Box>
  );
};

export default Footer;