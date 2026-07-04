// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../Admin/Layout";

// // Centralized helper to grab the active authentication token
// const getToken = () => localStorage.getItem("token");

// export default function App() {
//   const [assets, setAssets] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState(null);

//   // Form payload template
//   const [formData, setFormData] = useState({
//     inventory_id: "",
//     device_model: "",
//     serial_number: "",
//     running_hours: 0,
//     status: "available",
//   });

//   // --- READ OPERATION (Direct Bearer Validation Check) ---
//   const fetchAssets = async () => {
//     try {
//       setIsLoading(true);
//       setErrorMsg(null);
//       const token = getToken();

//       const res = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/api/inventory`,
//         {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Handle bad responses or authentication degradation
//       if (!res.ok) {
//         if (res.status === 401) {
//           localStorage.removeItem("token");
//           throw new Error("Session expired. Please log back into your admin portal.");
//         }
//         throw new Error("Failed to load inventory repository assets.");
//       }

//       const result = await res.json();
      
//       if (result.success) {
//         setAssets(result.data || []);
//       } else {
//         throw new Error(result.message || "Failed to process target payload.");
//       }
//     } catch (err) {
//       setErrorMsg(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   // --- SUBMIT HANDLE (CREATE & UPDATE) ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isEditMode = !!formData.inventory_id;
//     const url = isEditMode 
//       ? `${import.meta.env.VITE_API_BASE_URL}/api/inventory/${formData.inventory_id}` 
//       : `${import.meta.env.VITE_API_BASE_URL}/api/inventory`;
//     const method = isEditMode ? "PUT" : "POST";

