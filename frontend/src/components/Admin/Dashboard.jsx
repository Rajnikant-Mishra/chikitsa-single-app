import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || [];
  } catch {
    return [];
  }
}

function daysBetween(from, to = new Date()) {
  if (!from) return 0;
  const start = new Date(from);
  const end = to instanceof Date ? to : new Date(to);
  return Math.max(
    0,
    Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
  );
}

function formatDate(d) {
  if (!d) return "—";
  const parts = String(d).slice(0, 10).split("-");
  if (parts[0]?.length === 4) {
    const date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    if (!isNaN(date)) {
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    }
  }
  return d;
}

const STATUS_MAP = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Delivered: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  Running: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Returned: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  Closed: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

function StatusPill({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {status || "Pending"}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [devices, setDevices] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [careCenters, setCareCenters] = useState([]);
  const [references, setReferences] = useState([]);
  const [deliveryExecs, setDeliveryExecs] = useState([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [r, d, a, c, ref, del] = await Promise.all([
      safeFetch(`${API_BASE_URL}/api/rentals`),
      safeFetch(`${API_BASE_URL}/api/devices`),
      safeFetch(`${API_BASE_URL}/api/accessori`),
      safeFetch(`${API_BASE_URL}/api/carecenters`),
      safeFetch(`${API_BASE_URL}/api/references`),
      safeFetch(`${API_BASE_URL}/api/delivery-executives`),
    ]);
    setRentals(r);
    setDevices(d);
    setAccessories(a);
    setCareCenters(c);
    setReferences(ref);
    setDeliveryExecs(del);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ——— KPI calculations ———
  const totalRentals = rentals.length;
  const pending = rentals.filter((r) => r.status === "Pending").length;
  const running = rentals.filter(
    (r) => r.status === "Running" || r.status === "Delivered",
  ).length;
  const returned = rentals.filter(
    (r) => r.status === "Returned" || r.status === "Closed",
  ).length;
  const dueSoon = rentals.filter((r) => {
    if (r.login_out_date) return false;
    const days = daysBetween(r.login_date);
    return (
      days >= 25 &&
      ["Pending", "Delivered", "Running"].includes(r.status || "Pending")
    );
  }).length;

  const activeDevices = devices.filter((d) => d.status === "active").length;
  const activeAccessories = accessories.filter(
    (a) => a.status === "active",
  ).length;
  const activeCenters = careCenters.filter((c) => c.status === "active").length;
  const activeRefs = references.filter((r) => r.status === "active").length;
  const activeDelivery = deliveryExecs.filter(
    (d) => d.status === "active",
  ).length;

  const recentRentals = [...rentals]
    .sort((a, b) => (b.rental_id || 0) - (a.rental_id || 0))
    .slice(0, 8);

  const dueList = rentals
    .filter((r) => {
      if (r.login_out_date) return false;
      const days = daysBetween(r.login_date);
      return (
        days >= 25 &&
        ["Pending", "Delivered", "Running"].includes(r.status || "Pending")
      );
    })
    .sort((a, b) => daysBetween(b.login_date) - daysBetween(a.login_date))
    .slice(0, 5);

  const dealBreakdown = {
    B2B: rentals.filter((r) => r.deal_type === "B2B").length,
    B2C: rentals.filter((r) => r.deal_type === "B2C").length,
  };
  const modeBreakdown = {
    Prepaid: rentals.filter((r) => r.mode_type === "Prepaid").length,
    Postpaid: rentals.filter((r) => r.mode_type === "Postpaid").length,
  };

  const kpis = [
    {
      label: "Total Rentals",
      value: totalRentals,
      sub: "All time",
      icon: "📋",
      color: "from-[#0e4a67] to-[#155e82]",
      shadow: "shadow-[#0e4a67]/20",
    },
    {
      label: "Active / Running",
      value: running,
      sub: "In field",
      icon: "🟢",
      color: "from-emerald-600 to-emerald-500",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Pending",
      value: pending,
      sub: "Awaiting deploy",
      icon: "⏳",
      color: "from-amber-500 to-amber-400",
      shadow: "shadow-amber-500/20",
    },
    {
      label: "Due Alert",
      value: dueSoon,
      sub: "≥ 25 days open",
      icon: "⚠️",
      color: "from-rose-500 to-rose-400",
      shadow: "shadow-rose-500/20",
    },
  ];

  const modules = [
    {
      title: "Devices",
      count: activeDevices,
      total: devices.length,
      path: "/inventory", // adjust to your route
      icon: "🖥️",
      tint: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      title: "Accessories",
      count: activeAccessories,
      total: accessories.length,
      path: "/inventory",
      icon: "📦",
      tint: "bg-violet-50 text-violet-700 border-violet-100",
    },
    {
      title: "Care Centers",
      count: activeCenters,
      total: careCenters.length,
      path: "/inventory",
      icon: "🏥",
      tint: "bg-teal-50 text-teal-700 border-teal-100",
    },
    {
      title: "References",
      count: activeRefs,
      total: references.length,
      path: "/inventory",
      icon: "👨‍⚕️",
      tint: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      title: "Delivery Execs",
      count: activeDelivery,
      total: deliveryExecs.length,
      path: "/inventory",
      icon: "🚴",
      tint: "bg-orange-50 text-orange-700 border-orange-100",
    },
  ];

  const quickActions = [
    {
      label: "New Requisition",
      path: "/rental-requisition",
      icon: "➕",
      primary: true,
    },
    {
      label: "Rental Master",
      path: "/rental-master",
      icon: "📑",
    },
    {
      label: "Inventory Ledger",
      path: "/inventory",
      icon: "📋",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-10 h-10 border-[3px] border-t-transparent border-[#0e4a67] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">
            Loading dashboard…
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-8">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
              Operations Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Live overview of rentals, assets & logistics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {quickActions.map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition active:scale-[0.98] ${
                  a.primary
                    ? "bg-[#0e4a67] hover:bg-[#125c80] text-white shadow-md shadow-[#0e4a67]/25"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            ))}
            <button
              onClick={loadAll}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#0e4a67] hover:bg-slate-50 transition shadow-sm"
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>

        {/* ========== KPI CARDS ========== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 group hover:shadow-md transition"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${k.color} opacity-[0.07] rounded-bl-[80px]`}
              ></div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{k.icon}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider text-slate-400`}
                >
                  {k.sub}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {k.value}
              </p>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {k.label}
              </p>
            </div>
          ))}
        </div>

        {/* ========== MIDDLE ROW: Modules + Breakdown ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Inventory modules */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Inventory Modules
              </h2>
              <Link
                to="/inventory"
                className="text-xs font-bold text-[#0e4a67] hover:underline"
              >
                Manage →
              </Link>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {modules.map((m) => (
                <button
                  key={m.title}
                  onClick={() => navigate(m.path)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${m.tint} hover:scale-[1.02] active:scale-[0.98] transition text-center`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs font-bold leading-tight">
                    {m.title}
                  </span>
                  <span className="text-lg font-extrabold">{m.count}</span>
                  <span className="text-[10px] opacity-70">
                    of {m.total} total
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Deal / Mode breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Deal & Mode Mix
              </h2>
            </div>
            <div className="p-5 space-y-5">
              {/* Deal */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Deal Type
                </p>
                <div className="space-y-2">
                  {["B2B", "B2C"].map((key) => {
                    const val = dealBreakdown[key] || 0;
                    const pct =
                      totalRentals > 0
                        ? Math.round((val / totalRentals) * 100)
                        : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">{key}</span>
                          <span className="text-slate-800">
                            {val} · {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0e4a67] transition-all"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Mode */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Billing Mode
                </p>
                <div className="space-y-2">
                  {["Prepaid", "Postpaid"].map((key) => {
                    const val = modeBreakdown[key] || 0;
                    const pct =
                      totalRentals > 0
                        ? Math.round((val / totalRentals) * 100)
                        : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">{key}</span>
                          <span className="text-slate-800">
                            {val} · {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              key === "Prepaid"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Returned */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Returned / Closed
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {returned}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========== BOTTOM ROW: Recent + Due ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Recent rentals */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Recent Requisitions
              </h2>
              <Link
                to="/rental-master"
                className="text-xs font-bold text-[#0e4a67] hover:underline"
              >
                View all →
              </Link>
            </div>
            {recentRentals.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No rentals yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                      <th className="px-5 py-3">Patient</th>
                      <th className="px-5 py-3">Device</th>
                      <th className="px-5 py-3">Login</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentRentals.map((r) => {
                      const days = daysBetween(r.login_date, r.login_out_date);
                      return (
                        <tr
                          key={r.rental_id}
                          className="hover:bg-slate-50/70 transition cursor-pointer"
                          onClick={() =>
                            navigate(`/rental-view/${r.rental_id}`)
                          }
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                              {r.patient_name || "—"}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {r.deal_type || "—"} · {r.mode_type || "—"}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-[#0e4a67]">
                            {r.device?.device_name || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                            {formatDate(r.login_date)}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusPill status={r.status} />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={`text-sm font-bold ${
                                !r.login_out_date && days >= 30
                                  ? "text-amber-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {days}
                              {!r.login_out_date && days >= 30 ? " ⚠" : ""}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Due / Attention list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-white">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Needs Attention
                </h2>
              </div>
              {dueList.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  {dueList.length}
                </span>
              )}
            </div>
            {dueList.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-2xl mb-2 opacity-50">✅</p>
                <p className="text-sm text-slate-400 font-medium">
                  Nothing overdue
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {dueList.map((r) => {
                  const days = daysBetween(r.login_date);
                  return (
                    <li
                      key={r.rental_id}
                      onClick={() => navigate(`/rental-view/${r.rental_id}`)}
                      className="px-5 py-3.5 hover:bg-amber-50/40 cursor-pointer transition flex items-center gap-3"
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                          days >= 30
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {days}d
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {r.patient_name || "Patient"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {r.device?.device_name || "Device"} · since{" "}
                          {formatDate(r.login_date)}
                        </p>
                      </div>
                      <StatusPill status={r.status} />
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <Link
                to="/rental-master"
                className="text-xs font-bold text-[#0e4a67] hover:underline"
              >
                Open Rental Master →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}