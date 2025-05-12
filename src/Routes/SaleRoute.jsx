import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../Pages/Common/spinner";
// import ProtectedRoute from "./ProtectSaleRoute";

const SaleCourse_Page = React.lazy(() =>
  import("../Components/Sale/SaleCourse")
);
const CoursePayment_Page = React.lazy(() =>
  import("../Components/Sale/CoursePayment")
);
const Success_Page = React.lazy(() => import("../Components/Sale/SuccessPage"));

function SaleRoute() {
  return (
    <Suspense
      fallback={
        <div>
          {" "}
          <Spinner />{" "}
        </div>
      }
    >
      <Routes>
        <Route path="/sales-page/:type/:id" element={<SaleCourse_Page />} />
        <Route
          path="/checkout-page/:type/:id"
          element={<CoursePayment_Page />}
        />
        <Route path="/payment-success" element={<Success_Page />} />
      </Routes>
    </Suspense>
  );
}

export default SaleRoute;