//     try {
//       const token = getToken();
//       const res = await fetch(url, {
//         method,
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` }),
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           device_model: formData.device_model,
//           serial_number: formData.serial_number,
//           running_hours: parseFloat(formData.running_hours) || 0,
//           status: formData.status,
//         }),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           localStorage.removeItem("token");
//           throw new Error("Session expired.");
//         }
//         throw new Error("Unable to modify network configuration record.");
//       }

//       const result = await res.json();
//       if (!result.success) throw new Error(result.message);

//       alert(isEditMode ? "Asset profile updated." : "Asset created successfully.");
//       handleCloseModal();
//       fetchAssets();
//     } catch (err) {
//       alert(`Operation failed: ${err.message}`);
//     }
//   };

//   // --- DELETE OPERATION ---
//   const handleDelete = async (id) => {
//     if (!window.confirm("Permanently delete this hardware node?")) return;
//     try {
//       const token = getToken();
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/${id}`, { 
//         method: "DELETE", 
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` }),
//           "Content-Type": "application/json",
//         }
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           localStorage.removeItem("token");
//           throw new Error("Session expired.");
//         }
//         throw new Error("Failed to eliminate asset node.");
//       }

//       const result = await res.json();
//       if (!result.success) throw new Error(result.message);
      
//       alert("Asset removed.");
//       fetchAssets();
//     } catch (err) {
//       alert(`Delete error: ${err.message}`);
//     }
//   };

//   // --- UTILITIES ---
//   const handleOpenModal = (asset = null) => {
//     if (asset) {
//       setFormData({
//         inventory_id: asset.inventory_id,
//         device_model: asset.device_model,
//         serial_number: asset.serial_number,
//         running_hours: asset.running_hours,
//         status: asset.status,
//       });
//     } else {
//       setFormData({ inventory_id: "", device_model: "", serial_number: "", running_hours: 0, status: "available" });
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => setIsModalOpen(false);

//   // --- CORE ANALYTICS ---
//   const totalCount = assets.length;
//   const availableCount = assets.filter((a) => a.status === "available").length;
//   const rentedCount = assets.filter((a) => a.status === "rented").length;
//   const criticalCount = assets.filter((a) => ["maintenance", "breakdown"].includes(a.status)).length;

//   return (
//     <DashboardLayout>
//       {/* Title Dashboard Section */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Global Inventory Ledger</h1>
//           <p className="text-slate-500 text-sm mt-0.5">Real-time telemetry and validation status console.</p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="bg-[#0e4a67] hover:bg-[#155e82] transition-all text-white font-semibold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transform active:scale-95 text-sm"
//         >
//           <span>+</span> Add New Asset
//         </button>
//       </div>

//       {/* Dashboard Live Metric Badges */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
//           <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</p><h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalCount}</h3></div>
//           <div className="text-[#0e4a67] bg-sky-50 p-3 rounded-xl text-xl">📦</div>
//         </div>
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
//           <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</p><h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{availableCount}</h3></div>
//           <div className="text-emerald-600 bg-emerald-50 p-3 rounded-xl text-xl">✅</div>
//         </div>
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
//           <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rented</p><h3 className="text-3xl font-extrabold text-blue-600 mt-1">{rentedCount}</h3></div>
//           <div className="text-blue-600 bg-blue-50 p-3 rounded-xl text-xl">🤝</div>
//         </div>
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
//           <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Down Tracker</p><h3 className="text-3xl font-extrabold text-rose-600 mt-1">{criticalCount}</h3></div>
//           <div className="text-rose-600 bg-rose-50 p-3 rounded-xl text-xl">⚠️</div>
//         </div>
//       </div>

//       {/* Connection/Auth Failure Alerts */}
//       {errorMsg && (
//         <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex gap-3 text-sm font-semibold items-center">
//           <span>🚨</span> Secure Mode Warn: {errorMsg}
//         </div>
//       )}

//       {/* Main Core Viewport Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
//                 <th className="py-4 px-6">Device Model</th>
//                 <th className="py-4 px-6">Serial Number</th>
//                 <th className="py-4 px-6">Running Hours</th>
//                 <th className="py-4 px-6">Status Indicator</th>
//                 <th className="py-4 px-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-sm font-medium">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="5" className="py-12 text-center text-slate-400">
//                     <div className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full mb-2"></div>
//                     <p>Securing backend proxy ledger arrays...</p>
//                   </td>
//                 </tr>
//               ) : assets.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="py-12 text-center text-slate-400">No active network hardware instances located.</td>
//                 </tr>
//               ) : (
//                 assets.map((item) => {
//                   let statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
//                   if (item.status === "rented") statusClass = "bg-blue-50 text-blue-700 border-blue-200";
//                   if (item.status === "maintenance") statusClass = "bg-amber-50 text-amber-700 border-amber-200";
//                   if (item.status === "breakdown") statusClass = "bg-rose-50 text-rose-700 border-rose-200";

//                   return (
//                     <tr key={item.inventory_id} className="hover:bg-slate-50/80 transition-colors">
//                       <td className="py-4 px-6 text-slate-900 font-bold">{item.device_model}</td>
//                       <td className="py-4 px-6 text-slate-500 font-mono text-xs">{item.serial_number}</td>
//                       <td className="py-4 px-6 text-slate-600">⏱️ {parseFloat(item.running_hours).toFixed(2)} hrs</td>
//                       <td className="py-4 px-6">
//                         <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${statusClass}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6 text-right space-x-3">
//                         <button onClick={() => handleOpenModal(item)} className="text-[#0e4a67] hover:text-[#155e82] transition font-semibold text-sm">Edit</button>
//                         <button onClick={() => handleDelete(item.inventory_id)} className="text-rose-500 hover:text-rose-700 transition font-semibold text-sm">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Operations Modal Window */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
//             <div className="bg-[#0e4a67] text-white p-6 flex justify-between items-center">
//               <h3 className="text-xl font-bold tracking-wide">
//                 {formData.inventory_id ? "📝 Modify Asset Target" : "➕ Register System Configuration"}
//               </h3>
//               <button onClick={handleCloseModal} className="text-white/80 hover:text-white text-xl">✕</button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Device Model *</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.device_model}
//                   onChange={(e) => setFormData({ ...formData, device_model: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
//                   placeholder="e.g. Caterpillar Excavator 320"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Serial Number *</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.serial_number}
//                   onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
//                   placeholder="e.g. SN-8947-XYZ"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Running Hours</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.running_hours}
//                     onChange={(e) => setFormData({ ...formData, running_hours: e.target.value })}
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">System Status</label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
//                   >
//                     <option value="available">Available</option>
//                     <option value="rented">Rented</option>
//                     <option value="maintenance">Maintenance</option>
//                     <option value="breakdown">Breakdown</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
//                 <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-semibold text-sm transition">
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-5 py-2.5 bg-[#0e4a67] hover:bg-[#155e82] text-white rounded-xl font-semibold text-sm transition shadow-md">
//                   Confirm Changes
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
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/inventory`;

const INITIAL_FORM_STATE = {
  inventory_id: "",
  device_model: "",
  serial_number: "",
  running_hours: 0,
  status: "available",
  accessories: "", 
};

export default function App() {
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // --- API REQUEST HEADER BUILDER ---
  const getRequestHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // --- API EXCEPTION HANDLER ---
  const handleApiError = (res, fallbackMessage) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please log back into your admin portal.");
    }
    throw new Error(fallbackMessage);
  };

  // --- READ OPERATION ---
  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch(API_URL, { headers: getRequestHeaders() });
      if (!res.ok) handleApiError(res, "Failed to load inventory repository assets.");

      const result = await res.json();
      if (result.success) {
        setAssets(result.data || []);
      } else {
        throw new Error(result.message || "Failed to process target payload.");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // --- CREATE & UPDATE OPERATION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditMode = !!formData.inventory_id;
    const url = isEditMode ? `${API_URL}/${formData.inventory_id}` : API_URL;
    const method = isEditMode ? "PUT" : "POST";

    const accessoriesArray = formData.accessories
      ? formData.accessories.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch(url, {
        method,
        headers: getRequestHeaders(),
        body: JSON.stringify({
          device_model: formData.device_model,
          serial_number: formData.serial_number,
          running_hours: parseFloat(formData.running_hours) || 0,
          status: formData.status,
          accessories: accessoriesArray,
        }),
      });

      if (!res.ok) handleApiError(res, "Unable to modify configuration record.");

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      alert(isEditMode ? "Asset profile updated." : "Asset created successfully.");
      handleCloseModal();
      fetchAssets();
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  // --- DELETE OPERATION ---
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this hardware node?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE", 
        headers: getRequestHeaders() 
      });

      if (!res.ok) handleApiError(res, "Failed to eliminate asset node.");

      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      
      alert("Asset removed.");
      fetchAssets();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // --- UI DIALOG UTILITIES ---
  const handleOpenModal = (asset = null) => {
    if (asset) {
      setFormData({
        inventory_id: asset.inventory_id,
        device_model: asset.device_model,
        serial_number: asset.serial_number,
        running_hours: asset.running_hours,
        status: asset.status,
        accessories: Array.isArray(asset.accessories) ? asset.accessories.join(", ") : "",
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // --- COMPUTED ANALYTICS METRICS ---
  const totalCount = assets.length;
  const availableCount = assets.filter((a) => a.status === "available").length;
  const rentedCount = assets.filter((a) => a.status === "rented").length;
  const criticalCount = assets.filter((a) => ["maintenance", "breakdown"].includes(a.status)).length;

  const getStatusStyles = (status) => {
    switch (status) {
      case "rented": return "bg-blue-50 text-blue-700 border-blue-200";
      case "maintenance": return "bg-amber-50 text-amber-700 border-amber-200";
      case "breakdown": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <DashboardLayout>
      {/* Metrics Console Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Global Inventory Ledger</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time telemetry and validation status console.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0e4a67] hover:bg-[#155e82] transition-all text-white font-semibold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transform active:scale-95 text-sm"
        >
          <span>+</span> Add New Asset
        </button>
      </div>

      {/* Telemetry Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</p><h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalCount}</h3></div>
          <div className="text-[#0e4a67] bg-sky-50 p-3 rounded-xl text-xl">📦</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</p><h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{availableCount}</h3></div>
          <div className="text-emerald-600 bg-emerald-50 p-3 rounded-xl text-xl">✅</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rented</p><h3 className="text-3xl font-extrabold text-blue-600 mt-1">{rentedCount}</h3></div>
          <div className="text-blue-600 bg-blue-50 p-3 rounded-xl text-xl">🤝</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Down Tracker</p><h3 className="text-3xl font-extrabold text-rose-600 mt-1">{criticalCount}</h3></div>
          <div className="text-rose-600 bg-rose-50 p-3 rounded-xl text-xl">⚠️</div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex gap-3 text-sm font-semibold items-center">
          <span>🚨</span> Secure Mode Warn: {errorMsg}
        </div>
      )}

      {/* Main Core Viewport Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Device Model</th>
                <th className="py-4 px-6">Serial Number</th>
                <th className="py-4 px-6">Accessories</th>
                <th className="py-4 px-6">Running Hours</th>
                <th className="py-4 px-6">Status Indicator</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full mb-2"></div>
                    <p>Securing backend proxy ledger arrays...</p>
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">No active network hardware instances located.</td>
                </tr>
              ) : (
                assets.map((item) => (
                  <tr key={item.inventory_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-900 font-bold">{item.device_model}</td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-xs">{item.serial_number}</td>
                    <td className="py-4 px-6 text-slate-600 max-w-[200px] truncate">
                      {Array.isArray(item.accessories) && item.accessories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.accessories.map((acc, index) => (
                            <span key={index} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
                              {acc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600">⏱️ {parseFloat(item.running_hours).toFixed(2)} hrs</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide border rounded-md ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button onClick={() => handleOpenModal(item)} className="text-[#0e4a67] hover:text-[#155e82] transition font-semibold text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.inventory_id)} className="text-rose-500 hover:text-rose-700 transition font-semibold text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog Container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0e4a67] text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-wide">
                {formData.inventory_id ? "📝 Modify Asset Target" : "➕ Register System Configuration"}
              </h3>
              <button onClick={handleCloseModal} className="text-white/80 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Device Model *</label>
                <input
                  type="text"
                  required
                  value={formData.device_model}
                  onChange={(e) => setFormData({ ...formData, device_model: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
                  placeholder="e.g. Epson EB-X06"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Serial Number *</label>
                <input
                  type="text"
                  required
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
                  placeholder="e.g. EP10001"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Accessories (comma-separated)</label>
                <input
                  type="text"
                  value={formData.accessories}
                  onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
                  placeholder="e.g. Remote, VGA Cable, Power Cord"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Running Hours</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.running_hours}
                    onChange={(e) => setFormData({ ...formData, running_hours: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">System Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="breakdown">Breakdown</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-semibold text-sm transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#0e4a67] hover:bg-[#155e82] text-white rounded-xl font-semibold text-sm transition shadow-md">
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}