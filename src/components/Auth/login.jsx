// import React, { useState } from "react";
// import {
//   ArrowRight,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   AlertCircle,
//   Loader2,
//   LockKeyhole,
//   UserPlus,
// } from "lucide-react";
// import { useNavigate, Link } from "react-router-dom";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const LoginView = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isLoading) return;

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password,
//         }),
//       });

//       const text = await response.text();
//       let data = {};

//       try {
//         data = text ? JSON.parse(text) : {};
//       } catch (parseError) {
//         console.error("JSON Parse Error:", parseError);
//         console.log("Server Response:", text);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || "Invalid email or password");
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       navigate("/admin-dashboard", { replace: true });
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError(err.message || "Unable to login. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-gradient-to-tr from-slate-900 via-[#006d77] to-slate-800 overflow-hidden font-sans selection:bg-[#006d77]/20">
//       <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000" />
//       <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#005a63]/40 rounded-full blur-3xl pointer-events-none" />

//       <div className="w-full max-w-[560px] bg-white border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_30px_70px_-15px_rgba(0,109,119,0.3)] backdrop-blur-sm relative z-10 transition-all duration-300 hover:shadow-[0_35px_80px_-10px_rgba(0,109,119,0.4)] flex flex-col items-center">
//         <div className="inline-flex p-3 rounded-2xl bg-[#006d77] text-white shadow-xl shadow-[#006d77]/30 mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
//           <LockKeyhole size={24} strokeWidth={2.5} />
//         </div>

//         <div className="space-y-2.5 mb-8 text-center w-full">
//           <h2 className="text-3xl font-black text-slate-900 tracking-tight">
//             Chikitsha Console Login
//           </h2>
//           <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mx-auto">
//             Provide authorized credentials to log secure access into your clinical management network.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5 w-full">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
//               <div className="p-1 rounded-lg bg-red-100 text-red-600 shrink-0">
//                 <AlertCircle size={16} strokeWidth={2.5} />
//               </div>
//               <span className="text-xs font-bold uppercase tracking-wider leading-none text-center">
//                 {error}
//               </span>
//             </div>
//           )}

//           <div className="space-y-2">
//             <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left ml-1">
//               Official Email Address
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Mail
//                   size={18}
//                   className="text-slate-300 group-focus-within:text-[#006d77] transition-colors"
//                 />
//               </div>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100/70 rounded-2xl text-slate-900 text-sm font-semibold placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#006d77]/5 focus:border-[#006d77] transition-all shadow-inner text-left"
//                 placeholder="admin@chikitsha.com"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left ml-1">
//               Secure Password
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Lock
//                   size={18}
//                   className="text-slate-300 group-focus-within:text-[#006d77] transition-colors"
//                 />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="block w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100/70 rounded-2xl text-slate-900 text-sm font-semibold placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#006d77]/5 focus:border-[#006d77] transition-all shadow-inner text-left"
//                 placeholder="••••••••"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
            
//             <div className="text-right">
//               <Link
//                 to="/forgot-password"
//                 className="text-[11px] font-bold text-[#006d77] tracking-wider hover:text-[#005a63] hover:underline underline-offset-4 transition-colors mr-1"
//               >
//                 Reset Password?
//               </Link>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#006d77] text-white py-4.5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#005a63] shadow-xl shadow-[#006d77]/20 transition-all flex items-center justify-center space-x-2.5 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed mt-4 group relative overflow-hidden"
//           >
//             {isLoading ? (
//               <Loader2 className="w-5 h-5 animate-spin text-white" />
//             ) : (
//               <>
//                 <span>Login</span>
//                 <ArrowRight
//                   size={16}
//                   strokeWidth={2.5}
//                   className="group-hover:translate-x-1 transition-transform duration-200"
//                 />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-8 flex flex-col items-center justify-center space-y-5 w-full">
          

        
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginView;




import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
      }

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Unable to login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0e4a67] font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-[1.5rem] p-10 shadow-2xl flex flex-col items-center">
        
        {/* Chikitsha OS Icon Logo */}
        <div className="inline-flex p-3 rounded-xl bg-[#007a78] text-white mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12h1.5m0 0l2-4 3 8 4-11 2.5 7h1.5"
            />
          </svg>
        </div>

        {/* Branding Headings */}
        <div className="mb-8 text-center w-full">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            CHIKITSA OS
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Identity Field Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">
              Employee ID / Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007a78]/20 focus:border-[#007a78] transition-all"
              placeholder="admin@chikitsa.com"
              required
            />
          </div>

          {/* Secure Credential Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007a78]/20 focus:border-[#007a78] transition-all tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Secure Submission Button Trigger */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#007a78] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#006361] transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <>
                <span>Secure Login</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;