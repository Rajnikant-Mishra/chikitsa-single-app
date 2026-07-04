import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Auth/login";
import Dashboard from "./components/Admin/Dashboard";
import ForgotPassword from "./components/Auth/ForgotPassword";

import Inventorylist from "./components/inventory/InventoryList";
import RentalMaster from "./components/rentalMaster/RentalMasterList";
import RentalMasterForm from "./components/rentalMaster/RentalMasterForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />

        <Route path="/inventory" element={<Inventorylist />} />
        <Route path="/rental-master" element={<RentalMaster />} /> 
        <Route path="/rental-master-form" element={<RentalMasterForm />} />
      </Routes>
    </Router>
  );
}

export default App;
