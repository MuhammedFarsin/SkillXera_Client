import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./Routes/UserRoute"; 
import AdminRoute from "./Routes/AdminRoute"; 
import SaleRoute from "./Routes/SaleRoute"

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/*" element={<UserRoute/>} />     
          <Route path="/admin/*" element={<AdminRoute/>} />     
          <Route path="/sale/*" element={<SaleRoute/>} />     
        </Routes>
    </Router>
  );
}

export default App;
