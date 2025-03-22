import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./Routes/UserRoute"; 
import AdminRoute from "./Routes/AdminRoute"; 
import SaleRoute from "./Routes/SaleRoute"
import TermsAndCondition from './Components/TermAndCondition'
import PrivacyAndPolicy  from "./Components/Policy"
import ShippingDeliveryPolicy from "./Components/ShippingDeliveryPolicy"
import RefundCancellation from "./Components/RefundCancellationPolicy"
import AboutUs from "./Components/AboutUs"
import ContactUs from "./Components/ContactUs"
import { useEffect } from "react";
import { initFacebookPixel } from "./utils/metaPixel";



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
          <Route path="/terms" element={<TermsAndCondition/>} />     
          <Route path="/privacy" element={<PrivacyAndPolicy/>} />     
          <Route path="/refund" element={<RefundCancellation/>} />     
          <Route path="/shipping" element={<ShippingDeliveryPolicy/>} />     
          <Route path="/about" element={<AboutUs/>} />     
          <Route path="/contact" element={<ContactUs/>} />     
        </Routes>
    </Router>
  );
}

export default App;
