import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedAuth from "./ProtectedAuth";
import ProtectedRoute from "./ProtectedRoute";
import Set_Password from "../Components/User/SetPassword";
import ExploreBuyPage from "../Components/User/ExploreBuyPage";
import ExploreCheckoutPage from "../Components/User/ExploreCheckout_page"
import Success_Page from "../Components/User/SuccessPage"
// import PageNotFound from "../Pages/Common/PageNotFound";

const Signin = React.lazy(() => import("../Components/User/Signin"));
const Signup = React.lazy(() => import("../Components/User/Signup"));
const OTP = React.lazy(() => import("../Components/User/Otp"));
const LandingPage = React.lazy(() => import("../Components/User/LandingPage"));
const Email_password = React.lazy(() =>
  import("../Components/User/ForgetPassword_Email")
);
const Otp_password = React.lazy(() =>
  import("../Components/User/ForgetPassword_Otp")
);
const Reset_password = React.lazy(() =>
  import("../Components/User/Resetpassword")
);
const HomePage = React.lazy(() => import("../Components/User/Home"));
const LearningPage = React.lazy(() => import("../Components/User/LearnigPage"));
const ExplorePage = React.lazy(() => import("../Components/User/Explore"));

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
        path="/learn/:Id/module/:moduleId/lectures/:lectureIndex"
        element={
          <ProtectedRoute>
            <LearningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-buy-details/:userId/:courseId"
        element={
          <ProtectedRoute>
            <ExploreBuyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore/checkout/:courseId"
        element={
          <ProtectedRoute>
            <ExploreCheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <Success_Page />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default UserRoute;
