// import React, { useState, useEffect, useCallback } from "react";
// import DashboardLayout from "../Admin/Layout";
// import { useNavigate, Link } from "react-router-dom";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export default function RentalMasterList({ onEdit, onView, onCreateNew }) {
//   const navigate = useNavigate();
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [careCenters, setCareCenters] = useState([]);

//   // Filter Panel States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [careCenterFilter, setCareCenterFilter] = useState("All");
//   const [dealTypeFilter, setDealTypeFilter] = useState("All");
//   const [unitTypeFilter, setUnitTypeFilter] = useState("All");
//   const [modeTypeFilter, setModeTypeFilter] = useState("All");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // Calculate Days Modal State
//   const [calcModalOpen, setCalcModalOpen] = useState(false);
//   const [selectedRental, setSelectedRental] = useState(null);
//   const [editLoginDate, setEditLoginDate] = useState("");
//   const [editLogoutDate, setEditLogoutDate] = useState("");

//   // Debounce search (300ms)
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
//     return () => clearTimeout(t);
//   }, [searchTerm]);

//   // Fetch rentals with server-side filters
//   const fetchRentals = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams();

//       if (debouncedSearch) params.set("search", debouncedSearch);
//       if (dealTypeFilter !== "All") params.set("deal_type", dealTypeFilter);
//       if (unitTypeFilter !== "All") params.set("unit_type", unitTypeFilter);
//       if (modeTypeFilter !== "All") params.set("mode_type", modeTypeFilter);
//       if (careCenterFilter !== "All") {
//         params.set("care_center_id", careCenterFilter);
//       }

//       const query = params.toString();
//       const url = `${API_BASE_URL}/api/rentals${query ? `?${query}` : ""}`;

//       const res = await fetch(url, {
//         headers: { ...(token && { Authorization: `Bearer ${token}` }) },
//       });
//       const result = await res.json();
//       if (result.success) {
//         setRentals(result.data || []);
//       } else {
//         setRentals([]);
//       }
//     } catch (err) {
//       console.error("Error pulling master deployment matrix:", err);
//       setRentals([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     debouncedSearch,
//     dealTypeFilter,
//     unitTypeFilter,
//     modeTypeFilter,
//     careCenterFilter,
//   ]);

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
//     fetchCareCenters();
//   }, []);

//   useEffect(() => {
//     fetchRentals();
//   }, [fetchRentals]);

//   // Delete handler
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
//       setRentals((prev) => prev.filter((item) => item.rental_id !== rentalId));
//     } catch (error) {
//       console.error("Deletion lifecycle crash:", error);
//       alert(`Error processing request: ${error.message}`);
//     }
//   };

//   // Reset Filters
//   const handleReset = () => {
//     setSearchTerm("");
//     setDebouncedSearch("");
//     setCareCenterFilter("All");
//     setDealTypeFilter("All");
//     setUnitTypeFilter("All");
//     setModeTypeFilter("All");
//     setCurrentPage(1);
//   };

//   // Calculate total days: login_date → login_out_date (or today)
//   const calculateTotalDays = (loginDate, logoutDate, status) => {
//     if (!loginDate) return "0";

//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const month = end.getMonth() + 1;

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

//   const getDaysNumber = (loginDate, logoutDate) => {
//     if (!loginDate) return 0;
//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();
//     const diffTime = Math.abs(end - start);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

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

//   const toInputDate = (dateString) => {
//     if (!dateString) return "";
//     if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
//       return dateString.slice(0, 10);
//     }
//     const d = new Date(dateString);
//     if (isNaN(d)) return "";
//     return d.toISOString().slice(0, 10);
//   };

//   const openCalcModal = (rental) => {
//     setSelectedRental(rental);
//     setEditLoginDate(toInputDate(rental.login_date));
//     setEditLogoutDate(toInputDate(rental.login_out_date));
//     setCalcModalOpen(true);
//   };

//   const closeCalcModal = () => {
//     setCalcModalOpen(false);
//     setSelectedRental(null);
//     setEditLoginDate("");
//     setEditLogoutDate("");
//   };

//   const applyDateChanges = () => {
//     if (!selectedRental) return;
//     setRentals((prev) =>
//       prev.map((item) =>
//         item.rental_id === selectedRental.rental_id
//           ? {
//               ...item,
//               login_date: editLoginDate || null,
//               login_out_date: editLogoutDate || null,
//             }
//           : item,
//       ),
//     );
//     closeCalcModal();
//   };

