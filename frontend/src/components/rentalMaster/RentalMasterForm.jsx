// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../Admin/Layout";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export default function RentalForm({ formData = {}, setFormData, onCancel, onSuccess }) {
//   const [inventoryList, setInventoryList] = useState([]);
//   const [assetPhoto, setAssetPhoto] = useState(null);
//   const [prescriptionPhoto, setPrescriptionPhoto] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch device inventories dynamically from the API endpoint
//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/api/inventory`, {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });
//         const result = await res.json();
//         if (result.success) {
//           setInventoryList(result.data || []);
//         }
//       } catch (err) {
//         console.error("Failed fetching hardware device pools:", err);
//       }
//     };
//     fetchInventory();
//   }, []);

//   // --- NATIVE FORM SUBMIT LOGIC WITH API FETCH & AUTHORIZATION BEARER CHECK ---
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const isEditMode = !!formData?.rental_id;
//     const url = isEditMode 
//       ? `${API_BASE_URL}/api/rentals/${formData.rental_id}` 
//       : `${API_BASE_URL}/api/rentals`;
    
//     const method = isEditMode ? "PUT" : "POST";

//     try {
//       const token = localStorage.getItem("token");
//       let headers = {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       };
      
//       let body;

//       if (isEditMode) {
//         headers["Content-Type"] = "application/json";
//         body = JSON.stringify(formData);
//       } else {
//         body = new FormData();
//         Object.keys(formData).forEach((key) => {
//           if (formData[key] !== null && formData[key] !== undefined) {
//             body.append(key, formData[key]);
//           }
//         });
//         if (assetPhoto) body.append("asset_photo", assetPhoto);
//         if (prescriptionPhoto) body.append("prescription_photo", prescriptionPhoto);
//       }

//       const response = await fetch(url, { method, headers, body });

//       if (!response.ok) {
//         if (response.status === 401) {
//           alert("Authentication session expired. Please log in again.");
//           return;
//         }
//         throw new Error("Server rejected registration submission.");
//       }

//       const result = await response.json();
//       if (!result.success) throw new Error(result.message || "Operation failed.");

//       alert(isEditMode ? "Rental parameters modified successfully." : "New rental transaction deployed successfully!");
      
//       if (onSuccess) onSuccess();
//     } catch (err) {
//       alert(`Transaction aborted: ${err.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="w-full  mx-auto space-y-6 p-2">
        
//         {/* Upper Headline Action Bar */}
//         <div className="flex justify-between items-start border-b border-slate-200 pb-5">
//           <div>
//             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//               {formData?.rental_id ? "📝 Edit Asset Requisition" : "Log Asset Requisition"}
//             </h1>
//             <p className="text-slate-500 text-base mt-1">
//               Deploy a specific unit from inventory to a patient active record profile.
//             </p>
//           </div>

         
//         </div>

//         <form onSubmit={handleFormSubmit} className="space-y-6">
          
//           {/* SECTION 1: ASSET ALLOCATION & LOGISTICS */}
//           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
//             <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
//               📦 Asset Allocation & Logistics
//             </h4>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Device Model & Serial Number *</label>
//                 <select
//                   required
//                   value={formData?.inventory_id || ""}
//                   onChange={(e) => {
//                     const selectedInv = inventoryList.find(inv => String(inv.inventory_id) === String(e.target.value));
//                     setFormData({ 
//                       ...formData, 
//                       inventory_id: e.target.value,
//                       device_model: selectedInv ? selectedInv.device_model : "" 
//                     });
//                   }}
//                   className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
//                 >
//                   <option value="">-- Choose Equipment (Model & SN) --</option>
//                   {inventoryList.map((inv) => (
//                     <option key={inv.inventory_id} value={inv.inventory_id}>
//                       {inv.device_model} (SN: {inv.serial_number}) — {inv.status || "Ready"}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Log In Date *</label>
//                 <input
//                   type="date"
//                   required
//                   value={formData?.login_date || ""}
//                   onChange={(e) => setFormData({ ...formData, login_date: e.target.value })}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Log Out Date</label>
//                 <input
//                   type="date"
//                   value={formData?.login_out_date || ""}
//                   onChange={(e) => setFormData({ ...formData, login_out_date: e.target.value })}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Delivery Executive</label>
//                 <select
//                   value={formData?.delivery_executive || ""}
//                   onChange={(e) => setFormData({ ...formData, delivery_executive: e.target.value })}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 shadow-sm"
//                 >
//                   <option value="">-- Choose Executive --</option>
//                   <option value="Rahul Patil">Rahul Patil</option>
//                   <option value="Ramesh Kumar">Ramesh Kumar</option>
//                   <option value="Suresh Singh">Suresh Singh</option>
//                   <option value="Amit Sharma">Amit Sharma</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* SECTION 2: COMMERCIALS & BILLING */}
//           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
//             <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
//               💳 Commercials & Billing
//             </h4>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Billing Type</label>
//                 <select
//                   value={formData?.billing_type || "Monthly"}
//                   onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
//                   className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
//                 >
//                   <option value="Monthly">Monthly</option>
//                   <option value="Daily">Daily Billing Cycles</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Rental Charge (₹)</label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-3 text-slate-400 text-base font-bold">₹</span>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     value={formData?.rental_charge || ""}
//                     onChange={(e) => setFormData({ ...formData, rental_charge: Number(e.target.value) })}
//                     className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Deposit / Advance (₹)</label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-3 text-slate-400 text-base font-bold">₹</span>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     value={formData?.deposit_advance || ""}
//                     onChange={(e) => setFormData({ ...formData, deposit_advance: Number(e.target.value) })}
//                     className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Installation Charge (₹)</label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-3 text-slate-400 text-base font-bold">₹</span>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     value={formData?.installation_charge || ""}
//                     onChange={(e) => setFormData({ ...formData, installation_charge: Number(e.target.value) })}
//                     className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* SECTION 3: ONE BALANCED GRID SPLIT - CARE CENTER & PATIENT LOGISTICS */}
//           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
//             <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-6">
//               📋 Care Center & Patient Dispatch Matrix
//             </h4>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
//               {/* LEFT COLUMN: CARE CENTER SPECIFICS */}
//               <div className="space-y-4 border-r border-slate-100 pr-0 md:pr-4">
//                 <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide mb-2">🏢 I. Care Center Context</p>
                
