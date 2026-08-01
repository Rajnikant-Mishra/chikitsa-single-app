// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../Admin/Layout";

// const getToken = () => localStorage.getItem("token");
// // Root API Base URL string
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const INITIAL_DEVICE_STATE = {
//   device_id: "", // Matches primary key backend device_id
//   device_name: "", // Matches model device_name
//   status: "active",
// };

// const INITIAL_ACCESSORY_STATE = {
//   accessory_id: "",
//   accessory_name: "",
//   status: "active",
// };


// const INITIAL_CARE_STATE = {
//   carecenter_id: "",
//   carecenter_name: "",
//   address: "",
//   mobile_number: "",
//   alternative_mobile_number: "",
//   status: "active",
// };

// const INITIAL_REFERENCE_STATE = {
//   reference_id: "",
//   doctor_name: "",
//   specialist: "",
//   mobile_number: "",
//   alternative_number: "",
//   hospital_name: "",
//   status: "active",
// };

// const INITIAL_DELIVERY_STATE = {
//   delivery_executive_id: "",
//   delivery_name: "",
//   mobile_number: "",
//   status: "active",
// };

// export default function App() {
//   const [activeTab, setActiveTab] = useState("device");
//   const [assets, setAssets] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState(null);

//   // --- COMPONENT DATA STATE MANAGEMENT ---
//   const [deviceForm, setDeviceForm] = useState(INITIAL_DEVICE_STATE);
//   const [accessoryForm, setAccessoryForm] = useState(INITIAL_ACCESSORY_STATE);
//   const [careForm, setCareForm] = useState(INITIAL_CARE_STATE);
//   const [referenceForm, setReferenceForm] = useState(INITIAL_REFERENCE_STATE);
//   const [deliveryForm, setDeliveryForm] = useState(INITIAL_DELIVERY_STATE);

//   // --- DYNAMIC MODULE METADATA RESOLVER ---
//   const getModuleConfig = (tab) => {
//     switch (tab) {
//       case "device":
//         return { endpoint: `${BASE_URL}/api/devices`, idKey: "device_id" };
//       case "accessories":
//         return { endpoint: `${BASE_URL}/api/accessori`, idKey: "accessory_id" }; // Matches backend router binding route
//       case "care":
//         return { endpoint: `${BASE_URL}/api/carecenters`, idKey: "carecenter_id" };
//       case "reference":
//         return { endpoint: `${BASE_URL}/api/references`, idKey: "reference_id" };
//       case "delivery":
//         return { endpoint: `${BASE_URL}/api/delivery-executives`, idKey: "delivery_executive_id" };
//       default:
//         return { endpoint: `${BASE_URL}/api/devices`, idKey: "device_id" };
//     }
//   };

//   // --- API REQUEST HEADER BUILDER ---
//   const getRequestHeaders = () => {
//     const token = getToken();
//     return {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   };

//   // --- API EXCEPTION HANDLER ---
//   const handleApiError = (res, fallbackMessage) => {
//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       throw new Error("Session expired. Please log back into your admin portal.");
//     }
//     throw new Error(fallbackMessage);
//   };

//   // --- READ OPERATION (Dynamic Fetcher) ---
//   const fetchAssets = async () => {
//     try {
//       setIsLoading(true);
//       setErrorMsg(null);
//       const { endpoint } = getModuleConfig(activeTab);

//       const res = await fetch(endpoint, { headers: getRequestHeaders() });
//       if (!res.ok) handleApiError(res, `Failed to load ${activeTab} records.`);

//       const result = await res.json();
//       // Supports array payloads matching direct database return arrays or standard wrappers
//       const dataPayload = Array.isArray(result) ? result : (result.data || []);
//       setAssets(dataPayload);
//     } catch (err) {
//       setErrorMsg(err.message);
//       setAssets([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, [activeTab]);

//   // --- CREATE & UPDATE OPERATIONS ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { endpoint, idKey } = getModuleConfig(activeTab);
    
//     let currentForm;
//     if (activeTab === "device") currentForm = deviceForm;
//     if (activeTab === "accessories") currentForm = accessoryForm;
//     if (activeTab === "care") currentForm = careForm;
//     if (activeTab === "reference") currentForm = referenceForm;
//     if (activeTab === "delivery") currentForm = deliveryForm;

//     const targetId = currentForm[idKey];
//     const isEditMode = !!targetId;
    
//     const url = isEditMode ? `${endpoint}/${targetId}` : endpoint;
//     const method = isEditMode ? "PUT" : "POST";

//     // Build standard payload copy cleanly out of react form binding
//     const bodyPayload = { ...currentForm };
//     delete bodyPayload[idKey]; // Remove identifier fields for standard inserts

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: getRequestHeaders(),
//         body: JSON.stringify(bodyPayload),
//       });

//       if (!res.ok) {
//         const errRes = await res.json().catch(() => ({}));
//         handleApiError(res, errRes.message || "Unable to modify configuration record.");
//       }

//       alert(isEditMode ? "Configuration record updated." : "Record created successfully.");
//       handleCloseModal();
//       fetchAssets();
//     } catch (err) {
//       alert(`Operation failed: ${err.message}`);
//     }
//   };

//   // --- DELETE OPERATION ---
//   const handleDelete = async (id) => {
//     if (!window.confirm("Permanently delete this entry from ledger instance?")) return;
//     const { endpoint } = getModuleConfig(activeTab);
    
//     try {
//       const res = await fetch(`${endpoint}/${id}`, { 
//         method: "DELETE", 
//         headers: getRequestHeaders() 
//       });

//       if (!res.ok) handleApiError(res, "Failed to eliminate targeted entity node.");
      
//       alert("Entry removed successfully.");
//       fetchAssets();
//     } catch (err) {
//       alert(`Delete error: ${err.message}`);
//     }
//   };

//   // --- UI DIALOG UTILITIES ---
//   const handleOpenModal = (item = null) => {
//     if (activeTab === "device") {
//       setDeviceForm(item ? { ...item } : INITIAL_DEVICE_STATE);
//     } else if (activeTab === "accessories") {
//       setAccessoryForm(item ? { ...item } : INITIAL_ACCESSORY_STATE);
//     } else if (activeTab === "care") {
//       setCareForm(item ? { ...item } : INITIAL_CARE_STATE);
//     } else if (activeTab === "reference") {
//       setReferenceForm(item ? { ...item } : INITIAL_REFERENCE_STATE);
//     } else if (activeTab === "delivery") {
//       setDeliveryForm(item ? { ...item } : INITIAL_DELIVERY_STATE);
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     if (activeTab === "device") setDeviceForm(INITIAL_DEVICE_STATE);
//     if (activeTab === "accessories") setAccessoryForm(INITIAL_ACCESSORY_STATE);
//     if (activeTab === "care") setCareForm(INITIAL_CARE_STATE);
//     if (activeTab === "reference") setReferenceForm(INITIAL_REFERENCE_STATE);
//     if (activeTab === "delivery") setDeliveryForm(INITIAL_DELIVERY_STATE);
//   };

//   // --- COMPUTED ANALYTICS METRICS ---
//   const availableCount = assets.filter((a) => a.status === "active").length;
//   const criticalCount = assets.filter((a) => a.status === "inactive").length;

//   const getStatusStyles = (status) => {
//     switch (status) {
//       case "inactive": return "bg-rose-50 text-rose-700 border-rose-200";
//       default: return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     }
//   };

//   // --- DYNAMIC ACTIONS CONFIGURATOR ---
//   const renderTabAction = () => {
//     const actions = {
//       device: { label: "Add New Asset", icon: "➕" },
//       accessories: { label: "Add New Accessory", icon: "📦" },
//       care: { label: "Add Care Center", icon: "🛠️" },
//       reference: { label: "Link Reference", icon: "📋" },
//       delivery: { label: "Add Delivery Exec", icon: "🚴" }
//     };

//     const currentAction = actions[activeTab];
//     if (!currentAction) return null;

//     return (
//       <button
//         onClick={() => handleOpenModal()}
//         className="bg-[#0e4a67] hover:bg-[#155e82] transition-all text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transform active:scale-95 text-sm whitespace-nowrap"
//       >
//         <span>{currentAction.icon}</span> {currentAction.label}
//       </button>
//     );
//   };

//   return (
//     <DashboardLayout>
//       {/* Sleek, Modernized Top Workspace Bar */}
//       <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Global Inventory Ledger</h1>
//           <p className="text-slate-400 text-xs mt-0.5 font-medium">Real-time modular tracking infrastructure.</p>
//         </div>

//         <div className="flex items-center gap-4 self-end lg:self-auto">
//           <div className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
//             Active: <span className="text-emerald-600 font-bold">{availableCount}</span>
//           </div>
//           <div className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
//             Inactive: <span className="text-rose-600 font-bold">{criticalCount}</span>
//           </div>
//           {renderTabAction()}
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION SYSTEM --- */}
//       <div className="mb-6 border-b border-slate-200 overflow-x-auto flex scrollbar-none">
//         <div className="flex space-x-2 min-w-max pb-1">
//           {[
//             { id: "device", label: "New Device" },
//             { id: "accessories", label: "New Accessories" },
//             { id: "care", label: "Care Center" },
//             { id: "reference", label: "Reference" },
//             { id: "delivery", label: "Delivery Executive" },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-4 py-2.5 font-bold text-sm transition-all rounded-t-xl border-t border-x -mb-[1px] ${
//                 activeTab === tab.id
//                   ? "bg-white text-[#0e4a67] border-slate-200 border-b-white shadow-sm"
//                   : "bg-transparent text-slate-400 border-transparent hover:text-slate-600"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* --- GLOBAL OPERATIONAL FEEDBACK WARNINGS --- */}
//       {errorMsg && (
//         <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex gap-3 text-sm font-semibold items-center">
//           <span>🚨</span> Secure Mode Warn: {errorMsg}
//         </div>
//       )}

