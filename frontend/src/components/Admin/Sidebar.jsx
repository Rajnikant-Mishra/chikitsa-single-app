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
//                     <div
//   className={`flex items-center ${
//     collapsed ? "" : "gap-3.5"
//   }`}
// >
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

const Sidebar = ({
   collapsed,
  sidebarOpen,
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
const expanded = !collapsed || sidebarOpen;
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
        {expanded && (
  <p
  className={`
    text-[10px] font-black text-slate-400 tracking-widest uppercase
    overflow-hidden whitespace-nowrap
    transition-all duration-300 ease-in-out
    ${expanded
      ? "opacity-100 max-h-10 mb-2.5 px-3"
      : "opacity-0 max-h-0 mb-0 px-0"}
  `}
>
  {groupName}
</p>
)}
        
        {NAV_ITEMS.filter((item) => item.group === groupName).map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
             className={`w-full flex items-center ${
   expanded ? "justify-between" : "justify-center"
} px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
  isActive
    ? "bg-[#007a78] text-white shadow-inner"
    : "text-slate-300 hover:bg-white/5 hover:text-white"
}`}
            >
             <div className="flex items-center overflow-hidden">
  <IconComponent
    size={18}
    className={`flex-shrink-0 ${
      isActive ? "text-[#5bf2ca]" : "text-slate-300"
    }`}
  />

  <span
    className={`
      whitespace-nowrap overflow-hidden
      transition-all duration-300 ease-in-out
      ${expanded
        ? "opacity-100 ml-3 max-w-[200px]"
        : "opacity-0 ml-0 max-w-0"}
    `}
  >
    {item.label}
  </span>
</div>
              
              {item.badgeCount && expanded && (
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
  <>
    {/* Mobile Overlay */}
   {sidebarOpen && collapsed && (
  <div
    className="fixed inset-0 bg-black/40 z-40"
    onClick={onClose}
  />
)}
  <aside
  className={`
    fixed left-0 top-0 h-screen
    bg-[#0b4864]
    border-r border-slate-800/10
    transition-all duration-300
    z-50

   ${
  expanded
    ? "w-[300px] shadow-2xl"
    : "w-20"
}
  `}
>
  {/* Logo */}
  <div className="h-20 flex items-center justify-center border-b border-white/10">
    {expanded ? (
<div
  className={`
    h-20 flex items-center
    transition-all duration-300
    ${expanded ? "px-6 justify-start" : "justify-center"}
  `}
>
  <LayoutGrid className="w-7 h-7 text-[#5bf2ca] flex-shrink-0" />

  <div
    className={`
      overflow-hidden whitespace-nowrap
      transition-all duration-300 ease-in-out
      ${expanded
        ? "opacity-100 max-w-[220px] ml-3"
        : "opacity-0 max-w-0 ml-0"}
    `}
  >
    <span className="text-white font-black text-xl">
      CHIKITSA
    </span>
  </div>
</div>
) : (
  <div className="h-20 flex items-center justify-center">
    <LayoutGrid className="w-7 h-7 text-[#5bf2ca]" />
  </div>
)}
  </div>

  {/* Menu */}
  <div className="p-4 space-y-6">
    {renderGroupSection("WORKSPACE")}
    {renderGroupSection("ALERTS")}
  </div>

  {/* Logout */}
  <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg"
    >
      <LogOut size={18} />
      <span
  className={`
    overflow-hidden whitespace-nowrap
    transition-all duration-300 ease-in-out
    ${expanded
      ? "opacity-100 max-w-[100px]"
      : "opacity-0 max-w-0"}
  `}
>
  Logout
</span>
    </button>
  </div>
</aside>
  </>
  );
};

export default Sidebar;