//                 <div>
//                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Care Center Name</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. City Care Hospital"
//                     value={formData?.care_center_name || ""}
//                     onChange={(e) => setFormData({ ...formData, care_center_name: e.target.value })}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Care Center Address</label>
//                   <textarea
//                     rows="2"
//                     placeholder="Full medical center wing location details"
//                     value={formData?.care_address || ""}
//                     onChange={(e) => setFormData({ ...formData, care_address: e.target.value })}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm resize-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Bed Number</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. B-12"
//                       value={formData?.care_bed_no || ""}
//                       onChange={(e) => setFormData({ ...formData, care_bed_no: e.target.value })}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1.5">POC Name / Doctor</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Dr. Amit Sharma"
//                       value={formData?.care_poc_name || ""}
//                       onChange={(e) => setFormData({ ...formData, care_poc_name: e.target.value })}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT COLUMN: PATIENT DEMOGRAPHICS */}
//               <div className="space-y-4">
//                 <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide mb-2">👤 II. Patient Identity Details</p>

//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="col-span-2">
//                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Patient Name *</label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Enter full name"
//                       value={formData?.patient_name || ""}
//                       onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Age</label>
//                     <input
//                       type="number"
//                       placeholder="Age"
//                       value={formData?.patient_age || ""}
//                       onChange={(e) => setFormData({ ...formData, patient_age: Number(e.target.value) })}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number *</label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Primary phone context"
//                       value={formData?.patient_mob_no || ""}
//                       onChange={(e) => setFormData({ ...formData, patient_mob_no: e.target.value })}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Attendant Name</label>
//                     <input
//                       type="text"
//                       placeholder="Guardian / Assistant"
//                       value={formData?.patient_attendant_name || ""}
//                       onChange={(e) => setFormData({ ...formData, patient_attendant_name: e.target.value })}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Delivery Address</label>
//                   <textarea
//                     rows="2"
//                     placeholder="Home or destination delivery drop destination address"
//                     value={formData?.patient_delivery_address || ""}
//                     onChange={(e) => setFormData({ ...formData, patient_delivery_address: e.target.value })}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm resize-none"
//                   />
//                 </div>
//               </div>

//             </div>

//           </div>

//           {/* MEDIA VERIFICATION FILE UPLOADS */}
//           {!formData?.rental_id && (
//             <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Asset Handover Photo Verification</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setAssetPhoto(e.target.files[0])}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-sky-50 file:text-[#0e4a67] font-bold cursor-pointer shadow-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Doctor Prescription Copy</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setPrescriptionPhoto(e.target.files[0])}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-sky-50 file:text-[#0e4a67] font-bold cursor-pointer shadow-sm"
//                 />
//               </div>
//             </div>
//           )}

