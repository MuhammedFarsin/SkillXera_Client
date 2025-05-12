import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import PageNotFound from "../Pages/Common/PageNotFound";
const Dashboard_Page = React.lazy(() =>
  import("../Components/Admin/Dashboard")
);
const Contact_Page = React.lazy(() => import("../Components/Admin/Contact"));
const Courses_Page = React.lazy(() => import("../Components/Admin/Courses"));
import AddCourse from "../Components/Admin/AddCourse";
import AddSalesPage from "../Components/Admin/SalesPage";
import EditCourse from "../Components/Admin/EditCourse";
import EditSalesPage from "../Components/Admin/EditSalesPage";
import AddDigitalProduct from "../Components/Admin/AddDigitalProductPage";
import AddCheckout from "../Components/Admin/AddCheckout";
import EditDigitalProduct from "../Components/Admin/EditDigitalProductPage";
const Files_Page = React.lazy(() => import("../Components/Admin/Files"));
const Tag_Page = React.lazy(() => import("../Components/Admin/Tag"));
const Transaction_Page = React.lazy(() =>
  import("../Components/Admin/Transactions")
);
const UserProfile_Page = React.lazy(() =>
  import("../Components/Admin/UserProfile")
);
const Module_Page = React.lazy(() => import("../Components/Admin/Module"));
const Lecture_Page = React.lazy(() => import("../Components/Admin/Lectures"));
function AdminRoute() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm/contact"
        element={
          <ProtectedRoute>
            <Contact_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm/tag"
        element={
          <ProtectedRoute>
            <Tag_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/courses"
        element={
          <ProtectedRoute>
            <Courses_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/course/add-course"
        element={
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/create-sales-page/:type/:id"
        element={
          <ProtectedRoute>
            <AddSalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/edit-sales-page/:type/:id"
        element={
          <ProtectedRoute>
            <EditSalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/add-checkoutPage/:type/:id"
        element={
          <ProtectedRoute>
            <AddCheckout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/course/edit-course/:courseId"
        element={
          <ProtectedRoute>
            <EditCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/courses/module/:courseId"
        element={
          <ProtectedRoute>
            <Module_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/courses/watch-lecture/:courseId/:moduleId/:lectureIndex"
        element={
          <ProtectedRoute>
            <Lecture_Page />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assets/files"
        element={
          <ProtectedRoute>
            <Files_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/file/add-digital-product-page"
        element={
          <ProtectedRoute>
            <AddDigitalProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/file/edit-digital-product-page/:id"
        element={
          <ProtectedRoute>
            <EditDigitalProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales/transactions"
        element={
          <ProtectedRoute>
            <Transaction_Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile_Page />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminRoute;
