// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";

// const SignupPage = () => {
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validatePassword = (pwd) => {
//     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email || !formData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     if (!validatePassword(formData.password)) {
//       toast.error("Password must be 8+ chars with uppercase, lowercase & number");
//       return;
//     }
//     setLoading(true);
//     try {
//       await register(formData.name, formData.email, formData.password);
//       toast.success("Account created! Welcome to eBookAI 🎉");
//       navigate("/dashboard");
//     } catch (error) {
//       const msg = error?.response?.data?.message || "Registration failed. Please try again.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const passwordStrength = () => {
//     const pwd = formData.password;
//     if (!pwd) return { level: 0, label: "", color: "" };
//     let score = 0;
//     if (pwd.length >= 8) score++;
//     if (/[A-Z]/.test(pwd)) score++;
//     if (/[a-z]/.test(pwd)) score++;
//     if (/\d/.test(pwd)) score++;
//     if (/[^A-Za-z0-9]/.test(pwd)) score++;
//     if (score <= 2) return { level: score, label: "Weak", color: "bg-red-500" };
//     if (score <= 3) return { level: score, label: "Fair", color: "bg-yellow-500" };
//     return { level: score, label: "Strong", color: "bg-green-500" };
//   };

//   const strength = passwordStrength();

//   return (
//     <div className="min-h-screen bg-[#0f0f1a] flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
//         <div className="absolute inset-0">
//           <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
//         </div>
//         <div className="relative z-10 p-12 max-w-md">
//           <div className="flex items-center gap-2 mb-8">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
//               <span className="text-white font-bold">E</span>
//             </div>
//             <span className="text-white font-bold text-2xl">eBook<span className="text-orange-400">AI</span></span>
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
//             Join 12,000+ Authors Writing with AI
//           </h2>
//           <p className="text-gray-400 leading-relaxed mb-8">
//             Start creating professional ebooks today. No credit card required. 
//             Generate your first ebook in under an hour.
//           </p>
//           {/* Mini steps */}
//           <div className="space-y-4">
//             {[
//               { step: "1", title: "Create your account", desc: "Sign up in 30 seconds" },
//               { step: "2", title: "Start your ebook", desc: "Give your ebook a topic" },
//               { step: "3", title: "Generate with AI", desc: "AI writes chapters for you" },
//               { step: "4", title: "Export & publish", desc: "Download as PDF or Word" },
//             ].map((item) => (
//               <div key={item.step} className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
//                   {item.step}
//                 </div>
//                 <div>
//                   <div className="text-white text-sm font-medium">{item.title}</div>
//                   <div className="text-gray-500 text-xs">{item.desc}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right form */}
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
//             <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
//             <p className="text-gray-400">Start for free, no credit card needed</p>
//           </div>

//           <form id="signup-form" onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
//               <input
//                 id="signup-name"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="John Doe"
//                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all text-sm"
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
//               <input
//                 id="signup-email"
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
//               <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//               <div className="relative">
//                 <input
//                   id="signup-password"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Min 8 chars, upper, lower, number"
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

//               {/* Password strength indicator */}
//               {formData.password && (
//                 <div className="mt-2">
//                   <div className="flex gap-1">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <div
//                         key={i}
//                         className={`h-1 flex-1 rounded-full transition-all ${
//                           i <= strength.level ? strength.color : "bg-white/10"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className={`text-xs mt-1 ${
//                     strength.label === "Strong" ? "text-green-400" :
//                     strength.label === "Fair" ? "text-yellow-400" : "text-red-400"
//                   }`}>
//                     {strength.label} password
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               id="signup-submit-btn"
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Creating account...
//                 </>
//               ) : (
//                 "Create Free Account"
//               )}
//             </button>
//           </form>

//           <p className="text-center mt-6 text-gray-400 text-sm">
//             Already have an account?{" "}
//             <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
//               Sign in →
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Loader2,
  Check,
} from "lucide-react";

const steps = [
  { title: "Create your account", desc: "Sign up in 30 seconds" },
  { title: "Start your ebook", desc: "Give your ebook a topic" },
  { title: "Generate with AI", desc: "AI writes chapters for you" },
  { title: "Export & publish", desc: "Download as PDF or Word" },
];

function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      triggerShake();
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be 8+ chars with uppercase, lowercase & number");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created! Welcome to eBookAI 🎉");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { level: 0, label: "", barColor: "", textColor: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2)
      return { level: score, label: "Weak", barColor: "bg-red-500", textColor: "text-red-500" };
    if (score <= 3)
      return { level: score, label: "Fair", barColor: "bg-amber-500", textColor: "text-amber-500" };
    return { level: score, label: "Strong", barColor: "bg-emerald-500", textColor: "text-emerald-500" };
  };

  const strength = passwordStrength();

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

        {/* Center message + steps */}
        <div className="relative z-10 space-y-8 max-w-md animate-fade-in-up">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Join 12,000+ authors
              <br />
              writing with{" "}
              <span className="text-violet-200">AI.</span>
            </h2>
            <p className="text-violet-100/80 text-base leading-relaxed">
              No credit card required. Generate your first ebook in under an
              hour.
            </p>
          </div>

          {/* Mini steps */}
          <ol className="space-y-4">
            {steps.map((item, index) => (
              <li key={item.title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-violet-200/70 text-xs">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
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
              Create your account
            </h1>
            <p className="text-gray-500">Start for free, no credit card needed.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
            {/* Name field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focusedField === "name"
                    ? "border-violet-500 ring-4 ring-violet-500/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User
                  className={`size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    focusedField === "name" ? "text-violet-600" : "text-gray-400"
                  }`}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Min 8 chars, upper, lower, number"
                  className="w-full bg-transparent rounded-xl pl-11 pr-11 py-3 text-gray-900 placeholder:text-gray-400 outline-none text-sm"
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

              {/* Password strength indicator */}
              {formData.password && (
                <div className="pt-1 animate-fade-in-up">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.level ? strength.barColor : "bg-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1.5 font-medium ${strength.textColor}`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl px-6 py-3.5 shadow-lg shadow-violet-500/30 inline-flex items-center justify-center gap-x-2 transition-all duration-200 hover:shadow-violet-500/50 hover:scale-101 focus-visible:shadow-violet-500/50 active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create free account</span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center text-sm text-gray-500 animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;