import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./ProtectSaleRoute";

const SaleCourse_Page = React.lazy(() => import("../Components/Sale/SaleCourse"));
const CoursePayment_Page = React.lazy(() => import("../Components/Sale/CoursePayment"));
const Success_Page = React.lazy(() => import("../Components/Sale/SuccessPage"));

function SaleRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/buy-course/course/:courseId" element={<SaleCourse_Page />} />
        <Route path="/buy-course/course/payment/:courseId" element={<CoursePayment_Page />} />
        <Route
          path="/payment-success"
          element={
            // <ProtectedRoute>
              <Success_Page />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default SaleRoute;
