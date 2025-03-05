import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./Routes/UserRoute"; 
import AdminRoute from "./Routes/AdminRoute"; 
import SaleRoute from "./Routes/SaleRoute"
import {initFacebookPixel} from "./Utils/metaPixel"
import { useEffect } from "react";



function App() {
  useEffect(() => {
    if (!window.fbq) {
        initFacebookPixel();
    } else {
        console.warn("Meta Pixel already exists.");
    }
}, []); // ✅ Empty array ensures it runs only on mount

  
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