//           {/* FORM CONTROLS FOOTER */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onCancel}
//               disabled={isSubmitting}
//               className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-base transition shadow-sm disabled:opacity-50"
//             >
//               Discard
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-3 bg-[#0e4a67] hover:bg-[#125c80] text-white rounded-xl font-extrabold text-base transition shadow-md disabled:opacity-50"
//             >
//               {isSubmitting ? "Processing Sequence..." : "Save Requisition & Deploy"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </DashboardLayout>
//   );
// }





import React, { useState, useEffect } from "react";
import DashboardLayout from "../Admin/Layout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalForm({ formData: passedFormData, setFormData: passedSetFormData, onCancel, onSuccess }) {
  // Local state fallback mechanisms in case parent container doesn't provide them correctly
  const [localFormData, setLocalFormData] = useState({
    billing_type: "Monthly",
    status: "Pending"
  });

  const formData = passedFormData || localFormData;
  const setFormData = (nextState) => {
    if (typeof passedSetFormData === "function") {
      passedSetFormData(nextState);
    } else {
      // Fallback updating state internally if prop function is missing
      setLocalFormData(nextState);
    }
  };

  const [inventoryList, setInventoryList] = useState([]);
  const [uniqueModels, setUniqueModels] = useState([]);
  const [filteredSerials, setFilteredSerials] = useState([]);
  const [assetPhoto, setAssetPhoto] = useState(null);
  const [prescriptionPhoto, setPrescriptionPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch device inventories dynamically from the API endpoint
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/inventory`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        if (result.success) {
          const items = result.data || [];
          setInventoryList(items);

          // Extract unique device models for the selection array context
          const models = [...new Set(items.map((item) => item.device_model))].filter(Boolean);
          setUniqueModels(models);
        }
      } catch (err) {
        console.error("Failed fetching hardware device pools:", err);
      }
    };
    fetchInventory();
  }, []);

  // Filter serial numbers dynamically whenever the selected device_model changes
  useEffect(() => {
    if (formData?.device_model) {
      const serials = inventoryList.filter(
        (item) => item.device_model === formData.device_model
      );
      setFilteredSerials(serials);
    } else {
      setFilteredSerials([]);
    }
  }, [formData?.device_model, inventoryList]);

  // --- NATIVE FORM SUBMIT LOGIC WITH API FETCH & AUTHORIZATION BEARER CHECK ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditMode = !!formData?.rental_id;
    const url = isEditMode 
      ? `${API_BASE_URL}/api/rentals/${formData.rental_id}` 
      : `${API_BASE_URL}/api/rentals`;
    
    const method = isEditMode ? "PUT" : "POST";

    try {
      const token = localStorage.getItem("token");
      let headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      
      let body;

      if (isEditMode) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(formData);
      } else {
        body = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            body.append(key, formData[key]);
          }
        });
        if (assetPhoto) body.append("asset_photo", assetPhoto);
        if (prescriptionPhoto) body.append("prescription_photo", prescriptionPhoto);
      }

      const response = await fetch(url, { method, headers, body });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Authentication session expired. Please log in again.");
          return;
        }
        throw new Error("Server rejected registration submission.");
      }

      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Operation failed.");

      alert(isEditMode ? "Rental parameters modified successfully." : "New rental transaction deployed successfully!");
      
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(`Transaction aborted: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-6 p-2">
        
        {/* Upper Headline Action Bar */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formData?.rental_id ? "📝 Edit Asset Requisition" : "Log Asset Requisition"}
            </h1>
            <p className="text-slate-500 text-base mt-1">
              Deploy a specific unit from inventory to a patient active record profile.
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* SECTION 1: ASSET ALLOCATION & LOGISTICS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
              📦 Asset Allocation & Logistics
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Device Model Dropdown Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Device Model *</label>
                <select
                  required
                  value={formData?.device_model || ""}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      device_model: e.target.value,
                      inventory_id: "" // Reset downstream cascading serial index 
                    });
                  }}
                  className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
                >
                  <option value="">-- Choose Equipment Model --</option>
                  {uniqueModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Cascaded Serial Number Context Dropdown */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Serial Number *</label>
                <select
                  required
                  disabled={!formData?.device_model}
                  value={formData?.inventory_id || ""}
                  onChange={(e) => setFormData({ ...formData, inventory_id: e.target.value })}
                  className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400 transition"
                >
                  <option value="">
                    {formData?.device_model ? "-- Choose Available Serial No --" : "⚠️ Please select a Device Model first"}
                  </option>
                  {filteredSerials.map((inv) => (
                    <option key={inv.inventory_id} value={inv.inventory_id}>
                      {inv.serial_number} ({inv.status || "Ready"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Log In Date *</label>
                <input
                  type="date"
                  required
                  value={formData?.login_date || ""}
                  onChange={(e) => setFormData({ ...formData, login_date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Log Out Date</label>
                <input
                  type="date"
                  value={formData?.login_out_date || ""}
                  onChange={(e) => setFormData({ ...formData, login_out_date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 shadow-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Delivery Executive</label>
                <select
                  value={formData?.delivery_executive || ""}
                  onChange={(e) => setFormData({ ...formData, delivery_executive: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 shadow-sm"
                >
                  <option value="">-- Choose Executive --</option>
                  <option value="Rahul Patil">Rahul Patil</option>
                  <option value="Ramesh Kumar">Ramesh Kumar</option>
                  <option value="Suresh Singh">Suresh Singh</option>
                  <option value="Amit Sharma">Amit Sharma</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: COMMERCIALS & BILLING */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
              💳 Commercials & Billing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Billing Type</label>
                <select
                  value={formData?.billing_type || "Monthly"}
                  onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Daily">Daily Billing Cycles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Rental Charge (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 text-base font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData?.rental_charge ?? ""}
                    onChange={(e) => setFormData({ ...formData, rental_charge: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Deposit / Advance (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 text-base font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData?.deposit_advance ?? ""}
                    onChange={(e) => setFormData({ ...formData, deposit_advance: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Installation Charge (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 text-base font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData?.installation_charge ?? ""}
                    onChange={(e) => setFormData({ ...formData, installation_charge: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: MATRIX MATRIX */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-6">
              📋 Care Center & Patient Dispatch Matrix
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: CARE CENTER SPECIFICS */}
              <div className="space-y-4 border-r border-slate-100 pr-0 md:pr-4">
                <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide mb-2">🏢 I. Care Center Context</p>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Care Center Name</label>
                  <input
                    type="text"
                    placeholder="e.g. City Care Hospital"
                    value={formData?.care_center_name || ""}
                    onChange={(e) => setFormData({ ...formData, care_center_name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Care Center Address</label>
                  <textarea
                    rows="2"
                    placeholder="Full medical center wing location details"
                    value={formData?.care_address || ""}
                    onChange={(e) => setFormData({ ...formData, care_address: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Bed Number</label>
                    <input
                      type="text"
                      placeholder="e.g. B-12"
                      value={formData?.care_bed_no || ""}
                      onChange={(e) => setFormData({ ...formData, care_bed_no: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">POC Name / Doctor</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Amit Sharma"
                      value={formData?.care_poc_name || ""}
                      onChange={(e) => setFormData({ ...formData, care_poc_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PATIENT DEMOGRAPHICS */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide mb-2">👤 II. Patient Identity Details</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={formData?.patient_name || ""}
                      onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      value={formData?.patient_age ?? ""}
                      onChange={(e) => setFormData({ ...formData, patient_age: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="Primary phone context"
                      value={formData?.patient_mob_no || ""}
                      onChange={(e) => setFormData({ ...formData, patient_mob_no: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Attendant Name</label>
                    <input
                      type="text"
                      placeholder="Guardian / Assistant"
                      value={formData?.patient_attendant_name || ""}
                      onChange={(e) => setFormData({ ...formData, patient_attendant_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Delivery Address</label>
                  <textarea
                    rows="2"
                    placeholder="Home delivery drop destination address"
                    value={formData?.patient_delivery_address || ""}
                    onChange={(e) => setFormData({ ...formData, patient_delivery_address: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm resize-none"
                  />
                </div>
              </div>

            </div>

            {/* LOWER REMARKS & LOGISTICAL STATUS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Operational Remarks</label>
                <input
                  type="text"
                  placeholder="Enter remarks or delivery instructions"
                  value={formData?.remarks || ""}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Deployment Status</label>
                <select
                  value={formData?.status || "Pending"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-base text-slate-900 font-extrabold focus:outline-none shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Running">Running</option>
                  <option value="Returned">Returned</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

          </div>

          {/* MEDIA VERIFICATION FILE UPLOADS */}
          {!formData?.rental_id && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Asset Handover Photo Verification</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAssetPhoto(e.target.files[0] || null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-sky-50 file:text-[#0e4a67] font-bold cursor-pointer shadow-sm"
                />
                {formData?.asset_photo && (
                  <div className="mt-3">
                    <img 
                      src={formData.asset_photo || null} 
                      alt="Handover Preview" 
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Doctor Prescription Copy</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPrescriptionPhoto(e.target.files[0] || null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-sky-50 file:text-[#0e4a67] font-bold cursor-pointer shadow-sm"
                />
                {formData?.prescription_photo && (
                  <div className="mt-3">
                    <img 
                      src={formData.prescription_photo || null} 
                      alt="Prescription Preview" 
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FORM CONTROLS FOOTER */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-base transition shadow-sm disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#0e4a67] hover:bg-[#125c80] text-white rounded-xl font-extrabold text-base transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Processing Sequence..." : "Save Requisition & Deploy"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}