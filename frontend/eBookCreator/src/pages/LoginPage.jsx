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
      await login(formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid email or password");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Center message */}
        <div className="relative z-10 space-y-6 max-w-md animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
            Your next book
            <br />
            starts with a
            <br />
            <span className="text-[#F0876B]">single sentence.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Pick up right where you left off. Your drafts, outlines, and
            research are exactly as you left them.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["✨ AI Outline", "📝 Chapter Writing", "📤 PDF Export", "🔄 Live Preview"].map((feat) => (
              <span
                key={feat}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-white/80 text-xs font-medium"
              >
                {feat}
              </span>
            ))}
          </div>
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
              Welcome back
            </h1>
            <p className="text-[#8A9BA4]">
              Log in to continue where you left off.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in-up">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[#26333B]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#2C5F7C] hover:text-[#F0876B] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className={fieldClass("password")}>
                <Lock className={iconClass("password")} />
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
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white font-semibold rounded-xl px-6 py-3.5 shadow-lg shadow-[#F0876B]/30 inline-flex items-center justify-center gap-x-2 transition-all duration-200 hover:shadow-[#F0876B]/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 group"
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

          <p
            className="text-center text-sm text-[#8A9BA4] animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#2C5F7C] hover:text-[#F0876B] transition-colors"
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