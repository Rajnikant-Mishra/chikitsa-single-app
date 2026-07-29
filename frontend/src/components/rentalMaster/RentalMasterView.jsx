import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalView() {
  const { id } = useParams(); // Extracts the rental_id from routing path if configured
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fallback pattern to grab ID from either URL parameter match path or location state context flows
  const rentalId = id || location.state?.rental_id || location.state?.rental?.rental_id;

  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rentalId) {
      setError("No valid runtime transaction identifier target sequence found.");
      setIsLoading(false);
      return;
    }

    const fetchRentalDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Requested rental records mismatch target repository metrics.");
          if (response.status === 401) throw new Error("Authorization credentials expired.");
          throw new Error("Server rejected record retrieval parameters.");
        }

        const result = await response.json();
        
        // Match standard API envelope wrapper shapes
        if (result.success) {
          setRental(result.data);
        } else {
          setRental(result);
        }
      } catch (err) {
        console.error("Critical failure during record fetch execution sequence:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0e4a67] rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 tracking-wide">Syncing Manifest Context Pools...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !rental) {
    return (
      <DashboardLayout>
        <div className="w-full mx-auto max-w-xl bg-rose-50 rounded-2xl p-6 border border-rose-100 shadow-sm text-center mt-12 space-y-4">
          <div className="text-rose-600 text-3xl font-black">✕</div>
          <h3 className="text-lg font-black text-rose-900">Pipeline Aborted</h3>
          <p className="text-sm text-rose-700 font-medium">{error || "Data load structural anomalies detected."}</p>
          <button
            onClick={() => navigate("/rental-master")}
            className="mt-2 px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 rounded-xl transition shadow-xs"
          >
            Return to Master Manifest
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-6 p-2">
        {/* HEADER CONTROLS */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              🔍 Requisition Record: #{rental.rental_id}
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
              System Pipeline Identifier UUID Validation Secure Node
            </p>
          </div>
          <button
            onClick={() => navigate("/rental-master")}
            className="px-5 py-2.5 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 font-bold text-slate-700 text-sm transition shadow-sm flex items-center gap-2"
          >
            ← Back to Listing
          </button>
        </div>

        {/* DETAILS GRID LAYOUT MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LOGISTICS & DEVICE PROFILE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              📦 Logistics & Device Matrix
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Assigned Model</span>
                <span className="font-bold text-slate-900 text-base">{rental.device?.device_name || "N/A"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Record Entry Date</span>
                <span className="font-bold text-slate-900">{rental.record_date || "—"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Log In Operations</span>
                <span className="font-bold text-slate-900">{rental.login_date}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Log Out Operations</span>
                <span className="font-bold text-slate-900">{rental.login_out_date || "—"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Recall System Check</span>
                <span className="font-bold text-slate-900">{rental.recall_date || "—"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Pipeline Status State</span>
                <span className={`inline-block px-3 py-1 text-xs font-black rounded-xl mt-0.5 ${
                  rental.status === "Running" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {rental.status}
                </span>
              </div>
            </div>
          </div>

          {/* COMMERCIALS MATRIX */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              💳 Commercial Parameters
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Billing Sequence Type</span>
                <span className="font-bold text-emerald-700 text-base uppercase tracking-wide">{rental.billing_type}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Base Rental Charge</span>
                <span className="font-bold text-slate-900 text-base">₹{Number(rental.rental_charge || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Security Deposit / Advance</span>
                <span className="font-bold text-slate-900 text-base">₹{Number(rental.deposit_advance || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Deployment/Installation Fee</span>
                <span className="font-bold text-slate-900 text-base">₹{Number(rental.installation_charge || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PATIENT IDENTITY DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-[#0e4a67] uppercase tracking-wider border-b border-slate-100 pb-2">
              👤 Patient Identity Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Patient Legal Name:</span>
                <span className="font-bold text-slate-900">{rental.patient_name}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Age Matrix Index:</span>
                <span className="font-bold text-slate-900">{rental.patient_age || "—"} Yrs</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Primary Mobile Number:</span>
                <span className="font-bold text-slate-900">{rental.patient_mob_no || "—"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Alternative Mobile:</span>
                <span className="font-bold text-slate-900">{rental.patient_alternative_mob_no || "—"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Assigned Attendant Name:</span>
                <span className="font-bold text-slate-900">{rental.patient_attendant_name || "—"}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-medium block mb-1.5">Target Destination Delivery Address:</span>
                <span className="font-bold text-slate-900 block bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  {rental.patient_delivery_address || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* CARE CENTER REGULATORY CONTEXT */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-[#0e4a67] uppercase tracking-wider border-b border-slate-100 pb-2">
              🏢 Care Center Context
            </h4>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Institutional Facility:</span>
                <span className="font-bold text-slate-900">{rental.careCenter?.carecenter_name || "Direct Patient Domiciliary Basis"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Primary POC Mobile Node:</span>
                <span className="font-bold text-slate-900">{rental.mob_no || "—"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Alternative Mobile Node:</span>
                <span className="font-bold text-slate-900">{rental.alternative_mob_no || "—"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Allocated Bed Mapping:</span>
                <span className="font-bold text-slate-900">{rental.care_bed_no || "—"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Attending Doctor / Executive POC:</span>
                <span className="font-bold text-slate-900">{rental.care_poc_name || "—"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Referral Entity Context:</span>
                <span className="font-bold text-slate-900">{rental.care_referal || "—"}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-medium block mb-1.5">Facility Location Address:</span>
                <span className="font-bold text-slate-900 block bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  {rental.care_address || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO VERIFICATION SNAPSHOT PORTS */}
        {rental.asset_photos && rental.asset_photos.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              📸 Asset Handover Photo Verification Manifest
            </h4>
            <div className="flex flex-wrap gap-3">
              {rental.asset_photos.map((imgName, index) => (
                <div key={index} className="w-32 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 relative group">
                  <img
                    src={`${API_BASE_URL}/uploads/documents/${imgName}`}
                    alt="Handover Snapshot Verification"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-zoom-in"
                    onClick={() => window.open(`${API_BASE_URL}/uploads/documents/${imgName}`, "_blank")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}