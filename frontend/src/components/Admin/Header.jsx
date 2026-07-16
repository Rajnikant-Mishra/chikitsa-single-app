
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   Bell, 
//   Search, 
//   Globe, 
//   ChevronDown, 
//   Sparkles, 
//   LogOut, 
//   User, 
//   ShieldAlert, 
//   Server 
// } from "lucide-react";

// const Header = ({ title = "Dashboard Console" }) => {
//   const navigate = useNavigate();
//   const [profileOpen, setProfileOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close profile dropdown window when clicking outside the panel container
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 fixed top-0 right-0 left-72 z-20 flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)] select-none">
      
//       {/* Search and Navigation Title Scope */}
//       <div className="flex items-center gap-6">
//         <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
//           {title}
//         </h1>
        
//       </div>

//       {/* Global Utilities Frame */}
//       <div className="flex items-center gap-4">
       

       

//         <button className="p-2.5 text-slate-400 hover:text-[#2865be] hover:bg-slate-50 rounded-xl transition-all relative">
//           <Bell size={18} />
//           <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2865be] ring-2 ring-white" />
//         </button>

//         <div className="w-px h-8 bg-slate-200/60 mx-1" />

//         {/* Profile Context Block - Action Component Popover */}
//         <div className="relative" ref={dropdownRef}>
//           <button 
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all text-left outline-none"
//           >
//             <div className="w-9 h-9 rounded-xl bg-[#2865be] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/20">
//               HQ
//             </div>
//             <div className="hidden xl:block">
//               <p className="text-xs font-black text-slate-800 leading-tight">Oxford Public School</p>
//               <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Admin Terminal</p>
//             </div>
//             <ChevronDown 
//               size={14} 
//               className={`text-slate-400 hidden xl:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} 
//             />
//           </button>

//           {/* Upgraded SaaS Dropdown Popover Panel */}
//           {profileOpen && (
//             <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
              
//               {/* Header Information Bracket */}
//               <div className="px-4 py-3 border-b border-slate-50">
//                 <p className="text-xs font-black text-slate-900">Oxford Admin Node</p>
//                 <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">admin@oxfordpublic.edu</p>
//               </div>

//               {/* Functional Sub-menu Controls */}
//               <div className="p-1.5 space-y-0.5">
//                 <button 
//                   onClick={() => { setProfileOpen(false); navigate("/settings"); }}
//                   className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-600 hover:text-[#2865be] hover:bg-[#2865be]/5 transition-all"
//                 >
//                   <User size={14} className="text-slate-400 group-hover:text-[#2865be]" />
//                   <span>Profile Settings</span>
//                 </button>

//                 <button 
//                   onClick={() => { setProfileOpen(false); navigate("/security"); }}
//                   className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-600 hover:text-[#2865be] hover:bg-[#2865be]/5 transition-all"
//                 >
//                   <ShieldAlert size={14} className="text-slate-400" />
//                   <span>Security & Keys</span>
//                 </button>
//               </div>

//               <div className="border-t border-slate-50 my-1.5" />

//               {/* Infrastructure Status Banner */}
//               <div className="mx-3 my-1 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
//                 <Server size={12} className="text-emerald-500" />
//                 <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
//                   Node Status: <span className="text-emerald-600 font-black">Connected</span>
//                 </div>
//               </div>

//               <div className="border-t border-slate-50 my-1.5" />

//               {/* Logout Action Vector */}
//               <div className="p-1.5">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-black text-xs uppercase tracking-wider transition-all duration-150"
//                 >
//                   <span>Disconnect Session</span>
//                   <LogOut size={14} />
//                 </button>
//               </div>

//             </div>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// };

// export default Header;



import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  ShieldAlert, 
  Server 
} from "lucide-react";

// Helper function to safely decode JWT payload without external library
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const Header = ({ title = "Dashboard Console" }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "Admin", email: "admin@system.com", role: "admin" });
  const dropdownRef = useRef(null);

  // Parse User Data on Mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      const decoded = decodeToken(token);
      
      // If your backend stores full details in localStorage separately
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      } 
      // Fallback: Use data parsed straight from the JWT claims
      else if (decoded) {
        setUserData({
          name: decoded.name || "Admin User",
          email: decoded.email || "System Node",
          role: decoded.role || "admin"
        });
      }
    }
  }, []);

  // Close profile dropdown window when clicking outside the panel container
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clean up user object if stored
    navigate("/login");
  };

  // Generate a clean 2-letter fallback initial for the avatar
  const getInitials = (name) => {
    if (!name) return "AD";
    return name.trim().split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 fixed top-0 right-0 left-72 z-20 flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)] select-none">
      
      {/* Search and Navigation Title Scope */}
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
          {title}
        </h1>
      </div>

      {/* Global Utilities Frame */}
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-slate-400 hover:text-[#2865be] hover:bg-slate-50 rounded-xl transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2865be] ring-2 ring-white" />
        </button>

        <div className="w-px h-8 bg-slate-200/60 mx-1" />

        {/* Profile Context Block - Action Component Popover */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all text-left outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2865be] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/20 uppercase">
              {getInitials(userData.name)}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-black text-slate-800 leading-tight capitalize">{userData.name}</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">{userData.role} Terminal</p>
            </div>
            <ChevronDown 
              size={14} 
              className={`text-slate-400 hidden xl:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Upgraded SaaS Dropdown Popover Panel */}
          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
              
              {/* Header Information Bracket */}
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-xs font-black text-slate-900 capitalize">{userData.name} Node</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">{userData.email}</p>
              </div>

             

              <div className="border-t border-slate-50 my-1.5" />

             

              <div className="border-t border-slate-50 my-1.5" />

              {/* Logout Action Vector */}
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-black text-xs uppercase tracking-wider transition-all duration-150"
                >
                  <span>Disconnect Session</span>
                  <LogOut size={14} />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;