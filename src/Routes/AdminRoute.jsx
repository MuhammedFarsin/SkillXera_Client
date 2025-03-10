import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import PageNotFound from "../Pages/Common/PageNotFound";
const Dashboard_Page = React.lazy(() =>
  import("../Components/Admin/Dashboard")
);
const Contact_Page = React.lazy(() => import("../Components/Admin/Contact"));
const Courses_Page = React.lazy(() => import("../Components/Admin/Courses"));
import AddCourse from "../Components/Admin/AddCourse"
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
