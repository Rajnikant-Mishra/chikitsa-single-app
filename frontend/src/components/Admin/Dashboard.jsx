import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "./Layout";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { 
  GraduationCap, 
  Users, 
  Bus, 
  TrendingUp, 
  ArrowUpRight, 
  FileText, 
  Activity,
  CheckCircle2,
  BarChart3,
  PieChart as PieIcon
} from "lucide-react";

const Dashboard = () => {
  const metricCards = [
    { title: "Total Student Network", value: "1,248", delta: "+4.2% Growth", icon: GraduationCap, color: "from-[#1e88e5] to-[#1565c0]", bgLight: "bg-blue-500/5" },
    { title: "Faculty System Nodes", value: "86 Staff", delta: "Fully Active", icon: Users, color: "from-teal-500 to-emerald-600", bgLight: "bg-emerald-500/5" },
    { title: "Active Transit Fleets", value: "14 / 16", delta: "Live Tracker", icon: Bus, color: "from-amber-500 to-orange-600", bgLight: "bg-amber-500/5" },
    { title: "Financial Ledger Sync", value: "₹42.8L", delta: "92% Invoiced", icon: TrendingUp, color: "from-[#2865be] to-indigo-700", bgLight: "bg-[#2865be]/5" }
  ];

  // Professional Multi-month Financial Streams Dataset
  const revenueTrendData = [
    { name: "Jan", Invoiced: 2.8, Collected: 2.1 },
    { name: "Feb", Invoiced: 3.4, Collected: 2.9 },
    { name: "Mar", Invoiced: 4.2, Collected: 3.8 },
    { name: "Apr", Invoiced: 4.8, Collected: 4.0 },
    { name: "May", Invoiced: 5.6, Collected: 4.9 },
    { name: "Jun", Invoiced: 6.2, Collected: 5.8 }
  ];

  // Dynamic Distribution Breakdown
  const distributionData = [
    { name: "Students", value: 500, color: "#2865be" },
    { name: "Academic Faculty", value: 500, color: "#10b981" },
    { name: "Logistics Personnel", value: 444, color: "#f59e0b" }
  ];

  return (
    <DashboardLayout title="System Overview Core">
      
      {/* Metric Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.04)] flex flex-col justify-between relative group overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[30px] transition-all duration-300 ${card.bgLight}`} />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm`}>
                  <Icon size={16} />
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between relative z-10">
                <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {card.value}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50 mt-2">
                    {card.delta}
                  </span>
                </div>
                <button className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-[#2865be] hover:bg-[#2865be]/5 transition-all">
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Advanced Analytic Visualization Matrix Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Analytics Graph Card: Premium Smooth Area Chart (2/3 Split View) */}
        <div className="lg:col-span-2 bg-white border border-slate-100/80 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#2865be]" /> Fee Revenue Index Array
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Comparative collection data metrics (Values in Lakhs)</p>
              </div>
            </div>

            {/* Recharts High-End Graphic Engine Box */}
            <div className="w-full h-64 text-xs font-semibold pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2865be" stopOpacity={0.2}/>
                      <stop offset="90%" stopColor="#2865be" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
                    itemStyle={{ fontWeight: "700", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="Invoiced" stroke="#2865be" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInvoiced)" />
                  <Area type="monotone" dataKey="Collected" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCollected)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Analytics Distribution Interactive Donut Ring (1/3 Split View) */}
        <div className="bg-white border border-slate-100/80 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-50 mb-4">
              <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
                <PieIcon size={16} className="text-[#2865be]" /> Distribution Ratios
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">System cluster volume metrics</p>
            </div>

            {/* Recharts Clean Geometric Donut Area */}
            <div className="w-full h-48 flex justify-center items-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #f1f5f9" }}
                    itemStyle={{ fontSize: "11px", fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <p className="text-xl font-black text-slate-800 tracking-tight">1,368</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Total Active</p>
              </div>
            </div>

            {/* Custom Interactive Legend Indicators */}
            <div className="space-y-2 mt-2">
              {distributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 border border-slate-100/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-md" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Main Structural Twin Dashboard Layout Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-time Tracking Feeds (2/3 Split View) */}
        <div className="lg:col-span-2 bg-white border border-slate-100/80 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase">Active Pipeline Log</h3>
                <p className="text-[11px] text-slate-400 font-medium">Real-time infrastructure system entries</p>
              </div>
              <span className="text-[9px] font-black px-2.5 py-1 bg-blue-50 text-[#2865be] rounded-lg border border-blue-100 uppercase tracking-wider flex items-center gap-1">
                <Activity size={12} className="animate-pulse" /> Live Node Stream
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { entity: "Transit Route Array #04", detail: "Assigned vehicle reached Sector 3 Terminal Gate Node", status: "In Route", time: "Just Now", color: "text-amber-600 bg-amber-50 border-amber-100" },
                { entity: "Core Financial Ledger", detail: "Synchronized invoices and salary tables for administrative staff", status: "Verified", time: "8 mins ago", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                { entity: "System Security Node", detail: "Cleared verification certificates for new registrar profiles", status: "Committed", time: "1 hr ago", color: "text-blue-600 bg-blue-50 border-blue-100" }
              ].map((log, i) => (
                <div key={i} className="flex items-start justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100/60 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 mt-0.5">
                      <FileText size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{log.entity}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{log.detail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${log.color}`}>
                      {log.status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full text-center py-3 border-2 border-dashed border-slate-200 text-slate-400 hover:text-[#2865be] hover:border-[#2865be]/60 font-bold text-xs uppercase tracking-widest rounded-xl transition-all mt-6">
            Access Command Logging Matrix
          </button>
        </div>

        {/* Action Panel Matrix (1/3 Split View) */}
        <div className="bg-white border border-slate-100/80 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase">Administrative Core Actions</h3>
              <p className="text-[11px] text-slate-400 font-medium">Deploy standard infrastructure utilities</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: "Provision Student Account", desc: "Create secure institutional access profile" },
                { label: "Dispatch Fleet Notification", desc: "Push emergency updates to transit paths" },
                { label: "Export Transaction Matrix", desc: "Compile collected revenue rows into structured data" }
              ].map((action, i) => (
                <button key={i} className="w-full text-left p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-[#2865be]/30 hover:bg-[#2865be]/5 transition-all group flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-800 group-hover:text-[#2865be] transition-colors">{action.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{action.desc}</p>
                  </div>
                  <CheckCircle2 size={14} className="text-slate-200 group-hover:text-[#2865be] transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#2865be]/5 to-transparent border border-[#2865be]/10 text-center mt-6">
            <p className="text-[10px] font-black text-[#2865be] uppercase tracking-widest mb-0.5">Core Secure Node</p>
            <p className="text-xs text-slate-400 font-semibold">shikshaOne Cluster Deployment Active</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;