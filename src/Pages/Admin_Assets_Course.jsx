import Admin_Navbar from "./Common/AdminNavbar";
import ToastHot from "./Common/ToasterHot";
import CourseTable from "./Table/courseTable";

function Admin_Assets_Course() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Admin_Navbar />
      <CourseTable />
      <ToastHot />
    </div>
  );
}

export default Admin_Assets_Course;
