// import React, { useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import {
//   LayoutDashboard,
//   KeyRound,
//   FilePlus2,
//   Package,
//   FileBarChart,
//   BellRing,
//   ChevronDown,
//   Layers,
//   History,
//   Boxes,
//   Wrench,
//   FileSpreadsheet,
//   AlertTriangle,
//   LogOut,
// } from "lucide-react";

// // ==========================================
// // NAVIGATION CONFIGURATION DATA ARRAY
// // ==========================================
// const NAV_ITEMS = [
//   {
//     type: "flat",
//     label: "Rental Master",
//     icon: KeyRound,
//     path: "/rental-master",
//   },
//   {
//     type: "flat",
//     label: "Log New Requisition",
//     path: "/rental-master-form",
//     icon: FilePlus2,
//   },
//   {
//     type: "flat",
//     label: "Inventory & Assets",
//     path: "/inventory",
//     icon: Package,
//   },
//   {
//     type: "flat",
//     label: "Reports & Ledger",
//     dropdownKey: "reports",
//     icon: FileBarChart,
//     path: "/requisitions/new",
//   },
  
// ];

// // ==========================================
// // CORE SIDEBAR COMPONENT
// // ==========================================
// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Unified menu state tracking
//   const [openDropdowns, setOpenDropdowns] = useState({
//     rental: false,
//     inventory: false,
//     reports: false,
//   });

//   const toggleDropdown = (key) => {
//     setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const isSubRouteActive = (paths) => paths.includes(location.pathname);

//   // Common styling rules applied to elements
//   const activeStyles = "bg-white text-[#0e4a67] shadow-md";
//   const inactiveStyles = "text-white/80 hover:bg-white/10 hover:text-white";

//   return (
//     <aside className="w-72 bg-[#0e4a67] text-white flex flex-col justify-between h-screen fixed left-0 top-0 z-30 border-r border-white/10 shadow-[10px_0_40px_rgba(14,74,103,0.25)] select-none">
//       <div className="overflow-y-auto flex-1 no-scrollbar">
//         {/* Brand Header */}
//         <div className="h-20 flex items-center px-6 border-b border-white/10 bg-black/10 sticky top-0 z-20 backdrop-blur-md">
//           <div className="flex items-center space-x-3">
//             <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
//               <img
//                 src=""
//                 alt="chikitsaOne"
//                 className="w-6 h-6 object-contain filter brightness-0 invert"
//               />
//             </div>
//             <span className="text-xl font-black tracking-tighter text-white uppercase">
//               chikitsa<span className="text-cyan-200">One</span>
//             </span>
//           </div>
//         </div>

//         {/* Dynamic Multi-Tier Navigation Menu */}
//         <nav className="px-3 py-4 space-y-1.5">
//           {NAV_ITEMS.map((item, index) => {
//             const IconComponent = item.icon;

//             // Render Path A: Single Flat Menu Link
//             if (item.type === "flat") {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={index}
//                   to={item.path}
//                   className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
//                     isActive ? activeStyles : inactiveStyles
//                   }`}
//                 >
//                   <IconComponent
//                     size={16}
//                     className={isActive ? "text-[#0e4a67]" : "text-cyan-200"}
//                   />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             }

//             // Render Path B: Expandable Dropdown Container
//             if (item.type === "dropdown") {
//               const hasActiveChild = isSubRouteActive(item.subRoutes);
//               const isOpen = openDropdowns[item.dropdownKey];

//               return (
//                 <div key={index}>
//                   <button
//                     onClick={() => toggleDropdown(item.dropdownKey)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
//                       hasActiveChild
//                         ? "bg-white/10 text-white border border-white/10"
//                         : inactiveStyles
//                     }`}
//                   >
//                     <div className="flex items-center gap-3.5">
//                       <IconComponent size={16} className="text-cyan-200" />
//                       <span>{item.label}</span>
//                     </div>
//                     <ChevronDown
//                       size={14}
//                       className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {/* Dropdown Link Tray */}
//                   <div
//                     className={`mt-1 pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
//                       isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
//                     }`}
//                   >
//                     {item.children.map((child, childIndex) => {
//                       const ChildIcon = child.icon;
//                       const isChildActive = location.pathname === child.path;

