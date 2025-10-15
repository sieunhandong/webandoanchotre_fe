import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FeedbackIcon from "@mui/icons-material/Feedback";
import RateReview from "@mui/icons-material/RateReview";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";

import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen }) => {
  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, link: "/admin/dashboard" },
    { text: "Quản lý người dùng", icon: <PeopleIcon />, link: "/admin/users" },
    { text: "Quản lý sản phẩm", icon: <MenuBookIcon />, link: "/admin/products" },
    {
      text: "Quản lý danh mục",
      icon: <CategoryIcon />,
      link: "/admin/categories",
    },
    {
      text: "Quản lý đơn hàng",
      icon: <ReceiptLongIcon />,
      link: "/admin/orders",
    },
    {
      text: "Quản lý Set Ăn",
      icon: <PeopleIcon />,
      link: "/admin/meal-set",
    },
    {
      text: "Quản lý món ăn",
      icon: <PeopleIcon />,
      link: "/admin/foods",
    },
    {
      text: "Quản lý đánh giá",
      icon: <StarIcon />,
      link: "/admin/feedbacks",
    },
    {
      text: "Quản lý khiếu nại",
      icon: <FeedbackIcon />,
      link: "/admin/complaints",
    },
    {
      text: "Quản lý danh mục Blog",
      icon: <RateReview />,
      link: "/admin/blog-categories",
    },
    {
      text: "Quản lý Blog",
      icon: <RateReview />,
      link: "/admin/blogs",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: isSidebarOpen ? 240 : 72,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 240 : 72,
          transition: "width 0.3s ease, box-shadow 0.3s ease",
          overflowX: "hidden",
          backgroundColor: "#2c3e50",
          color: "white",
          boxShadow: isSidebarOpen ? "4px 0 20px rgba(0,0,0,0.1)" : "none",
        },
      }}
    >
      <List sx={{ width: "100%", paddingTop: 0 }}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">{isSidebarOpen ? "TinnyYummy" : "TY"}</h1>
        </div>

        {menuItems.map((item) => (
          <Tooltip
            title={!isSidebarOpen ? item.text : ""}
            placement="right"
            key={item.text}
            arrow
          >
            <ListItem
              component={Link}
              to={item.link}
              className="sidebar-item"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#34495e",
                },
                paddingY: 1,
                paddingX: isSidebarOpen ? 2 : 1,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: isSidebarOpen ? "40px" : "auto",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isSidebarOpen && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: "white",
                    "& .MuiTypography-root": {
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    },
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