//   // Unique filter options from current result set (or you can hardcode known enums)
//   const uniqueDealTypes = [
//     ...new Set(rentals.map((r) => r.deal_type).filter(Boolean)),
//   ];
//   const uniqueUnitTypes = [
//     ...new Set(rentals.map((r) => r.unit_type).filter(Boolean)),
//   ];
//   const uniqueModeTypes = [
//     ...new Set(rentals.map((r) => r.mode_type).filter(Boolean)),
//   ];

//   // Server already filtered – use rentals directly
//   const filteredRentals = rentals;

//   // Pagination
//   const totalPages = Math.ceil(filteredRentals.length / recordsPerPage) || 1;
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredRentals.slice(
//     indexOfFirstRecord,
//     indexOfLastRecord,
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     debouncedSearch,
//     careCenterFilter,
//     dealTypeFilter,
//     unitTypeFilter,
//     modeTypeFilter,
//   ]);

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

//   const modalDays = getDaysNumber(editLoginDate, editLogoutDate);
//   const modalMonth = editLogoutDate
//     ? new Date(editLogoutDate).getMonth() + 1
//     : new Date().getMonth() + 1;

//   return (
//     <DashboardLayout>
//       <div className="w-full mx-auto p-6 bg-white min-h-screen">
//         {/* Header */}
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
//             className="w-full sm:w-auto px-4 py-2 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
//           >
//             Log New Requisition
//           </button>
//         </div>

//         {/* Filter Toolbar */}
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

//           {/* Care Center – value = carecenter_id */}
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
//                   value={String(center.carecenter_id)}
//                 >
//                   {center.carecenter_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Deal Type */}
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
//               {/* Fallback static options if data empty */}
//               {!uniqueDealTypes.includes("B2B") && (
//                 <option value="B2B">B2B</option>
//               )}
//               {!uniqueDealTypes.includes("B2C") && (
//                 <option value="B2C">B2C</option>
//               )}
//             </select>
//           </div>

//           {/* Unit */}
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
//               {!uniqueUnitTypes.includes("CWF") && (
//                 <option value="CWF">CWF</option>
//               )}
//               {!uniqueUnitTypes.includes("ODCOM") && (
//                 <option value="ODCOM">ODCOM</option>
//               )}
//             </select>
//           </div>

//           {/* Mode */}
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
//               {!uniqueModeTypes.includes("Prepaid") && (
//                 <option value="Prepaid">Prepaid</option>
//               )}
//               {!uniqueModeTypes.includes("Postpaid") && (
//                 <option value="Postpaid">Postpaid</option>
//               )}
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

//         {/* Table */}
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
//                       <th className="px-6 py-4 font-bold">Device</th>
//                       <th className="px-6 py-4 font-bold">Patients</th>
//                       <th className="px-6 py-4 font-bold w-36">Login Date</th>
//                       <th className="px-6 py-4 font-bold w-36">Logout Date</th>
//                       <th className="px-6 py-4 font-bold w-32">Total Days</th>
//                       <th className="px-6 py-4 font-bold w-56 text-center">
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
//                             <div className="flex items-center justify-center gap-1.5">
//                               <button
//                                 type="button"
//                                 onClick={() => openCalcModal(rental)}
//                                 className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded transition border border-amber-200"
//                               >
//                                 Calc
//                               </button>
//                               <Link
//                                 to={`/rental-view/${rental.rental_id}`}
//                                 className="inline-block px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition"
//                               >
//                                 View
//                               </Link>
//                               <Link
//                                 to={`/rental-edit/${rental.rental_id}`}
//                                 className="inline-block px-2.5 py-1 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-[11px] rounded shadow-sm transition"
//                               >
//                                 Edit
//                               </Link>
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

//               {/* Pagination */}
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

//       {/* Calculate Days Modal */}
//       {calcModalOpen && selectedRental && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
//             onClick={closeCalcModal}
//           ></div>
//           <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
//             <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
//               <div>
//                 <h3 className="text-sm font-bold text-[#0f172a]">
//                   Calculate Total Days
//                 </h3>
//                 <p className="text-[11px] text-slate-400 mt-0.5">
//                   {selectedRental.patient_name || "Patient"} •{" "}
//                   {selectedRental.device?.device_name || "Device"}
//                 </p>
//               </div>
//               <button
//                 onClick={closeCalcModal}
//                 className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition text-lg"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-5 space-y-4">
//               <div>
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//                   Login Date
//                 </label>
//                 <input
//                   type="date"
//                   value={editLoginDate}
//                   onChange={(e) => setEditLoginDate(e.target.value)}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:border-[#0e4a67] focus:ring-1 focus:ring-[#0e4a67]/20"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//                   Logout Date
//                 </label>
//                 <input
//                   type="date"
//                   value={editLogoutDate}
//                   onChange={(e) => setEditLogoutDate(e.target.value)}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:border-[#0e4a67] focus:ring-1 focus:ring-[#0e4a67]/20"
//                 />
//                 <p className="text-[10px] text-slate-400 mt-1">
//                   Leave empty to calculate until today
//                 </p>
//               </div>
//               <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
//                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
//                   Total Days
//                 </p>
//                 <p className="text-2xl font-bold text-[#0e4a67]">
//                   {modalDays}
//                   <span className="text-base font-medium text-slate-500 ml-1">
//                     / {modalMonth}
//                   </span>
//                 </p>
//                 {!editLogoutDate && modalDays >= 30 && (
//                   <p className="text-xs font-bold text-[#c27803] mt-1">(Due)</p>
//                 )}
//               </div>
//             </div>
//             <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
//               <button
//                 type="button"
//                 onClick={closeCalcModal}
//                 className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={applyDateChanges}
//                 className="px-4 py-2 text-xs font-bold text-white bg-[#0e4a67] hover:bg-[#0a384e] rounded-md shadow-sm transition"
//               >
//                 Apply Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }




import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../Admin/Layout";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalMasterList({ onEdit, onView, onCreateNew }) {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careCenters, setCareCenters] = useState([]);

  // Filter Panel States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [careCenterFilter, setCareCenterFilter] = useState("All");
  const [dealTypeFilter, setDealTypeFilter] = useState("All");
  const [unitTypeFilter, setUnitTypeFilter] = useState("All");
  const [modeTypeFilter, setModeTypeFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Calculate Days Modal State
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [editLoginDate, setEditLoginDate] = useState("");
  const [editLogoutDate, setEditLogoutDate] = useState("");

  // Debounce search (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch rentals with server-side filters
  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (dealTypeFilter !== "All") params.set("deal_type", dealTypeFilter);
      if (unitTypeFilter !== "All") params.set("unit_type", unitTypeFilter);
      if (modeTypeFilter !== "All") params.set("mode_type", modeTypeFilter);
      if (careCenterFilter !== "All") {
        params.set("care_center_id", careCenterFilter);
      }

      const query = params.toString();
      const url = `${API_BASE_URL}/api/rentals${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const result = await res.json();
      if (result.success) {
        setRentals(result.data || []);
      } else {
        setRentals([]);
      }
    } catch (err) {
      console.error("Error pulling master deployment matrix:", err);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    dealTypeFilter,
    unitTypeFilter,
    modeTypeFilter,
    careCenterFilter,
  ]);

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
    fetchCareCenters();
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Delete handler
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
      setRentals((prev) => prev.filter((item) => item.rental_id !== rentalId));
    } catch (error) {
      console.error("Deletion lifecycle crash:", error);
      alert(`Error processing request: ${error.message}`);
    }
  };

  // Reset Filters
  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCareCenterFilter("All");
    setDealTypeFilter("All");
    setUnitTypeFilter("All");
    setModeTypeFilter("All");
    setCurrentPage(1);
  };

  // ====================== TOTAL DAYS LOGIC ======================
  // Same month examples:
  // 05.08.2026 → 20.08.2026 = 15/15
  // 11.08.2026 → 21.08.2026 = 10/10
  // 10.08.2026 → 20.08.2026 = 10/10
  //
  // Cross month example:
  // 20.08.2026 → 06.09.2026 = 17/6   (standard day difference)
  // 10.08.2026 → 06.09.2026 = 27/6
  //
  // Rule:
  // - totalDays = exact calendar day difference
  // - Same month  → show totalDays / totalDays   (X/X)
  // - Different month → show totalDays / logout day
  const calculateTotalDays = (loginDate, logoutDate, status) => {
    if (!loginDate) return "0";

    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();

    // Normalize to midnight to avoid time-of-day issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isSameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

    // Same month → second number = days themselves (X/X)
    // Cross month → second number = day of logout/today
    const secondNumber = isSameMonth ? diffDays : end.getDate();

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
            {diffDays}/{secondNumber} (Due)
          </span>
        );
      }
    }

    return (
      <span className="text-slate-700 font-medium">
        {diffDays}/{secondNumber}
      </span>
    );
  };

  const getDaysNumber = (loginDate, logoutDate) => {
    if (!loginDate) return 0;
    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSecondNumber = (loginDate, logoutDate) => {
    if (!loginDate) return 0;
    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffDays = getDaysNumber(loginDate, logoutDate);

    const isSameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

    return isSameMonth ? diffDays : end.getDate();
  };

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

  const toInputDate = (dateString) => {
    if (!dateString) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.slice(0, 10);
    }
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  const openCalcModal = (rental) => {
    setSelectedRental(rental);
    setEditLoginDate(toInputDate(rental.login_date));
    setEditLogoutDate(toInputDate(rental.login_out_date));
    setCalcModalOpen(true);
  };

  const closeCalcModal = () => {
    setCalcModalOpen(false);
    setSelectedRental(null);
    setEditLoginDate("");
    setEditLogoutDate("");
  };

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

  // Unique filter options from current result set
  const uniqueDealTypes = [
    ...new Set(rentals.map((r) => r.deal_type).filter(Boolean)),
  ];
  const uniqueUnitTypes = [
    ...new Set(rentals.map((r) => r.unit_type).filter(Boolean)),
  ];
  const uniqueModeTypes = [
    ...new Set(rentals.map((r) => r.mode_type).filter(Boolean)),
  ];

  // Server already filtered – use rentals directly
  const filteredRentals = rentals;

  // Pagination
  const totalPages = Math.ceil(filteredRentals.length / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRentals.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    careCenterFilter,
    dealTypeFilter,
    unitTypeFilter,
    modeTypeFilter,
  ]);

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

  const modalDays = getDaysNumber(editLoginDate, editLogoutDate);
  const modalSecond = getSecondNumber(editLoginDate, editLogoutDate);

  return (
    <DashboardLayout>
      <div className="w-full mx-auto p-6 bg-white min-h-screen">
        {/* Header */}
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
            className="w-full sm:w-auto px-4 py-2 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            Log New Requisition
          </button>
        </div>

        {/* Filter Toolbar */}
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

          {/* Care Center */}
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
                  value={String(center.carecenter_id)}
                >
                  {center.carecenter_name}
                </option>
              ))}
            </select>
          </div>

          {/* Deal Type */}
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
              {!uniqueDealTypes.includes("B2B") && (
                <option value="B2B">B2B</option>
              )}
              {!uniqueDealTypes.includes("B2C") && (
                <option value="B2C">B2C</option>
              )}
            </select>
          </div>

          {/* Unit */}
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
              {!uniqueUnitTypes.includes("CWF") && (
                <option value="CWF">CWF</option>
              )}
              {!uniqueUnitTypes.includes("ODCOM") && (
                <option value="ODCOM">ODCOM</option>
              )}
            </select>
          </div>

          {/* Mode */}
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
              {!uniqueModeTypes.includes("Prepaid") && (
                <option value="Prepaid">Prepaid</option>
              )}
              {!uniqueModeTypes.includes("Postpaid") && (
                <option value="Postpaid">Postpaid</option>
              )}
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

        {/* Table */}
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
                              <button
                                type="button"
                                onClick={() => openCalcModal(rental)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded transition border border-amber-200"
                              >
                                Calc
                              </button>
                              <Link
                                to={`/rental-view/${rental.rental_id}`}
                                className="inline-block px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition"
                              >
                                View
                              </Link>
                              <Link
                                to={`/rental-edit/${rental.rental_id}`}
                                className="inline-block px-2.5 py-1 bg-[#0e4a67] hover:bg-[#0a384e] text-white font-bold text-[11px] rounded shadow-sm transition"
                              >
                                Edit
                              </Link>
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

              {/* Pagination */}
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

      {/* Calculate Days Modal */}
      {calcModalOpen && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={closeCalcModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
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
            <div className="p-5 space-y-4">
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
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Total Days
                </p>
                <p className="text-2xl font-bold text-[#0e4a67]">
                  {modalDays}
                  <span className="text-base font-medium text-slate-500 ml-1">
                    / {modalSecond}
                  </span>
                </p>
                {!editLogoutDate && modalDays >= 30 && (
                  <p className="text-xs font-bold text-[#c27803] mt-1">(Due)</p>
                )}
              </div>
            </div>
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