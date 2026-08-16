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

const TABS = [
  { id: "device", label: "Devices", icon: "🖥️" },
  { id: "accessories", label: "Accessories", icon: "📦" },
  { id: "care", label: "Care Centers", icon: "🏥" },
  { id: "reference", label: "References", icon: "👨‍⚕️" },
  { id: "delivery", label: "Delivery Execs", icon: "🚴" },
];

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
        return { endpoint: `${BASE_URL}/api/accessori`, idKey: "accessory_id" };
      case "care":
        return {
          endpoint: `${BASE_URL}/api/carecenters`,
          idKey: "carecenter_id",
        };
      case "reference":
        return {
          endpoint: `${BASE_URL}/api/references`,
          idKey: "reference_id",
        };
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
      throw new Error(
        "Session expired. Please log back into your admin portal.",
      );
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
          errData?.message || `Failed to load ${activeTab} records.`,
        );
      }

      const result = await safeJson(res);
      const dataPayload = Array.isArray(result) ? result : (result?.data ?? []);
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
          data?.message || "Unable to modify configuration record.",
        );
      }

      alert(
        isEditMode
          ? "Configuration record updated."
          : "Record created successfully.",
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
          data?.message || "Failed to eliminate targeted entity node.",
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

  const getStatusBadge = (status) => {
    if (status === "inactive") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border border-rose-200 bg-rose-50 text-rose-700">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Active
      </span>
    );
  };

  const tabActions = {
    device: { label: "Add Device", icon: "➕" },
    accessories: { label: "Add Accessory", icon: "📦" },
    care: { label: "Add Care Center", icon: "🏥" },
    reference: { label: "Add Reference", icon: "👨‍⚕️" },
    delivery: { label: "Add Delivery Exec", icon: "🚴" },
  };

  const modalTitles = {
    device: {
      create: "Register Device Asset",
      edit: "Modify Device Asset",
    },
    accessories: {
      create: "Add New Accessory",
      edit: "Modify Accessory",
    },
    care: {
      create: "Register Care Center",
      edit: "Modify Care Center",
    },
    reference: {
      create: "Link External Reference",
      edit: "Modify Reference Record",
    },
    delivery: {
      create: "Onboard Delivery Executive",
      edit: "Modify Delivery Executive",
    },
  };

  const isEditMode = () => {
    const form = getCurrentForm();
    const { idKey } = getModuleConfig(activeTab);
    return !!form[idKey];
  };

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e4a67]/20 focus:border-[#0e4a67] transition";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  // ---------- render ----------
  return (
    <DashboardLayout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] items-center justify-center text-white text-xl shadow-md shadow-[#0e4a67]/20">
                📋
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Global Inventory Ledger
                </h1>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">
                  Devices · Accessories · Care Centers · References · Delivery
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Stats pills */}
              <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-800">
                  Active{" "}
                  <span className="font-extrabold">{availableCount}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 bg-rose-50 border border-rose-100 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span className="text-xs font-semibold text-rose-800">
                  Inactive{" "}
                  <span className="font-extrabold">{criticalCount}</span>
                </span>
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="ml-auto sm:ml-0 bg-[#0e4a67] hover:bg-[#125c80] active:scale-[0.98] transition-all text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#0e4a67]/25 flex items-center gap-2 text-sm"
              >
                <span>{tabActions[activeTab]?.icon}</span>
                {tabActions[activeTab]?.label}
              </button>
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="px-4 sm:px-6 border-t border-slate-100 bg-slate-50/60">
            <div className="flex gap-1 overflow-x-auto scrollbar-none -mb-px">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "text-[#0e4a67]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="text-base opacity-80">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-[#0e4a67]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== ERROR ===== */}
        {errorMsg && (
          <div className="flex items-center gap-3 px-5 py-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-semibold shadow-sm">
            <span className="text-lg">⚠️</span>
            <span className="flex-1">{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* ===== TABLE CARD ===== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Table meta bar */}
          <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
            <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              {TABS.find((t) => t.id === activeTab)?.label} ·{" "}
              <span className="text-slate-600">{assets.length} records</span>
            </p>
            <button
              onClick={fetchAssets}
              disabled={isLoading}
              className="text-xs font-bold text-[#0e4a67] hover:text-[#125c80] disabled:opacity-40 flex items-center gap-1.5 transition"
            >
              <span className={isLoading ? "animate-spin" : ""}>↻</span>
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  {activeTab === "device" && (
                    <>
                      <th className="py-3.5 px-6 w-24">ID</th>
                      <th className="py-3.5 px-6">Device Name</th>
                      <th className="py-3.5 px-6 w-32">Status</th>
                    </>
                  )}
                  {activeTab === "accessories" && (
                    <>
                      <th className="py-3.5 px-6 w-24">ID</th>
                      <th className="py-3.5 px-6">Accessory Name</th>
                      <th className="py-3.5 px-6 w-32">Status</th>
                    </>
                  )}
                  {activeTab === "care" && (
                    <>
                      <th className="py-3.5 px-6">Center Name</th>
                      <th className="py-3.5 px-6">Address</th>
                      <th className="py-3.5 px-6">Contact</th>
                      <th className="py-3.5 px-6 w-32">Status</th>
                    </>
                  )}
                  {activeTab === "reference" && (
                    <>
                      <th className="py-3.5 px-6">Doctor / Specialist</th>
                      <th className="py-3.5 px-6">Hospital</th>
                      <th className="py-3.5 px-6">Contact</th>
                      <th className="py-3.5 px-6 w-32">Status</th>
                    </>
                  )}
                  {activeTab === "delivery" && (
                    <>
                      <th className="py-3.5 px-6">Executive Name</th>
                      <th className="py-3.5 px-6">Mobile</th>
                      <th className="py-3.5 px-6 w-32">Status</th>
                    </>
                  )}
                  <th className="py-3.5 px-6 text-right w-36">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-[3px] border-t-transparent border-[#0e4a67] rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm font-medium">
                          Loading records…
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : assets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="inline-flex flex-col items-center gap-2">
                        <span className="text-3xl opacity-40">📭</span>
                        <p className="text-slate-400 text-sm font-medium">
                          No records found for this module
                        </p>
                        <button
                          onClick={() => handleOpenModal()}
                          className="mt-2 text-xs font-bold text-[#0e4a67] hover:underline"
                        >
                          + Create the first entry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  assets.map((item, index) => {
                    const idValue = item[getModuleConfig(activeTab).idKey];
                    return (
                      <tr
                        key={idValue ?? `row-${index}`}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {activeTab === "device" && (
                          <>
                            <td className="py-4 px-6">
                              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                #{item.device_id}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {item.device_name}
                            </td>
                            <td className="py-4 px-6">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "accessories" && (
                          <>
                            <td className="py-4 px-6">
                              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                #{item.accessory_id}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {item.accessory_name}
                            </td>
                            <td className="py-4 px-6">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "care" && (
                          <>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {item.carecenter_name}
                            </td>
                            <td className="py-4 px-6 text-slate-500 text-sm max-w-[200px] truncate">
                              {item.address || "—"}
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-xs font-mono text-slate-600 space-y-0.5">
                                <div>📞 {item.mobile_number || "—"}</div>
                                {item.alternative_mobile_number && (
                                  <div className="text-slate-400">
                                    {item.alternative_mobile_number}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "reference" && (
                          <>
                            <td className="py-4 px-6">
                              <p className="font-bold text-slate-800">
                                {item.doctor_name}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {item.specialist || "—"}
                              </p>
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-medium text-sm">
                              {item.hospital_name || "—"}
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-xs font-mono text-slate-600 space-y-0.5">
                                <div>📞 {item.mobile_number || "—"}</div>
                                {item.alternative_number && (
                                  <div className="text-slate-400">
                                    {item.alternative_number}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "delivery" && (
                          <>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {item.delivery_name}
                            </td>
                            <td className="py-4 px-6 font-mono text-xs text-slate-600">
                              🚴 {item.mobile_number || "—"}
                            </td>
                            <td className="py-4 px-6">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="px-3 py-1.5 text-xs font-bold text-[#0e4a67] bg-[#0e4a67]/5 hover:bg-[#0e4a67]/10 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(idValue)}
                              className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px]"
            onClick={handleCloseModal}
          ></div>

          {/* Panel */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0e4a67] to-[#155e82] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-0.5">
                  {isEditMode() ? "Edit Record" : "New Record"}
                </p>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {isEditMode()
                    ? modalTitles[activeTab]?.edit
                    : modalTitles[activeTab]?.create}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* DEVICE */}
              {activeTab === "device" && (
                <>
                  <div>
                    <label className={labelClass}>Device Model Name *</label>
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
                      className={inputClass}
                      placeholder="e.g. Oxygen Concentrator X1"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Operational Status</label>
                    <select
                      value={deviceForm.status}
                      onChange={(e) =>
                        setDeviceForm({
                          ...deviceForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
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
                    <label className={labelClass}>Accessory Name *</label>
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
                      className={inputClass}
                      placeholder="e.g. High Pressure Nasal Cannula"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={accessoryForm.status}
                      onChange={(e) =>
                        setAccessoryForm({
                          ...accessoryForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
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
                    <label className={labelClass}>Care Center Name *</label>
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
                      className={inputClass}
                      placeholder="e.g. Lifeline Central Medical"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={careForm.address}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          address: e.target.value,
                        })
                      }
                      className={`${inputClass} resize-none`}
                      placeholder="Full operational address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Mobile *</label>
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
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Alt Mobile</label>
                      <input
                        type="text"
                        value={careForm.alternative_mobile_number || ""}
                        onChange={(e) =>
                          setCareForm({
                            ...careForm,
                            alternative_mobile_number: e.target.value,
                          })
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={careForm.status}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
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
                      <label className={labelClass}>Doctor Name *</label>
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
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Specialist *</label>
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
                        className={inputClass}
                        placeholder="e.g. Pulmonologist"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Hospital Name *</label>
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
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Mobile *</label>
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
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Alt Number</label>
                      <input
                        type="text"
                        value={referenceForm.alternative_number || ""}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            alternative_number: e.target.value,
                          })
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={referenceForm.status}
                      onChange={(e) =>
                        setReferenceForm({
                          ...referenceForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
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
                    <label className={labelClass}>Executive Name *</label>
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
                      className={inputClass}
                      placeholder="Full legal name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number *</label>
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
                      className={`${inputClass} font-mono`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={deliveryForm.status}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-bold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0e4a67] hover:bg-[#125c80] text-white text-sm font-bold shadow-md shadow-[#0e4a67]/25 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving…
                    </>
                  ) : (
                    "Save Entry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}