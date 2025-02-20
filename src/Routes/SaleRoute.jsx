import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const SaleCourse_Page = React.lazy(() => import("../Components/Sale/SaleCourse"));
const CoursePayment_Page = React.lazy(() => import("../Components/Sale/CoursePayment"));

function SaleRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/buy-course/course/:courseId" element={<SaleCourse_Page />} />
        <Route path="/buy-course/course/payment/:courseId" element={<CoursePayment_Page />} />
      </Routes>
    </Suspense>
  );
}

export default SaleRoute;