//       {/* --- UNIVERSAL LEDGER GRID VIEWER ENGINE --- */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
//                 {activeTab === "device" && (
//                   <>
//                     <th className="py-4 px-6">ID</th>
//                     <th className="py-4 px-6">Device Name</th>
//                     <th className="py-4 px-6">Status</th>
//                   </>
//                 )}
//                 {activeTab === "accessories" && (
//                   <>
//                     <th className="py-4 px-6">ID</th>
//                     <th className="py-4 px-6">Accessory Name</th>
//                     <th className="py-4 px-6">Status</th>
//                   </>
//                 )}
//                 {activeTab === "care" && (
//                   <>
//                     <th className="py-4 px-6">Center Name</th>
//                     <th className="py-4 px-6">Address</th>
//                     <th className="py-4 px-6">Contact Info</th>
//                     <th className="py-4 px-6">Status</th>
//                   </>
//                 )}
//                 {activeTab === "reference" && (
//                   <>
//                     <th className="py-4 px-6">Doctor / Specialist</th>
//                     <th className="py-4 px-6">Hospital</th>
//                     <th className="py-4 px-6">Contact Details</th>
//                     <th className="py-4 px-6">Status</th>
//                   </>
//                 )}
//                 {activeTab === "delivery" && (
//                   <>
//                     <th className="py-4 px-6">Executive Name</th>
//                     <th className="py-4 px-6">Mobile Number</th>
//                     <th className="py-4 px-6">Status</th>
//                   </>
//                 )}
//                 <th className="py-4 px-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-sm font-medium">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="6" className="py-12 text-center text-slate-400">
//                     <div className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full mb-2"></div>
//                     <p>Securing backend proxy ledger arrays...</p>
//                   </td>
//                 </tr>
//               ) : assets.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-12 text-center text-slate-400">No active operational dataset models located.</td>
//                 </tr>
//               ) : (
//                 assets.map((item) => {
//                   const idValue = item[getModuleConfig(activeTab).idKey];
//                   return (
//                     <tr key={idValue || Math.random()} className="hover:bg-slate-50/80 transition-colors">
//                       {activeTab === "device" && (
//                         <>
//                           <td className="py-4 px-6 text-slate-500 font-mono text-xs">#{item.device_id}</td>
//                           <td className="py-4 px-6 text-slate-900 font-bold">{item.device_name}</td>
//                           <td className="py-4 px-6">
//                             <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(item.status)}`}>
//                               {item.status}
//                             </span>
//                           </td>
//                         </>
//                       )}
//                       {activeTab === "accessories" && (
//                         <>
//                           <td className="py-4 px-6 text-slate-500 font-mono text-xs">#{item.accessory_id}</td>
//                           <td className="py-4 px-6 text-slate-900 font-bold">{item.accessory_name}</td>
//                           <td className="py-4 px-6">
//                             <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(item.status)}`}>
//                               {item.status}
//                             </span>
//                           </td>
//                         </>
//                       )}
//                       {activeTab === "care" && (
//                         <>
//                           <td className="py-4 px-6 text-slate-900 font-bold">{item.carecenter_name}</td>
//                           <td className="py-4 px-6 text-slate-500 max-w-[180px] truncate">{item.address}</td>
//                           <td className="py-4 px-6 text-slate-600 text-xs font-mono">
//                             📞 {item.mobile_number} {item.alternative_mobile_number ? `| ${item.alternative_mobile_number}` : ''}
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(item.status)}`}>
//                               {item.status}
//                             </span>
//                           </td>
//                         </>
//                       )}
//                       {activeTab === "reference" && (
//                         <>
//                           <td className="py-4 px-6">
//                             <p className="text-slate-900 font-bold">{item.doctor_name}</p>
//                             <p className="text-xs text-slate-400 font-medium">{item.specialist}</p>
//                           </td>
//                           <td className="py-4 px-6 text-slate-600 font-medium">{item.hospital_name}</td>
//                           <td className="py-4 px-6 text-slate-600 text-xs font-mono">
//                             📞 {item.mobile_number} {item.alternative_number ? `| ${item.alternative_number}` : ''}
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(item.status)}`}>
//                               {item.status}
//                             </span>
//                           </td>
//                         </>
//                       )}
//                       {activeTab === "delivery" && (
//                         <>
//                           <td className="py-4 px-6 text-slate-900 font-bold">{item.delivery_name}</td>
//                           <td className="py-4 px-6 text-slate-600 font-mono text-xs">🚴 {item.mobile_number}</td>
//                           <td className="py-4 px-6">
//                             <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(item.status)}`}>
//                               {item.status}
//                             </span>
//                           </td>
//                         </>
//                       )}
//                       <td className="py-4 px-6 text-right space-x-3">
//                         <button onClick={() => handleOpenModal(item)} className="text-[#0e4a67] hover:text-[#155e82] transition font-semibold text-sm">Edit</button>
//                         <button onClick={() => handleDelete(idValue)} className="text-rose-500 hover:text-rose-700 transition font-semibold text-sm">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- CENTRALIZED DYNAMIC SYSTEM DIALOG (MODAL) --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
//             <div className="bg-[#0e4a67] text-white p-6 flex justify-between items-center">
//               <h3 className="text-xl font-bold tracking-wide capitalize">
//                 {activeTab === "device" && (deviceForm.device_id ? "📝 Modify Device Asset" : "➕ Register Device Asset")}
//                 {activeTab === "accessories" && (accessoryForm.accessory_id ? "📝 Modify Accessory" : "📦 Add New Accessory")}
//                 {activeTab === "care" && (careForm.carecenter_id ? "📝 Modify Care Center" : "🛠️ Care Center Registry Form")}
//                 {activeTab === "reference" && (referenceForm.reference_id ? "📝 Modify Reference Record" : "📋 Link External Reference Record")}
//                 {activeTab === "delivery" && (deliveryForm.delivery_executive_id ? "📝 Modify Delivery Courier Node" : "🚴 Onboard Delivery Courier Node")}
//               </h3>
//               <button onClick={handleCloseModal} className="text-white/80 hover:text-white text-xl">✕</button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               {activeTab === "device" && (
//                 <>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Device Model Name</label>
//                     <input
//                       type="text"
//                       required
//                       value={deviceForm.device_name}
//                       onChange={(e) => setDeviceForm({ ...deviceForm, device_name: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                       placeholder="e.g. Oxygen Concentrator X1"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Operational State</label>
//                     <select
//                       value={deviceForm.status}
//                       onChange={(e) => setDeviceForm({ ...deviceForm, status: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               {activeTab === "accessories" && (
//                 <>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Accessory Component Name</label>
//                     <input
//                       type="text"
//                       required
//                       value={accessoryForm.accessory_name}
//                       onChange={(e) => setAccessoryForm({ ...accessoryForm, accessory_name: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                       placeholder="e.g. High Pressure Nasal Cannula"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Status</label>
//                     <select
//                       value={accessoryForm.status}
//                       onChange={(e) => setAccessoryForm({ ...accessoryForm, status: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               {activeTab === "care" && (
//                 <>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Care Center  name</label>
//                     <input
//                       type="text"
//                       required
//                       value={careForm.carecenter_name}
//                       onChange={(e) => setCareForm({ ...careForm, carecenter_name: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                       placeholder="e.g. Lifeline Central Medical Dispatch"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Address</label>
//                     <textarea
//                       required
//                       rows="2"
//                       value={careForm.address}
//                       onChange={(e) => setCareForm({ ...careForm, address: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                       placeholder="Enter operational mailing address"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Mobile number</label>
//                       <input
//                         type="text"
//                         required
//                         value={careForm.mobile_number}
//                         onChange={(e) => setCareForm({ ...careForm, mobile_number: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Alternative Mobile number</label>
//                       <input
//                         type="text"
//                         value={careForm.alternative_mobile_number || ""}
//                         onChange={(e) => setCareForm({ ...careForm, alternative_mobile_number: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Status</label>
//                     <select
//                       value={careForm.status}
//                       onChange={(e) => setCareForm({ ...careForm, status: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               {activeTab === "reference" && (
//                 <>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Doctor Name</label>
//                       <input
//                         type="text"
//                         required
//                         value={referenceForm.doctor_name}
//                         onChange={(e) => setReferenceForm({ ...referenceForm, doctor_name: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Specialist Domain</label>
//                       <input
//                         type="text"
//                         required
//                         value={referenceForm.specialist}
//                         onChange={(e) => setReferenceForm({ ...referenceForm, specialist: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                         placeholder="e.g. Pulmonologist"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hospital Institute Name</label>
//                     <input
//                       type="text"
//                       required
//                       value={referenceForm.hospital_name}
//                       onChange={(e) => setReferenceForm({ ...referenceForm, hospital_name: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Mobile Number</label>
//                       <input
//                         type="text"
//                         required
//                         value={referenceForm.mobile_number}
//                         onChange={(e) => setReferenceForm({ ...referenceForm, mobile_number: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Alternative Number</label>
//                       <input
//                         type="text"
//                         value={referenceForm.alternative_number || ""}
//                         onChange={(e) => setReferenceForm({ ...referenceForm, alternative_number: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Status</label>
//                     <select
//                       value={referenceForm.status}
//                       onChange={(e) => setReferenceForm({ ...referenceForm, status: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               {activeTab === "delivery" && (
//                 <>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Executive Driver Name</label>
//                     <input
//                       type="text"
//                       required
//                       value={deliveryForm.delivery_name}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_name: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
//                       placeholder="Enter legal profile name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Active Mobile Hotline</label>
//                     <input
//                       type="text"
//                       required
//                       value={deliveryForm.mobile_number}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, mobile_number: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
//                       placeholder="e.g. +91XXXXXXXXXX"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Status</label>
//                     <select
//                       value={deliveryForm.status}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, status: e.target.value })}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 text-sm font-bold"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 rounded-xl bg-[#0e4a67] text-white hover:bg-[#155e82] text-sm font-bold shadow-sm"
//                 >
//                   Commit Entry
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }





