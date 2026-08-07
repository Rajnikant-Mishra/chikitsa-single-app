
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Bell,
//   ChevronDown,
//   LogOut,
// } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// // Helper function to safely decode JWT payload
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       window
//         .atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );

//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return null;
//   }
// };

// const Header = ({ title = "Dashboard Console" }) => {
//   const navigate = useNavigate();

//   const [profileOpen, setProfileOpen] = useState(false);

//   const [userData, setUserData] = useState({
//     name: "Admin",
//     email: "admin@system.com",
//     role: "admin",
//   });

//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token) {
//       const decoded = decodeToken(token);

//       if (storedUser) {
//         try {
//           setUserData(JSON.parse(storedUser));
//         } catch (err) {
//           console.error(err);
//         }
//       } else if (decoded) {
//         setUserData({
//           name: decoded.name || "Admin User",
//           email: decoded.email || "System User",
//           role: decoded.role || "admin",
//         });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);

//     return () =>
//       document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (token) {
//         const response = await fetch(`${API_BASE}/api/auth/logout`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || "Logout failed");
//         }

//         console.log(data.message);
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       navigate("/login", { replace: true });
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return "AD";

//     return name
//       .trim()
//       .split(" ")
//       .slice(0, 2)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   return (
//     <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 fixed top-0 right-0 left-72 z-20 flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)] select-none">
//       <div className="flex items-center gap-6">
//         <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
//           {title}
//         </h1>
//       </div>

//       <div className="flex items-center gap-4">
//         <button className="p-2.5 text-slate-400 hover:text-[#2865be] hover:bg-slate-50 rounded-xl transition-all relative">
//           <Bell size={18} />
//           <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2865be] ring-2 ring-white" />
//         </button>

//         <div className="w-px h-8 bg-slate-200/60 mx-1" />

//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all text-left outline-none"
//           >
//             <div className="w-9 h-9 rounded-xl bg-[#2865be] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/20 uppercase">
//               {getInitials(userData.name)}
//             </div>

//             <div className="hidden xl:block">
//               <p className="text-xs font-black text-slate-800 leading-tight capitalize">
//                 {userData.name}
//               </p>

//               <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
//                 {userData.role} Terminal
//               </p>
//             </div>

//             <ChevronDown
//               size={14}
//               className={`text-slate-400 hidden xl:block transition-transform duration-200 ${
//                 profileOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] py-2 z-50">
//               <div className="px-4 py-3 border-b border-slate-50">
//                 <p className="text-xs font-black text-slate-900 capitalize">
//                   {userData.name}
//                 </p>

//                 <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">
//                   {userData.email}
//                 </p>
//               </div>

//               <div className="p-2">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-black text-xs uppercase tracking-wider transition-all"
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



import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Mail,
  Shield,
  X,
  AlertTriangle,
  Clock,
  Package,
  CheckCircle2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// —— helpers ——
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const daysBetween = (from, to = new Date()) => {
  if (!from) return 0;
  const start = new Date(from);
  const end = to instanceof Date ? to : new Date(to);
  return Math.max(
    0,
    Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
  );
};

