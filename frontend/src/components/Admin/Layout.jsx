import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

 useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;

   if (width >= 1440) {
  // Large desktop
  setCollapsed(false);
} else {
  // Laptop, tablet, mobile
  setCollapsed(true);
}
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div className="flex min-h-screen bg-slate-50">

     <Sidebar
  collapsed={collapsed}
  sidebarOpen={sidebarOpen}
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
             collapsed ? "pl-20" : "pl-72"
        }`}
      >
        <Header
  title={title}
  onMenuClick={() => {
    setSidebarOpen(!sidebarOpen);
  }}
/>
        <main className="flex-1 mt-12 pt-24 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;