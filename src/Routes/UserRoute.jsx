import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedAuth from "./ProtectedAuth";
import ProtectedRoute from "./ProtectedRoute";
import Set_Password from "../Components/User/SetPassword"
// import PageNotFound from "../Pages/Common/PageNotFound";

const Signin = React.lazy(() => import("../Components/User/Signin"));
const Signup = React.lazy(() => import("../Components/User/Signup"));
const OTP = React.lazy(() => import("../Components/User/Otp"));
const LandingPage = React.lazy(() => import("../Components/User/LandingPage"));
const Email_password = React.lazy(() => import("../Components/User/ForgetPassword_Email"));
const Otp_password = React.lazy(() => import("../Components/User/ForgetPassword_Otp"));
const Reset_password = React.lazy(() => import("../Components/User/Resetpassword"));
const HomePage = React.lazy(() => import("../Components/User/Home"));
const ExplorePage = React.lazy(() => import("../Components/User/ExplorePage"));

function UserRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAuth>
            <LandingPage />
          </ProtectedAuth>
        }
      />
      <Route
        path="/signin"
        element={
          <ProtectedAuth>
            <Signin />
          </ProtectedAuth>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedAuth>
            <Signup />
          </ProtectedAuth>
        }
      />
      <Route
        path="/otp"
        element={
          <ProtectedAuth>
            <OTP />
          </ProtectedAuth>
        }
      />
      <Route
        path="/forget-password-mail"
        element={
          <ProtectedAuth>
            <Email_password />
          </ProtectedAuth>
        }
      />
      <Route
        path="/forget-password-otp"
        element={
          <ProtectedAuth>
            <Otp_password />
          </ProtectedAuth>
        }
      />
      <Route
        path="/resetpassword"
        element={
          <ProtectedAuth>
            <Reset_password />
          </ProtectedAuth>
        }
      />
      <Route
        path="/set-password"
        element={
          <ProtectedAuth>
            <Set_Password />
          </ProtectedAuth>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/explore/:courseId/module/:moduleId/lecture/:lectureIndex"
  element={
    <ProtectedRoute>
      <ExplorePage />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default UserRoute;
