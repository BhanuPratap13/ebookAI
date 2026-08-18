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

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const msg = error?.response?.data?.message || "Registration failed. Please try again.";
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
    if (score <= 2) return { level: score, label: "Weak", barColor: "bg-red-500", textColor: "text-red-500" };
    if (score <= 3) return { level: score, label: "Fair", barColor: "bg-amber-500", textColor: "text-amber-500" };
    return { level: score, label: "Strong", barColor: "bg-emerald-500", textColor: "text-emerald-500" };
  };

  const strength = passwordStrength();

  const fieldClass = (field) =>
    `relative rounded-xl border-2 transition-all duration-200 bg-white ${
      focusedField === field
        ? "border-[#2C5F7C] ring-4 ring-[#2C5F7C]/10"
        : "border-[#E8E6E0] hover:border-[#2C5F7C]/40"
    }`;

  const iconClass = (field) =>
    `size-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
      focusedField === field ? "text-[#2C5F7C]" : "text-[#8A9BA4]"
    }`;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAF8] overflow-hidden">
      {/* ── Left panel — branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between relative bg-gradient-to-br from-[#2C5F7C] via-[#1e4a63] to-[#122f40] p-12 overflow-hidden">
        {/* Ambient blobs */}
        <div className="size-80 bg-white/8 rounded-full absolute -left-20 -top-20 blur-3xl animate-pulse" />
        <div className="size-96 bg-[#F0876B]/15 rounded-full absolute -right-32 bottom-0 blur-3xl animate-pulse delay-700" />
        <div className="size-56 bg-white/5 rounded-full absolute right-10 top-1/3 blur-3xl animate-pulse delay-300" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-white">eBook</span>
            <span className="text-[#F0876B]">AI</span>
          </span>
        </Link>

        {/* Center message + steps */}
        <div className="relative z-10 space-y-8 max-w-md animate-fade-in-up">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Join 12,000+ authors
              <br />
              writing with{" "}
              <span className="text-[#F0876B]">AI.</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              No credit card required. Generate your first ebook in under an hour.
            </p>
          </div>

          {/* Mini steps */}
          <ol className="space-y-4">
            {steps.map((item, index) => (
              <li key={item.title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F0876B]/80 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-md">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-white/50 text-xs">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex items-center gap-8">
          <div>
            <p className="text-white text-2xl font-bold">50K+</p>
            <p className="text-white/60 text-sm">Books created</p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-white text-2xl font-bold">4.9/5</p>
            <p className="text-white/60 text-sm">User rating</p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 sm:p-10 relative">
        {/* Mobile blob */}
        <div className="lg:hidden size-64 bg-[#2C5F7C]/10 rounded-full absolute -top-10 -right-10 blur-3xl animate-pulse" />

        <div
          className={`w-full max-w-sm space-y-8 relative transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C5F7C] to-[#1a3d52] flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-[#26333B]">eBook</span>
              <span className="text-[#F0876B]">AI</span>
            </span>
          </Link>

          <div className="space-y-2 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-[#26333B] tracking-tight">
              Create your account
            </h1>
            <p className="text-[#8A9BA4]">Start for free, no credit card needed.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-[#26333B]">
                Full name
              </label>
              <div className={fieldClass("name")}>
                <User className={iconClass("name")} />
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
                  className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3 text-[#26333B] placeholder:text-[#8A9BA4] outline-none text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#26333B]">
                Email
              </label>
              <div className={fieldClass("email")}>
                <Mail className={iconClass("email")} />
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
                  className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3 text-[#26333B] placeholder:text-[#8A9BA4] outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#26333B]">
                Password
              </label>
              <div className={fieldClass("password")}>
                <Lock className={iconClass("password")} />
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
                  className="w-full bg-transparent rounded-xl pl-11 pr-11 py-3 text-[#26333B] placeholder:text-[#8A9BA4] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9BA4] hover:text-[#2C5F7C] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Password strength */}
              {formData.password && (
                <div className="pt-1 animate-fade-in-up">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.level ? strength.barColor : "bg-[#E8E6E0]"
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

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white font-semibold rounded-xl px-6 py-3.5 shadow-lg shadow-[#F0876B]/30 inline-flex items-center justify-center gap-x-2 transition-all duration-200 hover:shadow-[#F0876B]/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 group"
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
            className="text-center text-sm text-[#8A9BA4] animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#2C5F7C] hover:text-[#F0876B] transition-colors"
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