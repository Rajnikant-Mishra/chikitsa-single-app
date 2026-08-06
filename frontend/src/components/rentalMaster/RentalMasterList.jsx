// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../Admin/Layout";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export default function RentalMasterList({ onEdit, onView, onCreateNew }) {
//   const navigate = useNavigate();
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [careCenters, setCareCenters] = useState([]);

//   // Filter Panel States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [careCenterFilter, setCareCenterFilter] = useState("All");
//   const [dealTypeFilter, setDealTypeFilter] = useState("All");
//   const [unitTypeFilter, setUnitTypeFilter] = useState("All");
//   const [modeTypeFilter, setModeTypeFilter] = useState("All");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // Fetch all active/pending rentals array from Express router
//   const fetchRentals = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/api/rentals`, {
//         headers: { ...(token && { Authorization: `Bearer ${token}` }) },
//       });
//       const result = await res.json();
//       if (result.success) {
//         setRentals(result.data || []);
//       }
//     } catch (err) {
//       console.error("Error pulling master deployment matrix:", err);
//       setRentals([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Care Centers for dropdown
//   const fetchCareCenters = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
//         headers: { ...(token && { Authorization: `Bearer ${token}` }) },
//       });
//       const result = await res.json();
//       const items = Array.isArray(result) ? result : result.data || [];
//       const activeCenters = items.filter((c) => c.status === "active");
//       setCareCenters(activeCenters);
//     } catch (err) {
//       console.error("Failed fetching care center entities:", err);
//       setCareCenters([]);
//     }
//   };

//   useEffect(() => {
//     fetchRentals();
//     fetchCareCenters();
//   }, []);

//   // Integrated Database Delete Handler communicating with your router.delete("/:id")
//   const handleDeleteClick = async (rentalId) => {
//     const confirmDeletion = window.confirm(
//       "Are you absolutely sure you want to purge this asset rental log record? This action cannot be undone.",
//     );

