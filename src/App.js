import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import HomePage from "./pages/HomePage/HomePage";
import AdminLayout from "./components/Adminlayout/AdminLayout.js";
import Header from "./components/Header/Header";
import BookList from "./pages/Admin/BookManagement/BookList.js";
import BookFormPage from "./pages/Admin/BookManagement/BookFormPage.js";
import CategoryManagementPage from "./pages/Admin/CategoryManagement/CategoryManagementPage.js";
import UserManagement from "./pages/Admin/UserManagrment/UserManagement.js";
import FeedbackManagement from "./pages/Admin/FeedbackManagement/FeedbackManagement.js";
import OrderManagement from "./pages/Admin/OrderManagement/OrderManagement.js";
import Profile from "./pages/Profile/Profile.js";
import ChangePassword from "./pages/Profile/ChangePassword.js";
import TrackOrderPage from "./pages/TrackOrder/TrackOrderPage.js";
import OrderDetailPage from "./pages/TrackOrder/OrderDetailPage.js";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.js";
import ComplaintPage from "./pages/ComplaintPage/ComplaintPage.js";
import Refund from "./pages/Refund/Refund.js";
import ComplaintManagement from "./pages/Admin/ComplaintManagement/ComplaintManagement.js";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.js";
import ScrollToTop from "./utils/ScrollToTop.js";
import AdminBlogs from "./pages/Admin/BlogMangement/blog.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MealSetManagement from "./pages/Admin/MealSetManagement/MealSetManagement.js";
import Quiz from "./pages/Quiz/Quiz";
import PaymentResult from "./pages/Quiz/PaymentResult.js";
import AdminFood from "./pages/Admin/FoodManagement/FoodManagement.js";
import AdminBlogCategory from "./pages/Admin/BlogCategoryManagement/BlogCategoryManagement.js";
import BlogPage from "./pages/BlogReview/BlogPage.js";
import BlogDetail from "./pages/ReviewDetail/BlogDetail.js";
import AboutUs from "./components/AboutUs.js";
import SetDetail from "./pages/SetDetail/SetDetail.js";
import SocialButtons from "./components/SocialButtons.js";
const AdminRoute = ({ children }) => {
  const userRole =
    localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
  const isAuthenticated =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (!isAuthenticated || userRole !== "admin") {
    return <Navigate to="/account/login" replace />;
  }

  return children;
};

const UserOnlyRoute = ({ children }) => {
  const userRole =
    localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

  if (userRole === "admin") {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const noFooterRoutes = [
    "/user/profile",
    "/user/change-password",
    "/user/complaint",
    "/user/refund",
    "/track-order",
  ];

  const shouldHideFooter = noFooterRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(route + "/")
  );

  useEffect(() => {
    const storedEmail =
      localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    const storedRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const storedName =
      localStorage.getItem("userName") || sessionStorage.getItem("userName");
    setUserName(storedName);
    setUserEmail(storedEmail);
    setUserRole(storedRole);
  }, []);

  const updateUserEmail = (email, role = null) => {
    setUserEmail(email);
    if (role) {
      setUserRole(role);
    }

    if (email) {
    } else {
      // If user logs out, reset counts
      setUserRole(null);
    }
  };


  return (
    <>
      {!isAdminRoute && (
        <Header
          userEmail={userEmail}
          userName={userName}
          updateUserEmail={updateUserEmail}
        />
      )}

      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="products">
            <Route index element={<BookList />} />
            <Route path="add" element={<BookFormPage />} />
            <Route path=":id/edit" element={<BookFormPage />} />
          </Route>
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="meal-set" element={<MealSetManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="feedbacks" element={<FeedbackManagement />} />

          <Route path="orders" element={<OrderManagement />} />
          <Route path="complaints" element={<ComplaintManagement />} />
          <Route path="feedbacks" element={<FeedbackManagement />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="foods" element={<AdminFood />} />
          <Route path="blog-categories" element={<AdminBlogCategory />} />
        </Route>
        <Route
          path="/account/login"
          element={<Login onLoginSuccess={updateUserEmail} />}
        />
        <Route path="/account/register" element={<Register />} />
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/mealset/:id"
          element={
            <SetDetail
            />
          }
        />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/payment-success" element={<PaymentResult />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/account/forgotpassword" element={<ForgotPassword />} />
        <Route path="/user/complaint" element={<ComplaintPage />} />
        <Route path="/user/refund" element={<Refund />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/user/change-password"
          element={
            <UserOnlyRoute>
              <ChangePassword />
            </UserOnlyRoute>
          }
        />
        <Route
          path="/track-order"
          element={
            <UserOnlyRoute>
              <TrackOrderPage />
            </UserOnlyRoute>
          }
        />
        <Route
          path="/track-order/:orderId"
          element={
            <UserOnlyRoute>
              <OrderDetailPage />
            </UserOnlyRoute>
          }
        />

      </Routes>

      {!isAdminRoute && !shouldHideFooter && (
        <>
          <SocialButtons />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
