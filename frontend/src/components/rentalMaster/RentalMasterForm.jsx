
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";
 import Select from "react-select";

 
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalForm({
  formData: passedFormData,
  setFormData: passedSetFormData,
  onCancel,
  onSuccess,
}) {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [localFormData, setLocalFormData] = useState({
    record_date: today,
    billing_type: "Monthly",
    status: "Pending",
    device_id: "",
    care_center_id: "", // Tracks relational ID
  });

  const formData = passedFormData || localFormData;
  const setFormData = (nextState) => {
    if (typeof passedSetFormData === "function") {
      passedSetFormData(nextState);
    } else {
      setLocalFormData(nextState);
    }
  };

  const [deviceModels, setDeviceModels] = useState([]);
  const [careCenters, setCareCenters] = useState([]); // Care centers list
  const [references, setReferences] = useState([]); // State for references dropdown
  const [inventoryList, setInventoryList] = useState([]);
  const [filteredSerials, setFilteredSerials] = useState([]);
  const [assetPhotos, setAssetPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessories, setAccessories] = useState([]); // Accessories list

  // ===============================
  // 1. FETCH EQUIPMENT MODELS
  // ===============================
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/devices`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];

        const activeDevices = items.filter((d) => d.status === "active");
        setDeviceModels(activeDevices);
      } catch (err) {
        console.error("Failed fetching hardware device entities:", err);
      }
    };
    fetchDevices();
  }, []);

  // ===============================
  // 2. FETCH CARE CENTERS FOR DROPDOWN
  // ===============================
  useEffect(() => {
    const fetchCareCenters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];

        // Filter for active centers
        const activeCenters = items.filter((c) => c.status === "active");
        setCareCenters(activeCenters);
      } catch (err) {
        console.error("Failed fetching care center entities:", err);
      }
    };
    fetchCareCenters();
  }, []);

  // ===============================
  // 2.1 FETCH REFERENCES / DOCTORS FOR DROPDOWNS
  // ===============================
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/references`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];

        // Filter active doctor references
        const activeReferences = items.filter((r) => r.status === "active");
        setReferences(activeReferences);
      } catch (err) {
        console.error("Failed fetching reference doctor entities:", err);
      }
    };
    fetchReferences();
  }, []);

  // ===============================
  // 2.2 FETCH ACCESSORIES FOR DROPDOWN
  // ===============================
  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/accessori`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];

        // Filter active accessories
        const activeAccessories = items.filter((a) => a.status === "active");
        setAccessories(activeAccessories);
      } catch (err) {
        console.error("Failed fetching accessory entities:", err);
      }
    };
    fetchAccessories();
  }, []);

  // ===============================
  // 3. FETCH INVENTORY
  // ===============================
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
          setInventoryList(result.data || []);
        }
      } catch (err) {
        console.error("Failed fetching hardware inventory pools:", err);
      }
    };
    fetchInventory();
  }, []);

  // Filter serial numbers dynamically
  useEffect(() => {
    if (formData?.device_id) {
      const chosenDeviceObj = deviceModels.find(
        (d) => Number(d.device_id) === Number(formData.device_id),
      );
      if (chosenDeviceObj) {
        const serials = inventoryList.filter(
          (item) => item.device_model === chosenDeviceObj.device_name,
        );
        setFilteredSerials(serials);
      }
    } else {
      setFilteredSerials([]);
    }
  }, [formData?.device_id, deviceModels, inventoryList]);

  // Clean up memory leaks from object URLs
  useEffect(() => {
    const urls = assetPhotos.map((photo) => photo.previewUrl);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [assetPhotos]);

  const handleCareCenterChange = (e) => {
    const selectedId = e.target.value;

    // No selection
    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        care_center_id: "",
        care_center_name: "",
        mob_no: "",
        alternative_mob_no: "",
        care_address: "",
      }));
      return;
    }

    // Other selected
    if (selectedId === "other") {
      setFormData((prev) => ({
        ...prev,
        care_center_id: "other",
        care_center_name: "",
        mob_no: "",
        alternative_mob_no: "",
        care_address: "",
      }));
      return;
    }

    // Existing care center
    const selectedCenter = careCenters.find(
      (center) => Number(center.carecenter_id) === Number(selectedId),
    );

    if (selectedCenter) {
      setFormData((prev) => ({
        ...prev,
        care_center_id: selectedId,
        care_center_name: selectedCenter.carecenter_name,
        mob_no: selectedCenter.mobile_number || "",
        alternative_mob_no:
          selectedCenter.alternative_mobile_number || "",
        care_address: selectedCenter.address || "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const incomingFiles = Array.from(e.target.files || []);

    const newPhotos = incomingFiles.map((file) => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}`,
    }));

    setAssetPhotos((prevPhotos) => {
      const combined = [...prevPhotos, ...newPhotos];
      if (combined.length > 10) {
        alert("Maximum upload allowance capped at 10 items.");
        return combined.slice(0, 10);
      }
      return combined;
    });

    e.target.value = "";
  };

  const handleRemovePhoto = (idToRemove) => {
    setAssetPhotos((prevPhotos) =>
      prevPhotos.filter((p) => p.id !== idToRemove),
    );
  };

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

      const body = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "device" || key === "careCenter" || key === "asset_photos")
          return;

        if (formData[key] !== null && formData[key] !== undefined) {
          body.append(key, formData[key]);
        }
      });

      assetPhotos.forEach((photoWrapper) => {
        body.append("asset_photos", photoWrapper.file);
      });

      const response = await fetch(url, { method, headers, body });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Authentication session expired. Please log in again.");
          return;
        }
        throw new Error("Server rejected registration submission.");
      }

      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Operation failed.");

      alert(
        isEditMode
          ? "Rental parameters modified successfully."
          : "New rental transaction deployed successfully!",
      );

      if (onSuccess) onSuccess();
      navigate("/rental-master");
    } catch (err) {
      alert(`Transaction aborted: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-6 p-2">
        <div className="flex justify-between items-start border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formData?.rental_id
                ? "📝 Edit Asset Requisition"
                : "Log Asset Requisition"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* SECTION 1: Record format */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
              📦 Record Types
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Deal Type *
                </label>
                <select
                  required
                  value={formData?.deal_type || "Monthly"}
                  onChange={(e) =>
                    setFormData({ ...formData, deal_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="select">---Select ---</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Unit *
                </label>
                <select
                  required
                  value={formData?.unit_type || "Monthly"}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="Monthly">---Select ---</option>
                  <option value="CWF">BWF</option>
                  <option value="ODCOM">ODCOM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Mode *
                </label>
                <select
                  required
                  value={formData?.mode_type || "Monthly"}
                  onChange={(e) =>
                    setFormData({ ...formData, mode_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="Monthly">---Select ---</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="Postpaid">Postpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 1: ASSET ALLOCATION & LOGISTICS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
              📦 Asset Allocation & Logistics
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Select Device Model *
                </label>
                <select
                  required
                  value={formData?.device_id || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      device_id: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
                >
                  <option value="">-- Choose Equipment Model --</option>
                  {deviceModels.map((dev) => (
                    <option key={dev.device_id} value={dev.device_id}>
                      {dev.device_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Select Accessory *
                </label>
                {/* <select
                  required
                  value={formData?.accessory_id || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      accessory_id: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
                >
                  <option value="">-- Choose Accessory --</option>
                  {accessories.map((acc) => (
                    <option key={acc.accessory_id} value={acc.accessory_id}>
                      {acc.accessory_name}
                    </option>
                  ))}
                </select> */}
               

<Select
  isMulti
  options={accessories.map((acc) => ({
    value: acc.accessory_id,
    label: acc.accessory_name,
  }))}
  value={accessories
    .filter((acc) => formData.accessory_id?.includes(acc.accessory_id))
    .map((acc) => ({
      value: acc.accessory_id,
      label: acc.accessory_name,
    }))}
  onChange={(selected) =>
    setFormData({
      ...formData,
      accessory_id: selected ? selected.map((item) => item.value) : [],
    })
  }
  className="w-full"
  classNamePrefix="react-select"
  styles={{
    control: (provided, state) => ({
      ...provided,
      minHeight: "50px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#f59e0b" : "#fcd34d", // amber
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(245,158,11,0.2)"
        : "none",
      "&:hover": {
        borderColor: "#f59e0b",
      },
      padding: "4px 8px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#fef3c7",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#92400e",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#92400e",
      ":hover": {
        backgroundColor: "#f59e0b",
        color: "white",
      },
    }),
  }}
/>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Record Date
                </label>
                <input
                  type="date"
                  value={formData?.record_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, record_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Log In Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData?.login_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, login_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Notify Date {formData?.mode_type === "Prepaid" && "*"}
                </label>
                <input
                  type="date"
                  required={formData?.mode_type === "Prepaid"}
                  value={formData?.notify_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Log Out Date
                </label>
                <input
                  type="date"
                  value={formData?.login_out_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, login_out_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Recall Date
                </label>
                <input
                  type="date"
                  value={formData?.recall_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, recall_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
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
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Billing Type *
                </label>
                <select
                  required
                  value={formData?.billing_type || "Monthly"}
                  onChange={(e) =>
                    setFormData({ ...formData, billing_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Fort Night">Fort Night</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Rental Charge (₹)
                </label>
                <input
                  type="number"
                  value={formData?.rental_charge ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rental_charge:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Deposit / Advance (₹)
                </label>
                <input
                  type="number"
                  value={formData?.deposit_advance ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deposit_advance:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Installation Charge (₹)
                </label>
                <input
                  type="number"
                  value={formData?.installation_charge ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      installation_charge:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PATIENT MATRIX */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARE CENTER */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide border-b pb-2">
                🏢 Care Center Context
              </p>

              {/* Care Center */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Care Center Name
                </label>

                <select
                  value={formData?.care_center_id || ""}
                  onChange={handleCareCenterChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                >
                  <option value="">-- Select Care Center --</option>

                  {careCenters.map((center) => (
                    <option
                      key={center.carecenter_id}
                      value={center.carecenter_id}
                    >
                      {center.carecenter_name}
                    </option>
                  ))}

                  <option value="other">Other</option>
                </select>
              </div>

              {/* Mobile Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    POC Mobile
                  </label>

                  <input
                    type="text"
                    value={formData?.mob_no || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mob_no: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Alt POC Mobile
                  </label>

                  <input
                    type="text"
                    value={formData?.alternative_mob_no || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alternative_mob_no: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Care Address */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Care Address
                </label>

                <textarea
                  rows={2}
                  value={formData?.care_address || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      care_address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm resize-none"
                />
              </div>

              {/* Bed No & POC Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Bed No
                  </label>

                  <input
                    type="text"
                    value={formData?.care_bed_no || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        care_bed_no: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    POC Name / Doctor
                  </label>

                  <input
                    type="text"
                    value={formData?.care_poc_name || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        care_poc_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Referral */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Referral
                </label>

                <select
                  value={formData?.care_referal || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      care_referal: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                >
                  <option value="">-- Select Referral --</option>

                  {references.map((ref) => (
                    <option key={ref.reference_id} value={ref.doctor_name}>
                      {ref.doctor_name} - {ref.hospital_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PATIENT DETAILS */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide border-b pb-2">
                👤 Patient Identity Details
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData?.patient_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, patient_name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData?.patient_age ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patient_age:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Attendant Name
                </label>
                <input
                  type="text"
                  value={formData?.patient_attendant_name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patient_attendant_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData?.patient_mob_no || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patient_mob_no: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Alt Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData?.patient_alternative_mob_no || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patient_alternative_mob_no: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  rows="2"
                  value={formData?.patient_delivery_address || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patient_delivery_address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Notes
              </label>
              <textarea
                rows="2"
                value={formData?.notes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm resize-none"
              />
            </div>
          </div>

          {/* UPLOAD LAYER */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Asset Handover Photo Verification (Up to 10 photos)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-sky-50 file:text-[#0e4a67] font-bold cursor-pointer"
            />
            {assetPhotos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {assetPhotos.map((photo) => (
                  <div key={photo.id} className="relative w-32 h-24">
                    <img
                      src={photo.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-base transition disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#0e4a67] hover:bg-[#125c80] text-white rounded-xl font-extrabold text-base transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing Sequence..."
                : "Save Requisition & Deploy"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}