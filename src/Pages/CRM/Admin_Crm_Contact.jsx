import Admin_Navbar from "../Common/AdminNavbar"
import Contact_Table from "./Table/ContactTable"
import ToastHot from "../Common/ToasterHot"
function Admin_Crm_Contact() {
  return (
    <div>
      {/* <Admin_Navbar/> */}
      <Contact_Table/>
      <ToastHot/>
    </div>
  )
}

export default Admin_Crm_Contact
