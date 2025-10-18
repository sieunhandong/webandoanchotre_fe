// src/components/BreadCrumb/AccountLayout.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Person as PersonIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import "./AccountLayout.css";

export default function AccountLayout({ user, children }) {
  const location = useLocation();

  return (
    <div className="account-layout__container">
      <aside className="account-layout__sidebar">
        <div className="account-layout__user-info">
          <div className="account-layout__avatar-circle">
            {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
          </div>
          <div className="account-layout__user-name">{user?.name || "Tài khoản"}</div>
        </div>

        <ul className="account-layout__nav-list">
          <li
            className={
              location.pathname === "/user/profile"
                ? "account-layout__nav-item account-layout__nav-item--active"
                : "account-layout__nav-item"
            }
          >
            <Link to="/user/profile">
              <PersonIcon /> Thông tin
            </Link>
          </li>
          <li
            className={
              location.pathname === "/user/change-password"
                ? "account-layout__nav-item account-layout__nav-item--active"
                : "account-layout__nav-item"
            }
          >
            <Link to="/user/change-password">
              <SecurityIcon /> Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </aside>

      <main className="account-layout__main-panel">{children}</main>
    </div>
  );
}