//     if (!confirmDeletion) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}`, {
//         method: "DELETE",
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` }),
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to drop target record entry from database schema.",
//         );
//       }

//       alert("Rental requisition record successfully dropped.");

//       // Reactive local UI state eviction cleanup (Avoids page reload)
//       setRentals((prevRentals) =>
//         prevRentals.filter((item) => item.rental_id !== rentalId),
//       );
//     } catch (error) {
//       console.error("Deletion lifecycle crash:", error);
//       alert(`Error processing request: ${error.message}`);
//     }
//   };

//   // Reset Filters Utility
//   const handleReset = () => {
//     setSearchTerm("");
//     setCareCenterFilter("All");
//     setDealTypeFilter("All");
//     setUnitTypeFilter("All");
//     setModeTypeFilter("All");
//     setCurrentPage(1);
//   };

//   // Calculate total days from login_date → login_out_date (or today)
//   // Display format: 30/8  (days / logout month)
//   const calculateTotalDays = (loginDate, logoutDate, status) => {
//     if (!loginDate) return "0";

//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();

//     // Difference in days
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     // Month number of the end date (1-12)
//     const month = end.getMonth() + 1;

//     // Highlight "Due" only when still running and no logout date yet
//     if (!logoutDate) {
//       const upperStatus = (status || "").toUpperCase();
//       if (
//         (upperStatus === "ACTIVE" ||
//           upperStatus === "RUNNING" ||
//           upperStatus === "DELIVERED" ||
//           upperStatus === "PENDING") &&
//         diffDays >= 30
//       ) {
//         return (
//           <span className="text-[#c27803] font-bold">
//             {diffDays}/{month} (Due)
//           </span>
//         );
//       }
//     }

//     return (
//       <span className="text-slate-700 font-medium">
//         {diffDays}/{month}
//       </span>
//     );
//   };

//   // Standard En-GB Formatter: transforms YYYY-MM-DD to DD-MMM-YYYY (e.g., 16-Jul-2026)
//   const formatDisplayDate = (dateString) => {
//     if (!dateString) return "N/A";
//     if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
//       const parts = dateString.split("-");
//       const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
//       if (!isNaN(dateObj)) {
//         return dateObj
//           .toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })
//           .replace(/ /g, "-");
//       }
//     }
//     return dateString;
//   };

//   // Unique filter options from data
//   const uniqueDealTypes = [
//     ...new Set(rentals.map((r) => r.deal_type).filter(Boolean)),
//   ];
//   const uniqueUnitTypes = [
//     ...new Set(rentals.map((r) => r.unit_type).filter(Boolean)),
//   ];
//   const uniqueModeTypes = [
//     ...new Set(rentals.map((r) => r.mode_type).filter(Boolean)),
//   ];

//   // Search and filter pipeline
//   const filteredRentals = rentals.filter((item) => {
//     const deviceModelName = item.device?.device_name || "";

//     const matchString =
//       `${item.patient_name || ""} ${deviceModelName} ${item.care_center_name || ""} ${item.patient_mob_no || ""} ${item.deal_type || ""} ${item.unit_type || ""} ${item.mode_type || ""}`.toLowerCase();
//     const matchesSearch = matchString.includes(searchTerm.toLowerCase());

//     const matchesCareCenter =
//       careCenterFilter === "All" || item.care_center_name === careCenterFilter;

//     const matchesDealType =
//       dealTypeFilter === "All" || item.deal_type === dealTypeFilter;

//     const matchesUnitType =
//       unitTypeFilter === "All" || item.unit_type === unitTypeFilter;

//     const matchesModeType =
//       modeTypeFilter === "All" || item.mode_type === modeTypeFilter;

//     return (
//       matchesSearch &&
//       matchesCareCenter &&
//       matchesDealType &&
//       matchesUnitType &&
//       matchesModeType
//     );
//   });

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredRentals.length / recordsPerPage) || 1;
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredRentals.slice(
//     indexOfFirstRecord,
//     indexOfLastRecord,
//   );

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     searchTerm,
//     careCenterFilter,
//     dealTypeFilter,
//     unitTypeFilter,
//     modeTypeFilter,
//   ]);

//   // Dynamic Status Badges mapped safely against your ENUM status definitions
//   const getStatusBadge = (status = "PENDING") => {
//     const upper = status.toUpperCase();
//     if (upper === "ACTIVE" || upper === "RUNNING" || upper === "DELIVERED") {
//       return (
//         <span className="px-2.5 py-0.5 text-[10px] font-bold rounded border border-emerald-200 bg-emerald-50 text-emerald-600 tracking-wide">
//           ACTIVE
//         </span>
//       );
//     }
//     if (upper === "PENDING") {
//       return (
//         <span className="px-2.5 py-0.5 text-[10px] font-bold rounded border border-amber-200 bg-amber-50 text-amber-600 tracking-wide">
//           PENDING
//         </span>
//       );
//     }
//     return (
//       <span className="px-2.5 py-0.5 text-[10px] font-bold rounded border border-slate-200 bg-slate-100 text-slate-500 tracking-wide">
//         {upper}
//       </span>
//     );
//   };

//   return (
//     <DashboardLayout>
//       <div className="w-full mx-auto p-6 bg-white min-h-screen">
//         {/* Headline Header Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
//           <div>
//             <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight">
//               Rental Master Sheet
//             </h1>
//             <p className="text-slate-400 text-xs mt-0.5 font-medium">
//               Live view of all requisitions.
//             </p>
//           </div>

//           <button
//             onClick={() => navigate("/rental-requisition")}
//             className="w-full sm:w-auto px-4 py-2 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5 self-start sm:self-auto decoration-transparent"
//           >
//             Log New Requisition
//           </button>
//         </div>

//         {/* Filter Toolbar Area */}
//         <div className="border border-slate-200 rounded-lg p-3 bg-white flex flex-col md:flex-row gap-2.5 items-center mb-4 shadow-sm">
//           <div className="relative w-full md:flex-1">
//             <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
//               🔍
//             </span>
//             <input
//               type="text"
//               placeholder="Search Patient Name, Phone, Asset, Care Center, Deal, Unit, Mode..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-8 pr-8 py-2 border border-slate-200 rounded-md text-xs placeholder:text-slate-400 text-slate-700 focus:outline-none focus:border-slate-300"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-3 top-2 text-slate-300 hover:text-slate-500 text-sm"
//               >
//                 ✕
//               </button>
//             )}
//           </div>

//           {/* Care Center Filter */}
//           <div className="w-full md:w-44">
//             <select
//               value={careCenterFilter}
//               onChange={(e) => setCareCenterFilter(e.target.value)}
//               className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
//             >
//               <option value="All">Care Center: All</option>
//               {careCenters.map((center) => (
//                 <option
//                   key={center.carecenter_id}
//                   value={center.carecenter_name}
//                 >
//                   {center.carecenter_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Deal Type Filter */}
//           <div className="w-full md:w-36">
//             <select
//               value={dealTypeFilter}
//               onChange={(e) => setDealTypeFilter(e.target.value)}
//               className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
//             >
//               <option value="All">Deal: All</option>
//               {uniqueDealTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Unit Filter */}
//           <div className="w-full md:w-36">
//             <select
//               value={unitTypeFilter}
//               onChange={(e) => setUnitTypeFilter(e.target.value)}
//               className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
//             >
//               <option value="All">Unit: All</option>
//               {uniqueUnitTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Mode Filter */}
//           <div className="w-full md:w-36">
//             <select
//               value={modeTypeFilter}
//               onChange={(e) => setModeTypeFilter(e.target.value)}
//               className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
//             >
//               <option value="All">Mode: All</option>
//               {uniqueModeTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="button"
//             onClick={handleReset}
//             className="w-full md:w-auto px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-600 rounded-md transition font-medium"
//           >
//             Reset
//           </button>
//         </div>

//         <p className="text-xs text-slate-400 font-bold mb-3 px-0.5 tracking-wide">
//           {filteredRentals.length} records shown
//         </p>

//         {/* Master Table Area */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-20 space-y-2">
//               <div className="w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full animate-spin"></div>
//               <p className="text-slate-400 text-xs font-medium">
//                 Fetching real-time records entries...
//               </p>
//             </div>
//           ) : filteredRentals.length === 0 ? (
//             <div className="text-center py-16 text-slate-400 text-xs font-medium">
//               No matching client requisition entries discovered.
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest bg-white">
//                       <th className="px-6 py-4 font-bold w-28">Status</th>
//                       <th className="px-6 py-4 font-bold w-28">Deal types</th>
//                       <th className="px-6 py-4 font-bold w-28">Units</th>
//                       <th className="px-6 py-4 font-bold w-28">Modes</th>
//                       <th className="px-6 py-4 font-bold">Device</th>
//                       <th className="px-6 py-4 font-bold">Patients</th>
//                       <th className="px-6 py-4 font-bold w-36">Login Date</th>
//                       <th className="px-6 py-4 font-bold w-36">Logout Date</th>
//                       <th className="px-6 py-4 font-bold w-32">Total Days</th>
//                       <th className="px-6 py-4 font-bold w-48 text-center">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
//                     {currentRecords.map((rental) => {
//                       const displayDeviceModel =
//                         rental.device?.device_name || "Equipment Asset";

//                       return (
//                         <tr
//                           key={rental.rental_id}
//                           className="hover:bg-slate-50/40 transition"
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap align-middle">
//                             {getStatusBadge(rental.status)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap align-middle">
//                             {rental.deal_type || "—"}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap align-middle">
//                             {rental.unit_type || "—"}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap align-middle">
//                             {rental.mode_type || "—"}
//                           </td>
//                           <td className="px-6 py-4 font-bold text-[#0e4a67] hover:underline cursor-pointer align-middle">
//                             {displayDeviceModel}
//                           </td>
//                           <td className="px-6 py-4 font-bold text-slate-800 align-middle">
//                             {rental.patient_name || "N/A"}
//                           </td>
//                           <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap align-middle">
//                             {formatDisplayDate(rental.login_date)}
//                           </td>
//                           <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap align-middle">
//                             {formatDisplayDate(rental.login_out_date)}
//                           </td>
//                           <td className="px-6 py-4 font-medium align-middle">
//                             {calculateTotalDays(
//                               rental.login_date,
//                               rental.login_out_date,
//                               rental.status,
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
//                             {/* <div className="flex items-center justify-center gap-1.5">
//                               <Link
//                                 to="/rental-view"
//                                 state={{ rental }}
//                                 className="inline-block px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition"
//                               >
//                                 View
//                               </Link>
//                               <button
//                                 type="button"
//                                 onClick={() => onEdit && onEdit(rental)}
//                                 className="px-2.5 py-1 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-[11px] rounded shadow-sm transition"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   handleDeleteClick(rental.rental_id)
//                                 }
//                                 className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded transition"
//                               >
//                                 Delete
//                               </button>
//                             </div> */}

//                             <div className="flex items-center justify-center gap-1.5">
//                               {/* View */}
//                               <Link
//                                 to={`/rental-view/${rental.rental_id}`}
//                                 className="inline-block px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition"
//                               >
//                                 View
//                               </Link>

//                               {/* Edit */}
//                               <Link
//                                 to={`/rental-edit/${rental.rental_id}`}
//                                 className="inline-block px-2.5 py-1 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-[11px] rounded shadow-sm transition"
//                               >
//                                 Edit
//                               </Link>

//                               {/* Delete */}
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   handleDeleteClick(rental.rental_id)
//                                 }
//                                 className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded transition"
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Controls */}
//               {totalPages > 1 && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
//                   <p className="text-xs text-slate-500 font-medium">
//                     Showing {indexOfFirstRecord + 1}–
//                     {Math.min(indexOfLastRecord, filteredRentals.length)} of{" "}
//                     {filteredRentals.length} records
//                   </p>

//                   <div className="flex items-center gap-1.5">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPage === 1}
//                       className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//                     >
//                       Prev
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter((page) => {
//                         return (
//                           page === 1 ||
//                           page === totalPages ||
//                           Math.abs(page - currentPage) <= 1
//                         );
//                       })
//                       .map((page, idx, arr) => {
//                         const prevPage = arr[idx - 1];
//                         const showEllipsis = prevPage && page - prevPage > 1;

//                         return (
//                           <React.Fragment key={page}>
//                             {showEllipsis && (
//                               <span className="px-1 text-slate-400 text-xs">
//                                 …
//                               </span>
//                             )}
//                             <button
//                               type="button"
//                               onClick={() => setCurrentPage(page)}
//                               className={`min-w-[32px] px-2.5 py-1.5 text-xs font-bold rounded-md border transition ${
//                                 currentPage === page
//                                   ? "bg-[#0e4a67] text-white border-[#0e4a67]"
//                                   : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           </React.Fragment>
//                         );
//                       })}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                       }
//                       disabled={currentPage === totalPages}
//                       className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }



import React, { useState, useEffect } from "react";
import DashboardLayout from "../Admin/Layout";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalMasterList({ onEdit, onView, onCreateNew }) {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careCenters, setCareCenters] = useState([]);

  // Filter Panel States
  const [searchTerm, setSearchTerm] = useState("");
  const [careCenterFilter, setCareCenterFilter] = useState("All");
  const [dealTypeFilter, setDealTypeFilter] = useState("All");
  const [unitTypeFilter, setUnitTypeFilter] = useState("All");
  const [modeTypeFilter, setModeTypeFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // ===== NEW: Calculate Days Modal State =====
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [editLoginDate, setEditLoginDate] = useState("");
  const [editLogoutDate, setEditLogoutDate] = useState("");

  // Fetch all active/pending rentals array from Express router
  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/rentals`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const result = await res.json();
      if (result.success) {
        setRentals(result.data || []);
      }
    } catch (err) {
      console.error("Error pulling master deployment matrix:", err);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Care Centers for dropdown
  const fetchCareCenters = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const result = await res.json();
      const items = Array.isArray(result) ? result : result.data || [];
      const activeCenters = items.filter((c) => c.status === "active");
      setCareCenters(activeCenters);
    } catch (err) {
      console.error("Failed fetching care center entities:", err);
      setCareCenters([]);
    }
  };

  useEffect(() => {
    fetchRentals();
    fetchCareCenters();
  }, []);

  // Integrated Database Delete Handler communicating with your router.delete("/:id")
  const handleDeleteClick = async (rentalId) => {
    const confirmDeletion = window.confirm(
      "Are you absolutely sure you want to purge this asset rental log record? This action cannot be undone.",
    );

    if (!confirmDeletion) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to drop target record entry from database schema.",
        );
      }

      alert("Rental requisition record successfully dropped.");

      // Reactive local UI state eviction cleanup (Avoids page reload)
      setRentals((prevRentals) =>
        prevRentals.filter((item) => item.rental_id !== rentalId),
      );
    } catch (error) {
      console.error("Deletion lifecycle crash:", error);
      alert(`Error processing request: ${error.message}`);
    }
  };

  // Reset Filters Utility
  const handleReset = () => {
    setSearchTerm("");
    setCareCenterFilter("All");
    setDealTypeFilter("All");
    setUnitTypeFilter("All");
    setModeTypeFilter("All");
    setCurrentPage(1);
  };

  // Calculate total days from login_date → login_out_date (or today)
  // Display format: 30/8  (days / logout month)
  const calculateTotalDays = (loginDate, logoutDate, status) => {
    if (!loginDate) return "0";

    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();

    // Difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Month number of the end date (1-12)
    const month = end.getMonth() + 1;

    // Highlight "Due" only when still running and no logout date yet
    if (!logoutDate) {
      const upperStatus = (status || "").toUpperCase();
      if (
        (upperStatus === "ACTIVE" ||
          upperStatus === "RUNNING" ||
          upperStatus === "DELIVERED" ||
          upperStatus === "PENDING") &&
        diffDays >= 30
      ) {
        return (
          <span className="text-[#c27803] font-bold">
            {diffDays}/{month} (Due)
          </span>
        );
      }
    }

    return (
      <span className="text-slate-700 font-medium">
        {diffDays}/{month}
      </span>
    );
  };

  // Helper: pure number of days (for modal)
  const getDaysNumber = (loginDate, logoutDate) => {
    if (!loginDate) return 0;
    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Standard En-GB Formatter: transforms YYYY-MM-DD to DD-MMM-YYYY (e.g., 16-Jul-2026)
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      const parts = dateString.split("-");
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(dateObj)) {
        return dateObj
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-");
      }
    }
    return dateString;
  };

  // Convert any date string to YYYY-MM-DD for <input type="date">
  const toInputDate = (dateString) => {
    if (!dateString) return "";
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.slice(0, 10);
    }
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  // Open Calculate Modal
  const openCalcModal = (rental) => {
    setSelectedRental(rental);
    setEditLoginDate(toInputDate(rental.login_date));
    setEditLogoutDate(toInputDate(rental.login_out_date));
    setCalcModalOpen(true);
  };

  // Close Calculate Modal
  const closeCalcModal = () => {
    setCalcModalOpen(false);
    setSelectedRental(null);
    setEditLoginDate("");
    setEditLogoutDate("");
  };

  // Apply edited dates to local state
  const applyDateChanges = () => {
    if (!selectedRental) return;

    setRentals((prev) =>
      prev.map((item) =>
        item.rental_id === selectedRental.rental_id
          ? {
              ...item,
              login_date: editLoginDate || null,
              login_out_date: editLogoutDate || null,
            }
          : item,
      ),
    );

    closeCalcModal();
  };

  // Unique filter options from data
  const uniqueDealTypes = [
    ...new Set(rentals.map((r) => r.deal_type).filter(Boolean)),
  ];
  const uniqueUnitTypes = [
    ...new Set(rentals.map((r) => r.unit_type).filter(Boolean)),
  ];
  const uniqueModeTypes = [
    ...new Set(rentals.map((r) => r.mode_type).filter(Boolean)),
  ];

  // Search and filter pipeline
  const filteredRentals = rentals.filter((item) => {
    const deviceModelName = item.device?.device_name || "";

    const matchString =
      `${item.patient_name || ""} ${deviceModelName} ${item.care_center_name || ""} ${item.patient_mob_no || ""} ${item.deal_type || ""} ${item.unit_type || ""} ${item.mode_type || ""}`.toLowerCase();
    const matchesSearch = matchString.includes(searchTerm.toLowerCase());

    const matchesCareCenter =
      careCenterFilter === "All" || item.care_center_name === careCenterFilter;

    const matchesDealType =
      dealTypeFilter === "All" || item.deal_type === dealTypeFilter;

    const matchesUnitType =
      unitTypeFilter === "All" || item.unit_type === unitTypeFilter;

    const matchesModeType =
      modeTypeFilter === "All" || item.mode_type === modeTypeFilter;

    return (
      matchesSearch &&
      matchesCareCenter &&
      matchesDealType &&
      matchesUnitType &&
      matchesModeType
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRentals.length / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRentals.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    careCenterFilter,
    dealTypeFilter,
    unitTypeFilter,
    modeTypeFilter,
  ]);

  // Dynamic Status Badges mapped safely against your ENUM status definitions
  const getStatusBadge = (status = "PENDING") => {
    const upper = status.toUpperCase();
    if (upper === "ACTIVE" || upper === "RUNNING" || upper === "DELIVERED") {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded border border-emerald-200 bg-emerald-50 text-emerald-600 tracking-wide">
          ACTIVE
        </span>
      );
    }
    if (upper === "PENDING") {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded border border-amber-200 bg-amber-50 text-amber-600 tracking-wide">
          PENDING
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded border border-slate-200 bg-slate-100 text-slate-500 tracking-wide">
        {upper}
      </span>
    );
  };

  // Live calculated days inside modal
  const modalDays = getDaysNumber(editLoginDate, editLogoutDate);
  const modalMonth = editLogoutDate
    ? new Date(editLogoutDate).getMonth() + 1
    : new Date().getMonth() + 1;

  return (
    <DashboardLayout>
      <div className="w-full mx-auto p-6 bg-white min-h-screen">
        {/* Headline Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight">
              Rental Master Sheet
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Live view of all requisitions.
            </p>
          </div>

          <button
            onClick={() => navigate("/rental-requisition")}
            className="w-full sm:w-auto px-4 py-2 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5 self-start sm:self-auto decoration-transparent"
          >
            Log New Requisition
          </button>
        </div>

        {/* Filter Toolbar Area */}
        <div className="border border-slate-200 rounded-lg p-3 bg-white flex flex-col md:flex-row gap-2.5 items-center mb-4 shadow-sm">
          <div className="relative w-full md:flex-1">
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search Patient Name, Phone, Asset, Care Center, Deal, Unit, Mode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-8 py-2 border border-slate-200 rounded-md text-xs placeholder:text-slate-400 text-slate-700 focus:outline-none focus:border-slate-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2 text-slate-300 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Care Center Filter */}
          <div className="w-full md:w-44">
            <select
              value={careCenterFilter}
              onChange={(e) => setCareCenterFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">Care Center: All</option>
              {careCenters.map((center) => (
                <option
                  key={center.carecenter_id}
                  value={center.carecenter_name}
                >
                  {center.carecenter_name}
                </option>
              ))}
            </select>
          </div>

          {/* Deal Type Filter */}
          <div className="w-full md:w-36">
            <select
              value={dealTypeFilter}
              onChange={(e) => setDealTypeFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">Deal: All</option>
              {uniqueDealTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Filter */}
          <div className="w-full md:w-36">
            <select
              value={unitTypeFilter}
              onChange={(e) => setUnitTypeFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">Unit: All</option>
              {uniqueUnitTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div className="w-full md:w-36">
            <select
              value={modeTypeFilter}
              onChange={(e) => setModeTypeFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">Mode: All</option>
              {uniqueModeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full md:w-auto px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-600 rounded-md transition font-medium"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-slate-400 font-bold mb-3 px-0.5 tracking-wide">
          {filteredRentals.length} records shown
        </p>

        {/* Master Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-2">
              <div className="w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs font-medium">
                Fetching real-time records entries...
              </p>
            </div>
          ) : filteredRentals.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs font-medium">
              No matching client requisition entries discovered.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest bg-white">
                      <th className="px-6 py-4 font-bold w-28">Status</th>
                      {/* <th className="px-6 py-4 font-bold w-28">Deal types</th>
                      <th className="px-6 py-4 font-bold w-28">Units</th>
                      <th className="px-6 py-4 font-bold w-28">Modes</th> */}
                      <th className="px-6 py-4 font-bold">Device</th>
                      <th className="px-6 py-4 font-bold">Patients</th>
                      <th className="px-6 py-4 font-bold w-36">Login Date</th>
                      <th className="px-6 py-4 font-bold w-36">Logout Date</th>
                      <th className="px-6 py-4 font-bold w-32">Total Days</th>
                      <th className="px-6 py-4 font-bold w-56 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                    {currentRecords.map((rental) => {
                      const displayDeviceModel =
                        rental.device?.device_name || "Equipment Asset";

                      return (
                        <tr
                          key={rental.rental_id}
                          className="hover:bg-slate-50/40 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            {getStatusBadge(rental.status)}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap align-middle">
                            {rental.deal_type || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            {rental.unit_type || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            {rental.mode_type || "—"}
                          </td> */}
                          <td className="px-6 py-4 font-bold text-[#0e4a67] hover:underline cursor-pointer align-middle">
                            {displayDeviceModel}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800 align-middle">
                            {rental.patient_name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap align-middle">
                            {formatDisplayDate(rental.login_date)}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap align-middle">
                            {formatDisplayDate(rental.login_out_date)}
                          </td>
                          <td className="px-6 py-4 font-medium align-middle">
                            {calculateTotalDays(
                              rental.login_date,
                              rental.login_out_date,
                              rental.status,
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                            <div className="flex items-center justify-center gap-1.5">

                               {/* NEW: Calculate Days Button */}
                              <button
                                type="button"
                                onClick={() => openCalcModal(rental)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded transition border border-amber-200"
                              >
                                Calc
                              </button>

                              {/* View */}
                              <Link
                                to={`/rental-view/${rental.rental_id}`}
                                className="inline-block px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition"
                              >
                                View
                              </Link>

                              {/* Edit */}
                              <Link
                                to={`/rental-edit/${rental.rental_id}`}
                                className="inline-block px-2.5 py-1 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-[11px] rounded shadow-sm transition"
                              >
                                Edit
                              </Link>

                             

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteClick(rental.rental_id)
                                }
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing {indexOfFirstRecord + 1}–
                    {Math.min(indexOfLastRecord, filteredRentals.length)} of{" "}
                    {filteredRentals.length} records
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-1 text-slate-400 text-xs">
                                …
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[32px] px-2.5 py-1.5 text-xs font-bold rounded-md border transition ${
                                currentPage === page
                                  ? "bg-[#0e4a67] text-white border-[#0e4a67]"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===================== CALCULATE DAYS MODAL ===================== */}
      {calcModalOpen && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={closeCalcModal}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Calculate Total Days
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedRental.patient_name || "Patient"} •{" "}
                  {selectedRental.device?.device_name || "Device"}
                </p>
              </div>
              <button
                onClick={closeCalcModal}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition text-lg"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Login Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Login Date
                </label>
                <input
                  type="date"
                  value={editLoginDate}
                  onChange={(e) => setEditLoginDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:border-[#0e4a67] focus:ring-1 focus:ring-[#0e4a67]/20"
                />
              </div>

              {/* Logout Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Logout Date
                </label>
                <input
                  type="date"
                  value={editLogoutDate}
                  onChange={(e) => setEditLogoutDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:border-[#0e4a67] focus:ring-1 focus:ring-[#0e4a67]/20"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Leave empty to calculate until today
                </p>
              </div>

              {/* Result Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Total Days
                </p>
                <p className="text-2xl font-bold text-[#0e4a67]">
                  {modalDays}
                  <span className="text-base font-medium text-slate-500 ml-1">
                    / {modalMonth}
                  </span>
                </p>
                {!editLogoutDate && modalDays >= 30 && (
                  <p className="text-xs font-bold text-[#c27803] mt-1">(Due)</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={closeCalcModal}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyDateChanges}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0e4a67] hover:bg-[#0a384e] rounded-md shadow-sm transition"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
