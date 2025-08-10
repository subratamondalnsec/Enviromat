import React, { useEffect } from "react";
// import OpenRoute from "./components/core/Auth/OpenRoute";
// import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Navbar from './components/common/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SIgnUp';
import Error from './Pages/Error';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import UpdatePassword from './Pages/UpdatePassword';
import VerifyEmail from './Pages/VerifyEmail';
import ForgotPassword from './Pages/ForgotPassword';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './slices/profileSlice';
import { setToken } from './slices/authSlice';

import About from './Pages/About';
import Community from './Pages/Community';  
import Services from './Pages/Services';
import Shop from './Pages/Shop';
import UserProfile from './Pages/UserProfile';
import PickupDashboard from './Pages/PickupDashboard';
// import PickerProfile from './components/core';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth || {});
  const { user } = useSelector((state) => state.profile || {});

  // Initialize authentication state from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && !token) {
      try {
        dispatch(setToken(JSON.parse(storedToken)));
      } catch (error) {
        console.error("Invalid token in localStorage:", error);
        localStorage.removeItem("token");
      }
    }

    if (storedUser && !user) {
      try {
        dispatch(setUser(JSON.parse(storedUser)));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch, token, user]);
  
  const hideNavbar = location.pathname === '/login' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/verify-email' || 
                    location.pathname === '/forgot-password' ||
                    location.pathname.startsWith('/update-password/') || 
                    location.pathname === '/pickup-dashboard' ||
                    location.pathname === '/picker-profile'; 

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && (
        <div className="fixed w-full z-50">
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="update-password/:id" element={<UpdatePassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="about" element={<About />} />
        <Route path="community" element={<Community />} />
        <Route path="services" element={<Services />} />
        <Route path="shop" element={<Shop />} />
        {/* User routes */}
        <Route path="user-profile" element={<UserProfile />} />
        {/* Picker routes */}
        <Route path="pickup-dashboard" element={<PickupDashboard />} />
        {/* <Route path="picker-profile" element={<PickerProfile />} /> */}

        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