const formatRelative = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const Header = ({ title = "Dashboard Console" }) => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notif_read_ids") || "[]");
    } catch {
      return [];
    }
  });

  const [userData, setUserData] = useState({
    name: "Admin",
    email: "admin@system.com",
    role: "admin",
  });

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // —— user from token / storage ——
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      const decoded = decodeToken(token);
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (err) {
          console.error(err);
        }
      } else if (decoded) {
        setUserData({
          name: decoded.name || "Admin User",
          email: decoded.email || "System User",
          role: decoded.role || "admin",
        });
      }
    }
  }, []);

  // —— click outside ——
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Escape closes profile panel
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowProfilePanel(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // —— build notifications from rentals API ——
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/rentals`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        setNotifications([]);
        return;
      }
      const json = await res.json();
      const rentals = Array.isArray(json) ? json : json?.data || [];

      const items = [];

      rentals.forEach((r) => {
        const id = r.rental_id;
        const patient = r.patient_name || "Patient";
        const device = r.device?.device_name || "Device";
        const status = (r.status || "Pending").toUpperCase();
        const days = daysBetween(r.login_date, r.login_out_date || undefined);

        // 1) Overdue / due (≥ 30 days, still open)
        if (
          !r.login_out_date &&
          days >= 30 &&
          ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
        ) {
          items.push({
            id: `due-${id}`,
            rentalId: id,
            type: "due",
            title: "Rental overdue",
            message: `${patient} · ${device} · ${days} days open`,
            time: r.login_date,
            severity: "high",
          });
        }
        // 2) Approaching due (25–29 days)
        else if (
          !r.login_out_date &&
          days >= 25 &&
          days < 30 &&
          ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
        ) {
          items.push({
            id: `warn-${id}`,
            rentalId: id,
            type: "warning",
            title: "Approaching due",
            message: `${patient} · ${device} · ${days} days`,
            time: r.login_date,
            severity: "medium",
          });
        }

        // 3) Pending (not yet delivered)
        if (status === "PENDING") {
          items.push({
            id: `pending-${id}`,
            rentalId: id,
            type: "pending",
            title: "Pending deployment",
            message: `${patient} · ${device}`,
            time: r.record_date || r.login_date || r.created_at,
            severity: "low",
          });
        }
      });

      // Sort: high severity first, then by days/recency
      const severityOrder = { high: 0, medium: 1, low: 2 };
      items.sort((a, b) => {
        const s = severityOrder[a.severity] - severityOrder[b.severity];
        if (s !== 0) return s;
        return (b.rentalId || 0) - (a.rentalId || 0);
      });

      setNotifications(items.slice(0, 20));
    } catch (err) {
      console.error("Notifications fetch failed:", err);
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Load on mount + when opening panel
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen, fetchNotifications]);

  // Persist read ids
  useEffect(() => {
    localStorage.setItem("notif_read_ids", JSON.stringify(readIds));
  }, [readIds]);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id),
  ).length;

  const markAllRead = () => {
    setReadIds((prev) => [
      ...new Set([...prev, ...notifications.map((n) => n.id)]),
    ]);
  };

  const markRead = (id) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleNotifClick = (n) => {
    markRead(n.id);
    setNotifOpen(false);
    if (n.rentalId) {
      navigate(`/rental-view/${n.rentalId}`);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const openProfile = () => {
    setProfileOpen(false);
    setShowProfilePanel(true);
  };

  const roleLabel =
    (userData.role || "admin").charAt(0).toUpperCase() +
    (userData.role || "admin").slice(1);

  const typeIcon = (type) => {
    switch (type) {
      case "due":
        return <AlertTriangle size={14} className="text-rose-600" />;
      case "warning":
        return <Clock size={14} className="text-amber-600" />;
      case "pending":
        return <Package size={14} className="text-sky-600" />;
      default:
        return <Bell size={14} className="text-slate-500" />;
    }
  };

  const typeBg = (type) => {
    switch (type) {
      case "due":
        return "bg-rose-50 border-rose-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "pending":
        return "bg-sky-50 border-sky-100";
      default:
        return "bg-slate-50 border-slate-100";
    }
  };

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 fixed top-0 right-0 left-72 z-20 flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)] select-none">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* ========== NOTIFICATIONS ========== */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="p-2.5 text-slate-400 hover:text-[#0e4a67] hover:bg-slate-50 rounded-xl transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-[#0e4a67]/30"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#0e4a67] text-white text-[10px] font-black ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2.5 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">
                      Notifications
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "All caught up"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-[#0e4a67] hover:underline flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fetchNotifications()}
                      className="text-[11px] font-bold text-slate-400 hover:text-[#0e4a67]"
                      title="Refresh"
                    >
                      ↻
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-[380px] overflow-y-auto">
                  {notifLoading && notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
                      <div className="w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full animate-spin" />
                      <p className="text-xs font-medium">Loading…</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-2xl mb-2 opacity-40">🔔</p>
                      <p className="text-sm text-slate-400 font-medium">
                        No alerts right now
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Due & pending rentals will appear here
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-50">
                      {notifications.map((n) => {
                        const isRead = readIds.includes(n.id);
                        return (
                          <li key={n.id}>
                            <button
                              type="button"
                              onClick={() => handleNotifClick(n)}
                              className={`w-full text-left px-4 py-3.5 flex gap-3 transition hover:bg-slate-50/80 ${
                                isRead ? "opacity-70" : "bg-white"
                              }`}
                            >
                              <span
                                className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${typeBg(
                                  n.type,
                                )}`}
                              >
                                {typeIcon(n.type)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p
                                    className={`text-xs font-bold leading-snug ${
                                      isRead
                                        ? "text-slate-600"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {n.title}
                                  </p>
                                  {!isRead && (
                                    <span className="mt-1 w-2 h-2 rounded-full bg-[#0e4a67] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                  {formatRelative(n.time)}
                                </p>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/rental-master");
                    }}
                    className="w-full text-center text-xs font-bold text-[#0e4a67] hover:underline py-1"
                  >
                    Open Rental Master →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-slate-200/60 mx-1" />

          {/* ========== PROFILE ========== */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0e4a67]/30"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-[#0e4a67]/25 uppercase">
                {getInitials(userData.name)}
              </div>

              <div className="hidden xl:block">
                <p className="text-xs font-black text-slate-800 leading-tight capitalize">
                  {userData.name}
                </p>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  {userData.role} Terminal
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 hidden xl:block transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.1)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] flex items-center justify-center font-black text-white text-sm tracking-wider shadow-md shadow-[#0e4a67]/20 uppercase shrink-0">
                      {getInitials(userData.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900 capitalize truncate">
                        {userData.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                        {userData.email}
                      </p>
                      <span className="inline-flex mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#0e4a67]/10 text-[#0e4a67] border border-[#0e4a67]/15">
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    type="button"
                    onClick={openProfile}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0e4a67]/10 flex items-center justify-center text-slate-500 group-hover:text-[#0e4a67] transition">
                      <User size={15} />
                    </span>
                    <span className="flex-1 text-left">View Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition">
                      <LogOut size={15} />
                    </span>
                    <span className="flex-1 text-left">Disconnect Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========== PROFILE SLIDE-OVER ========== */}
      {showProfilePanel && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setShowProfilePanel(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="relative bg-gradient-to-br from-[#0e4a67] to-[#155e82] px-6 pt-6 pb-16">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                  Account Profile
                </p>
                <button
                  type="button"
                  onClick={() => setShowProfilePanel(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 -mt-10 relative z-10">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] flex items-center justify-center font-black text-white text-2xl tracking-wider shadow-xl shadow-[#0e4a67]/30 border-4 border-white uppercase">
                  {getInitials(userData.name)}
                </div>
                <div className="pb-1 min-w-0 flex-1">
                  <h2 className="text-lg font-extrabold text-slate-900 capitalize truncate">
                    {userData.name}
                  </h2>
                  <span className="inline-flex mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active · {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Profile details
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0e4a67] shrink-0">
                    <User size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Full name
                    </p>
                    <p className="text-sm font-bold text-slate-800 capitalize mt-0.5 truncate">
                      {userData.name || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0e4a67] shrink-0">
                    <Mail size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email address
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                      {userData.email || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0e4a67] shrink-0">
                    <Shield size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Access role
                    </p>
                    <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
                      {roleLabel} Terminal
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-4 rounded-xl border border-dashed border-slate-200 bg-white">
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  You are signed in with an active admin session. Use disconnect
                  to end this terminal securely.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex gap-3">
              <button
                type="button"
                onClick={() => setShowProfilePanel(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm shadow-rose-600/25 transition flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;