import React, { useState, useEffect } from "react";
import DashboardLayout from "../Admin/Layout";

const getToken = () => localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const INITIAL_DEVICE_STATE = {
  device_id: "",
  device_name: "",
  status: "active",
};

const INITIAL_ACCESSORY_STATE = {
  accessory_id: "",
  accessory_name: "",
  status: "active",
};

const INITIAL_CARE_STATE = {
  carecenter_id: "",
  carecenter_name: "",
  address: "",
  mobile_number: "",
  alternative_mobile_number: "",
  status: "active",
};

const INITIAL_REFERENCE_STATE = {
  reference_id: "",
  doctor_name: "",
  specialist: "",
  mobile_number: "",
  alternative_number: "",
  hospital_name: "",
  status: "active",
};

const INITIAL_DELIVERY_STATE = {
  delivery_executive_id: "",
  delivery_name: "",
  mobile_number: "",
  status: "active",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("device");
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [deviceForm, setDeviceForm] = useState(INITIAL_DEVICE_STATE);
  const [accessoryForm, setAccessoryForm] = useState(INITIAL_ACCESSORY_STATE);
  const [careForm, setCareForm] = useState(INITIAL_CARE_STATE);
  const [referenceForm, setReferenceForm] = useState(INITIAL_REFERENCE_STATE);
  const [deliveryForm, setDeliveryForm] = useState(INITIAL_DELIVERY_STATE);

  // ---------- helpers ----------
  const getModuleConfig = (tab) => {
    switch (tab) {
      case "device":
        return { endpoint: `${BASE_URL}/api/devices`, idKey: "device_id" };
      case "accessories":
        // Keep the exact backend route you had originally
        return { endpoint: `${BASE_URL}/api/accessori`, idKey: "accessory_id" };
      case "care":
        return { endpoint: `${BASE_URL}/api/carecenters`, idKey: "carecenter_id" };
      case "reference":
        return { endpoint: `${BASE_URL}/api/references`, idKey: "reference_id" };
      case "delivery":
        return {
          endpoint: `${BASE_URL}/api/delivery-executives`,
          idKey: "delivery_executive_id",
        };
      default:
        return { endpoint: `${BASE_URL}/api/devices`, idKey: "device_id" };
    }
  };

  const getRequestHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      console.warn("Non-JSON response:", text.slice(0, 200));
      return null;
    }
  };

  const handleApiError = (res, fallbackMessage) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please log back into your admin portal.");
    }
    throw new Error(fallbackMessage);
  };

  // ---------- form helpers ----------
  const getCurrentForm = () => {
    switch (activeTab) {
      case "device":
        return deviceForm;
      case "accessories":
        return accessoryForm;
      case "care":
        return careForm;
      case "reference":
        return referenceForm;
      case "delivery":
        return deliveryForm;
      default:
        return deviceForm;
    }
  };

  const setCurrentForm = (value) => {
    switch (activeTab) {
      case "device":
        setDeviceForm(value);
        break;
      case "accessories":
        setAccessoryForm(value);
        break;
      case "care":
        setCareForm(value);
        break;
      case "reference":
        setReferenceForm(value);
        break;
      case "delivery":
        setDeliveryForm(value);
        break;
      default:
        break;
    }
  };

  const resetCurrentForm = () => {
    switch (activeTab) {
      case "device":
        setDeviceForm(INITIAL_DEVICE_STATE);
        break;
      case "accessories":
        setAccessoryForm(INITIAL_ACCESSORY_STATE);
        break;
      case "care":
        setCareForm(INITIAL_CARE_STATE);
        break;
      case "reference":
        setReferenceForm(INITIAL_REFERENCE_STATE);
        break;
      case "delivery":
        setDeliveryForm(INITIAL_DELIVERY_STATE);
        break;
      default:
        break;
    }
  };

  // ---------- API ----------
  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const { endpoint } = getModuleConfig(activeTab);

      const res = await fetch(endpoint, { headers: getRequestHeaders() });

      if (!res.ok) {
        const errData = await safeJson(res);
        handleApiError(
          res,
          errData?.message || `Failed to load ${activeTab} records.`
        );
      }

      const result = await safeJson(res);
      const dataPayload = Array.isArray(result)
        ? result
        : result?.data ?? [];
      setAssets(dataPayload);
    } catch (err) {
      setErrorMsg(err.message);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { endpoint, idKey } = getModuleConfig(activeTab);
    const currentForm = getCurrentForm();
    const targetId = currentForm[idKey];
    const isEditMode = !!targetId;

    const url = isEditMode ? `${endpoint}/${targetId}` : endpoint;
    const method = isEditMode ? "PUT" : "POST";

    const bodyPayload = { ...currentForm };
    delete bodyPayload[idKey];

    try {
      setIsSubmitting(true);
      const res = await fetch(url, {
        method,
        headers: getRequestHeaders(),
        body: JSON.stringify(bodyPayload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        handleApiError(
          res,
          data?.message || "Unable to modify configuration record."
        );
      }

      alert(
        isEditMode
          ? "Configuration record updated."
          : "Record created successfully."
      );
      handleCloseModal();
      fetchAssets();
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this entry from ledger instance?"))
      return;

    const { endpoint } = getModuleConfig(activeTab);

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: getRequestHeaders(),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        handleApiError(
          res,
          data?.message || "Failed to eliminate targeted entity node."
        );
      }

      alert("Entry removed successfully.");
      fetchAssets();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // ---------- UI helpers ----------
  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentForm({ ...item });
    } else {
      resetCurrentForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetCurrentForm();
  };

  const availableCount = assets.filter((a) => a.status === "active").length;
  const criticalCount = assets.filter((a) => a.status === "inactive").length;

  const getStatusStyles = (status) => {
    switch (status) {
      case "inactive":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const renderTabAction = () => {
    const actions = {
      device: { label: "Add New Asset", icon: "➕" },
      accessories: { label: "Add New Accessory", icon: "📦" },
      care: { label: "Add Care Center", icon: "🛠️" },
      reference: { label: "Link Reference", icon: "📋" },
      delivery: { label: "Add Delivery Exec", icon: "🚴" },
    };

    const currentAction = actions[activeTab];
    if (!currentAction) return null;

    return (
      <button
        onClick={() => handleOpenModal()}
        className="bg-[#0e4a67] hover:bg-[#155e82] transition-all text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transform active:scale-95 text-sm whitespace-nowrap"
      >
        <span>{currentAction.icon}</span> {currentAction.label}
      </button>
    );
  };

  // ---------- render ----------
  return (
    <DashboardLayout>
      {/* Top bar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Global Inventory Ledger
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">
            Real-time modular tracking infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-4 self-end lg:self-auto">
          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
            Active:{" "}
            <span className="text-emerald-600 font-bold">{availableCount}</span>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
            Inactive:{" "}
            <span className="text-rose-600 font-bold">{criticalCount}</span>
          </div>
          {renderTabAction()}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200 overflow-x-auto flex scrollbar-none">
        <div className="flex space-x-2 min-w-max pb-1">
          {[
            { id: "device", label: "New Device" },
            { id: "accessories", label: "New Accessories" },
            { id: "care", label: "Care Center" },
            { id: "reference", label: "Reference" },
            { id: "delivery", label: "Delivery Executive" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-bold text-sm transition-all rounded-t-xl border-t border-x -mb-[1px] ${
                activeTab === tab.id
                  ? "bg-white text-[#0e4a67] border-slate-200 border-b-white shadow-sm"
                  : "bg-transparent text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex gap-3 text-sm font-semibold items-center">
          <span>🚨</span> Secure Mode Warn: {errorMsg}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeTab === "device" && (
                  <>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Device Name</th>
                    <th className="py-4 px-6">Status</th>
                  </>
                )}
                {activeTab === "accessories" && (
                  <>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Accessory Name</th>
                    <th className="py-4 px-6">Status</th>
                  </>
                )}
                {activeTab === "care" && (
                  <>
                    <th className="py-4 px-6">Center Name</th>
                    <th className="py-4 px-6">Address</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Status</th>
                  </>
                )}
                {activeTab === "reference" && (
                  <>
                    <th className="py-4 px-6">Doctor / Specialist</th>
                    <th className="py-4 px-6">Hospital</th>
                    <th className="py-4 px-6">Contact Details</th>
                    <th className="py-4 px-6">Status</th>
                  </>
                )}
                {activeTab === "delivery" && (
                  <>
                    <th className="py-4 px-6">Executive Name</th>
                    <th className="py-4 px-6">Mobile Number</th>
                    <th className="py-4 px-6">Status</th>
                  </>
                )}
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full mb-2"></div>
                    <p>Securing backend proxy ledger arrays...</p>
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No active operational dataset models located.
                  </td>
                </tr>
              ) : (
                assets.map((item, index) => {
                  const idValue = item[getModuleConfig(activeTab).idKey];
                  return (
                    <tr
                      key={idValue ?? `row-${index}`}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {activeTab === "device" && (
                        <>
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                            #{item.device_id}
                          </td>
                          <td className="py-4 px-6 text-slate-900 font-bold">
                            {item.device_name}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "accessories" && (
                        <>
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                            #{item.accessory_id}
                          </td>
                          <td className="py-4 px-6 text-slate-900 font-bold">
                            {item.accessory_name}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "care" && (
                        <>
                          <td className="py-4 px-6 text-slate-900 font-bold">
                            {item.carecenter_name}
                          </td>
                          <td className="py-4 px-6 text-slate-500 max-w-[180px] truncate">
                            {item.address}
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs font-mono">
                            📞 {item.mobile_number}
                            {item.alternative_mobile_number
                              ? ` | ${item.alternative_mobile_number}`
                              : ""}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "reference" && (
                        <>
                          <td className="py-4 px-6">
                            <p className="text-slate-900 font-bold">
                              {item.doctor_name}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {item.specialist}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-medium">
                            {item.hospital_name}
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs font-mono">
                            📞 {item.mobile_number}
                            {item.alternative_number
                              ? ` | ${item.alternative_number}`
                              : ""}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "delivery" && (
                        <>
                          <td className="py-4 px-6 text-slate-900 font-bold">
                            {item.delivery_name}
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                            🚴 {item.mobile_number}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="py-4 px-6 text-right space-x-3">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-[#0e4a67] hover:text-[#155e82] transition font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idValue)}
                          className="text-rose-500 hover:text-rose-700 transition font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0e4a67] text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-wide capitalize">
                {activeTab === "device" &&
                  (deviceForm.device_id
                    ? "📝 Modify Device Asset"
                    : "➕ Register Device Asset")}
                {activeTab === "accessories" &&
                  (accessoryForm.accessory_id
                    ? "📝 Modify Accessory"
                    : "📦 Add New Accessory")}
                {activeTab === "care" &&
                  (careForm.carecenter_id
                    ? "📝 Modify Care Center"
                    : "🛠️ Care Center Registry Form")}
                {activeTab === "reference" &&
                  (referenceForm.reference_id
                    ? "📝 Modify Reference Record"
                    : "📋 Link External Reference Record")}
                {activeTab === "delivery" &&
                  (deliveryForm.delivery_executive_id
                    ? "📝 Modify Delivery Courier Node"
                    : "🚴 Onboard Delivery Courier Node")}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-white/80 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* DEVICE */}
              {activeTab === "device" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Device Model Name
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceForm.device_name}
                      onChange={(e) =>
                        setDeviceForm({
                          ...deviceForm,
                          device_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                      placeholder="e.g. Oxygen Concentrator X1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Operational State
                    </label>
                    <select
                      value={deviceForm.status}
                      onChange={(e) =>
                        setDeviceForm({
                          ...deviceForm,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* ACCESSORIES */}
              {activeTab === "accessories" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Accessory Component Name
                    </label>
                    <input
                      type="text"
                      required
                      value={accessoryForm.accessory_name}
                      onChange={(e) =>
                        setAccessoryForm({
                          ...accessoryForm,
                          accessory_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                      placeholder="e.g. High Pressure Nasal Cannula"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Status
                    </label>
                    <select
                      value={accessoryForm.status}
                      onChange={(e) =>
                        setAccessoryForm({
                          ...accessoryForm,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* CARE */}
              {activeTab === "care" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Care Center Name
                    </label>
                    <input
                      type="text"
                      required
                      value={careForm.carecenter_name}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          carecenter_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                      placeholder="e.g. Lifeline Central Medical Dispatch"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Address
                    </label>
                    <textarea
                      required
                      rows="2"
                      value={careForm.address}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          address: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                      placeholder="Enter operational mailing address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        value={careForm.mobile_number}
                        onChange={(e) =>
                          setCareForm({
                            ...careForm,
                            mobile_number: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Alternative Mobile Number
                      </label>
                      <input
                        type="text"
                        value={careForm.alternative_mobile_number || ""}
                        onChange={(e) =>
                          setCareForm({
                            ...careForm,
                            alternative_mobile_number: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Status
                    </label>
                    <select
                      value={careForm.status}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* REFERENCE */}
              {activeTab === "reference" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        required
                        value={referenceForm.doctor_name}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            doctor_name: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Specialist Domain
                      </label>
                      <input
                        type="text"
                        required
                        value={referenceForm.specialist}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            specialist: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                        placeholder="e.g. Pulmonologist"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Hospital Institute Name
                    </label>
                    <input
                      type="text"
                      required
                      value={referenceForm.hospital_name}
                      onChange={(e) =>
                        setReferenceForm({
                          ...referenceForm,
                          hospital_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        value={referenceForm.mobile_number}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            mobile_number: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Alternative Number
                      </label>
                      <input
                        type="text"
                        value={referenceForm.alternative_number || ""}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            alternative_number: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Status
                    </label>
                    <select
                      value={referenceForm.status}
                      onChange={(e) =>
                        setReferenceForm({
                          ...referenceForm,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* DELIVERY */}
              {activeTab === "delivery" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Executive Driver Name
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.delivery_name}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          delivery_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-800"
                      placeholder="Enter legal profile name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Active Mobile Hotline
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.mobile_number}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          mobile_number: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-mono text-slate-800"
                      placeholder="e.g. +91XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Status
                    </label>
                    <select
                      value={deliveryForm.status}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0e4a67] font-semibold text-slate-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 text-sm font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0e4a67] text-white hover:bg-[#155e82] text-sm font-bold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Commit Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}