//                       return (
//                         <Link
//                           key={childIndex}
//                           to={child.path}
//                           className={`flex items-center gap-3 px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-colors duration-150 ${
//                             isChildActive
//                               ? "bg-white/20 text-white"
//                               : "text-white/70 hover:text-white hover:bg-white/5"
//                           }`}
//                         >
//                           <ChildIcon size={12} />
//                           <span>{child.label}</span>
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             }

//             return null;
//           })}
//         </nav>
//       </div>

//       {/* Disconnect System Control Panel */}
//       <div className="p-4 border-t border-white/10 bg-black/10 sticky bottom-0 z-20">
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             navigate("/login");
//           }}
//           className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-rose-600 text-white border border-white/10 font-bold text-xs uppercase tracking-widest transition-all duration-200"
//         >
//           <span>Exit Instance</span>
//           <LogOut size={14} />
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;





import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  PlusSquare,
  Box,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";

// ==========================================
// NAVIGATION CONFIGURATION DATA ARRAY (EXACT MATCH)
// ==========================================
const NAV_ITEMS = [
  {
    label: "Rental Master",
    icon: LayoutGrid,
    path: "/rental-master",
    group: "WORKSPACE",
  },
  // {
  //   label: "Log New Requisition",
  //   icon: PlusSquare,
  //   path: "/rental-master-form",
  //   group: "WORKSPACE",
  // },
  {
    label: "Master Info",
    icon: Box,
    path: "/inventory",
    group: "WORKSPACE",
  },
  // {
  //   label: "Reports & Ledger",
  //   icon: BarChart3,
  //   path: "/requisitions/new",
  //   group: "WORKSPACE",
  // },
  {
    label: "Notification Center",
    icon: Bell,
    path: "/notifications",
    group: "ALERTS",
    badgeCount: 5,
  },
];

// ==========================================
// CORE SIDEBAR COMPONENT
// ==========================================
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mocked state value to align with UI design requirements
  const currentUser = {
    name: "Rajesh K.",
    role: "Admin",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const renderGroupSection = (groupName) => {
    return (
      <div key={groupName} className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-3 mb-2.5">
          {groupName}
        </p>
        
        {NAV_ITEMS.filter((item) => item.group === groupName).map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                isActive
                  ? "bg-[#007a78] text-white shadow-inner"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <IconComponent 
                  size={18} 
                  className={isActive ? "text-[#5bf2ca]" : "text-slate-300"} 
                />
                <span>{item.label}</span>
              </div>
              
              {item.badgeCount && (
                <span className="bg-rose-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="w-[300px] h-screen bg-[#0b4864] flex flex-col justify-between fixed left-0 top-0 z-30 select-none border-r border-slate-800/10 font-sans">
      <div>
        
        {/* Exact Header Branding Layout */}
        <div className="bg-[#007a78] px-6 py-5 flex items-center gap-2.5">
          <svg 
            className="w-7 h-7 text-[#5bf2ca]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h1.5m0 0l2-4 3 8 4-11 2.5 7h1.5" />
          </svg>
          <span className="text-white font-black text-xl tracking-wider">CHIKITSA</span>
          <span className="bg-[#1fc29c] text-[#074737] text-[10px] font-bold px-1.5 py-0.5 rounded-md transform -translate-y-0.5">
            OS
          </span>
        </div>

        {/* Dynamic Categorized Container Blocks */}
        <div className="px-4 py-6 space-y-7">
          {renderGroupSection("WORKSPACE")}
          {renderGroupSection("ALERTS")}
        </div>
      </div>

      {/* Profile Bar Anchor Row Container */}
      <div className="border-t border-white/5 bg-[#08384f]/60 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1fc29c] text-[#074737] font-extrabold text-sm flex items-center justify-center shadow-inner">
            RK
          </div>
          <div>
            <h4 className="text-white text-sm font-bold leading-tight">
              {currentUser.name}
            </h4>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {currentUser.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          title="Sign Out Access"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;