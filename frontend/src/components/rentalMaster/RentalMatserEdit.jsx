import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalMasterEdit() {
  const { id } = useParams(); // rental id from URL
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    record_date: today,
    billing_type: "Monthly",
    status: "Pending",
    device_id: "",
    care_center_id: "",
    accessory_id: "",
  });

  const [deviceModels, setDeviceModels] = useState([]);
  const [careCenters, setCareCenters] = useState([]);
  const [references, setReferences] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [filteredSerials, setFilteredSerials] = useState([]);
  const [assetPhotos, setAssetPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessories, setAccessories] = useState([]);

  // ===============================
  // 1. GET RENTAL BY ID (for edit)
  // ===============================
  useEffect(() => {
    if (!id) return;

    const loadRental = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/rentals/${id}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) throw new Error("Failed to load rental for editing");

        const result = await res.json();
        const data = result.data || result;

        setFormData({
          ...data,
          device_id: data.device_id ?? data.device?.device_id ?? "",
          care_center_id: data.care_center_id ?? "",
          accessory_id: data.accessory_id ?? "",
          deal_type: data.deal_type ?? "",
          unit_type: data.unit_type ?? "",
          mode_type: data.mode_type ?? "",
          billing_type: data.billing_type ?? "Monthly",
          record_date: data.record_date || today,
          login_date: data.login_date || "",
          login_out_date: data.login_out_date || "",
          notify_date: data.notify_date || "",
          recall_date: data.recall_date || "",
        });

        // existing photos
        if (Array.isArray(data.asset_photos) && data.asset_photos.length > 0) {
          setExistingPhotos(
            data.asset_photos.map((url, index) => ({
              id: `existing-${index}`,
              url: typeof url === "string" ? url : url?.url || url,
              isExisting: true,
            })),
          );
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Could not load rental");
        navigate("/rental-master");
      } finally {
        setIsLoading(false);
      }
    };

    loadRental();
  }, [id]);

  // ===============================
  // 2. FETCH DROPDOWN DATA
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

    // Devices
    fetch(`${API_BASE_URL}/api/devices`, { headers })
      .then((r) => r.json())
      .then((result) => {
        const items = Array.isArray(result) ? result : result.data || [];
        setDeviceModels(items.filter((d) => d.status === "active"));
      })
      .catch(console.error);

    // Care Centers
    fetch(`${API_BASE_URL}/api/carecenters`, { headers })
      .then((r) => r.json())
      .then((result) => {
        const items = Array.isArray(result) ? result : result.data || [];
        setCareCenters(items.filter((c) => c.status === "active"));
      })
      .catch(console.error);

    // References
    fetch(`${API_BASE_URL}/api/references`, { headers })
      .then((r) => r.json())
      .then((result) => {
        const items = Array.isArray(result) ? result : result.data || [];
        setReferences(items.filter((r) => r.status === "active"));
      })
      .catch(console.error);

    // Accessories
    fetch(`${API_BASE_URL}/api/accessori`, { headers })
      .then((r) => r.json())
      .then((result) => {
        const items = Array.isArray(result) ? result : result.data || [];
        setAccessories(items.filter((a) => a.status === "active"));
      })
      .catch(console.error);

    // Inventory
    fetch(`${API_BASE_URL}/api/inventory`, { headers })
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setInventoryList(result.data || []);
      })
      .catch(console.error);
  }, []);

  // Filter serials
  useEffect(() => {
    if (formData?.device_id) {
      const chosen = deviceModels.find(
        (d) => Number(d.device_id) === Number(formData.device_id),
      );
      if (chosen) {
        setFilteredSerials(
          inventoryList.filter((item) => item.device_model === chosen.device_name),
        );
      }
    } else {
      setFilteredSerials([]);
    }
  }, [formData?.device_id, deviceModels, inventoryList]);

  // Cleanup object URLs
  useEffect(() => {
    const urls = assetPhotos.map((p) => p.previewUrl);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [assetPhotos]);

  // ===============================
  // HANDLERS
  // ===============================
  const handleCareCenterChange = (e) => {
    const selectedId = e.target.value;

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

    const selectedCenter = careCenters.find(
      (c) => Number(c.carecenter_id) === Number(selectedId),
    );

    if (selectedCenter) {
      setFormData((prev) => ({
        ...prev,
        care_center_id: selectedId,
        care_center_name: selectedCenter.carecenter_name,
        mob_no: selectedCenter.mobile_number || "",
        alternative_mob_no: selectedCenter.alternative_mobile_number || "",
        care_address: selectedCenter.address || "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}`,
      isExisting: false,
    }));

    setAssetPhotos((prev) => {
      const combined = [...prev, ...newPhotos];
      if (combined.length + existingPhotos.length > 10) {
        alert("Maximum 10 photos allowed.");
        return combined.slice(0, 10 - existingPhotos.length);
      }
      return combined;
    });
    e.target.value = "";
  };

  const handleRemoveNewPhoto = (id) => {
    setAssetPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRemoveExistingPhoto = (id) => {
    setExistingPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // ===============================
  // SUBMIT → PUT /api/rentals/:id
  // ===============================
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const body = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          ["device", "careCenter", "asset_photos", "createdAt", "updatedAt"].includes(
            key,
          )
        )
          return;

        if (formData[key] !== null && formData[key] !== undefined) {
          body.append(key, formData[key]);
        }
      });

      // keep remaining existing photos
      const remaining = existingPhotos
        .filter((p) => p.isExisting)
        .map((p) => p.url);
      body.append("existing_asset_photos", JSON.stringify(remaining));

      // new files
      assetPhotos.forEach((p) => body.append("asset_photos", p.file));

      const res = await fetch(`${API_BASE_URL}/api/rentals/${id}`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body,
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          return;
        }
        const errText = await res.text();
        throw new Error(errText || "Update failed");
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Update failed");

      alert("Rental updated successfully.");
      navigate("/rental-master");
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-3">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#0e4a67] rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">
            Loading rental for editing...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ===============================
  // UI (same as create form)
  // ===============================
  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-6 p-2">
        <div className="flex justify-between items-start border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              📝 Edit Asset Requisition
            </h1>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Record Types */}
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
                  value={formData.deal_type || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, deal_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="">---Select ---</option>
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
                  value={formData.unit_type || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="">---Select ---</option>
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
                  value={formData.mode_type || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, mode_type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-emerald-300 text-emerald-900 bg-white rounded-xl text-base font-bold focus:outline-none shadow-sm"
                >
                  <option value="">---Select ---</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="Postpaid">Postpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
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
                  value={String(formData.device_id || "")}
                  onChange={(e) =>
                    setFormData({ ...formData, device_id: e.target.value })
                  }
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
                <select
                  required
                  value={String(formData.accessory_id || "")}
                  onChange={(e) =>
                    setFormData({ ...formData, accessory_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
                >
                  <option value="">-- Choose Accessory --</option>
                  {accessories.map((acc) => (
                    <option key={acc.accessory_id} value={acc.accessory_id}>
                      {acc.accessory_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Record Date
                </label>
                <input
                  type="date"
                  value={formData.record_date || ""}
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
                  value={formData.login_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, login_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Notify Date {formData.mode_type === "Prepaid" && "*"}
                </label>
                <input
                  type="date"
                  required={formData.mode_type === "Prepaid"}
                  value={formData.notify_date || ""}
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
                  value={formData.login_out_date || ""}
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
                  value={formData.recall_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, recall_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Commercials */}
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
                  value={formData.billing_type || "Monthly"}
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
                  value={formData.rental_charge ?? ""}
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
                  value={formData.deposit_advance ?? ""}
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
                  value={formData.installation_charge ?? ""}
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

          {/* Patient Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Care Center */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#0e4a67] uppercase tracking-wide border-b pb-2">
                🏢 Care Center Context
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Care Center Name
                </label>
                <select
                  value={String(formData.care_center_id || "")}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    POC Mobile
                  </label>
                  <input
                    type="text"
                    value={formData.mob_no || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mob_no: e.target.value })
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
                    value={formData.alternative_mob_no || ""}
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

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Care Address
                </label>
                <textarea
                  rows={2}
                  value={formData.care_address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, care_address: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Bed No
                  </label>
                  <input
                    type="text"
                    value={formData.care_bed_no || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, care_bed_no: e.target.value })
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
                    value={formData.care_poc_name || ""}
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

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Referral
                </label>
                <select
                  value={formData.care_referal || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, care_referal: e.target.value })
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

            {/* Patient */}
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
                    value={formData.patient_name || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patient_name: e.target.value,
                      })
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
                    value={formData.patient_age ?? ""}
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
                  value={formData.patient_attendant_name || ""}
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
                    value={formData.patient_mob_no || ""}
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
                    value={formData.patient_alternative_mob_no || ""}
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
                  value={formData.patient_delivery_address || ""}
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

          {/* Notes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none shadow-sm resize-none"
            />
          </div>

          {/* Photos */}
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

            {(existingPhotos.length > 0 || assetPhotos.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="relative w-32 h-24">
                    <img
                      src={
                        photo.url.startsWith("http")
                          ? photo.url
                          : `${API_BASE_URL}${photo.url}`
                      }
                      alt="Existing"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingPhoto(photo.id)}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {assetPhotos.map((photo) => (
                  <div key={photo.id} className="relative w-32 h-24">
                    <img
                      src={photo.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewPhoto(photo.id)}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/rental-master")}
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
              {isSubmitting ? "Updating..." : "Update Requisition"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}