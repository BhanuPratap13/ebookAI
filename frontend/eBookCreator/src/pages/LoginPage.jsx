// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";

// const LoginPage = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/dashboard";

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     setLoading(true);
//     try {
//       await login(formData.email, formData.password);
//       toast.success("Welcome back! 👋");
//       navigate(from, { replace: true });
//     } catch (error) {
//       const msg = error?.response?.data?.message || "Login failed. Please try again.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0f0f1a] flex">
//       {/* Left decorative panel */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
//         <div className="absolute inset-0">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
//         </div>
//         <div className="relative z-10 p-12 max-w-md">
//           <div className="flex items-center gap-2 mb-8">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
//               <span className="text-white font-bold">E</span>
//             </div>
//             <span className="text-white font-bold text-2xl">eBook<span className="text-orange-400">AI</span></span>
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
//             Write Your Next Bestseller with AI
//           </h2>
//           <p className="text-gray-400 leading-relaxed mb-8">
//             Create professional ebooks in minutes using Google Gemini AI. Generate outlines, write chapters, and export instantly.
//           </p>
//           <div className="space-y-3">
//             {["✨ AI Outline Generator", "📝 Full Chapter Writing", "📤 Export to PDF & Word", "🔄 Real-Time Preview"].map((feature) => (
//               <div key={feature} className="flex items-center gap-3 text-gray-300 text-sm">
//                 <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
//                   <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 {feature}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right form panel */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md">
//           {/* Mobile logo */}
//           <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
//               <span className="text-white text-sm font-bold">E</span>
//             </div>
//             <span className="text-white font-bold text-lg">eBook<span className="text-orange-400">AI</span></span>
//           </div>

//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
//             <p className="text-gray-400">Sign in to continue creating</p>
//           </div>

//           <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <input
//                 id="login-email"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all text-sm"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="login-password"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all text-sm pr-12"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               id="login-submit-btn"
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           <p className="text-center mt-6 text-gray-400 text-sm">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
//               Create one free →
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
// // import React from 'react'

// // function LoginPage() {
// //   return (
// //     <div>
// //       <h1>login</h1>

// //     </div>
// //   )
// // }

// // export default LoginPage


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Adjust this call to match your actual AuthContext login signature
      await login(formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid email or password");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden">
      {/* Left panel — branding / motion */}
      <div className="hidden lg:flex flex-col justify-between relative bg-linear-to-br from-violet-600 via-purple-600 to-violet-800 p-12 overflow-hidden">
        {/* Ambient floating blobs */}
        <div className="size-80 bg-white/10 rounded-full absolute -left-20 -top-20 blur-3xl animate-pulse" />
        <div className="size-96 bg-purple-400/20 rounded-full absolute -right-32 bottom-0 blur-3xl animate-pulse delay-700" />
        <div className="size-56 bg-violet-300/20 rounded-full absolute right-10 top-1/3 blur-3xl animate-pulse delay-300" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">eBookAI</span>
        </Link>

        {/* Center message */}
        <div className="relative z-10 space-y-6 max-w-md animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
            Your next book
            <br />
            starts with a
            <br />
            <span className="text-violet-200">single sentence.</span>
          </h2>
          <p className="text-violet-100/80 text-base leading-relaxed">
            Pick up right where you left off. Your drafts, outlines, and
            research are exactly as you left them.
          </p>
        </div>

        {/* Bottom stat strip */}
        <div className="relative z-10 flex items-center gap-8">
          <div>
            <p className="text-white text-2xl font-bold">50K+</p>
            <p className="text-violet-200 text-sm">Books created</p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-white text-2xl font-bold">4.9/5</p>
            <p className="text-violet-200 text-sm">User rating</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-6 sm:p-10 relative">
        {/* Mobile-only decorative blob */}
        <div className="lg:hidden size-64 bg-violet-200/30 rounded-full absolute -top-10 -right-10 blur-3xl animate-pulse" />

        <div
          className={`w-full max-w-sm space-y-8 relative transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8 w-fit">
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">eBookAI</span>
          </Link>

          <div className="space-y-2 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Log in to continue where you left off.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in-up">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focusedField === "email"
                    ? "border-violet-500 ring-4 ring-violet-500/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Mail
                  className={`size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    focusedField === "email" ? "text-violet-600" : "text-gray-400"
                  }`}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focusedField === "password"
                    ? "border-violet-500 ring-4 ring-violet-500/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Lock
                  className={`size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    focusedField === "password" ? "text-violet-600" : "text-gray-400"
                  }`}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full bg-transparent rounded-xl pl-11 pr-11 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl px-6 py-3.5 shadow-lg shadow-violet-500/30 inline-flex items-center justify-center gap-x-2 transition-all duration-200 hover:shadow-violet-500/50 hover:scale-101 focus-visible:shadow-violet-500/50 active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log in</span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;