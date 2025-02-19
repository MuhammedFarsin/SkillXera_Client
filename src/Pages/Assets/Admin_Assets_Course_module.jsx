import ModuleTable from "./Table/moduleTable"
import Admin_Navbar from "../Common/AdminNavbar";
import ToastHot from "../Common/ToasterHot";
function Admin_Assets_Course_module() {
  return (
    <div>
      <Admin_Navbar />
      <ModuleTable/>
      <ToastHot />
    </div>
  )
}

export default Admin_Assets_Course_module
