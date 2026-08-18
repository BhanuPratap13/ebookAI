import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import LogoIcon from "../../LogoIcon";
import ProfileMenu from "../layout/ProfileMenu";

const navLinks = [
  { label: "Features", hash: "#features" },
  { label: "Testimonials", hash: "#testimonials" },
];

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeHash, setActiveHash] = useState(window.location.hash);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      if (profileMenuOpen) setProfileMenuOpen(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [profileMenuOpen]);

  const handleSignout = () => {
    logout(() => navigate("/", { replace: true }));
  };

  const desktopLink = (hash) =>
    `font-medium transition-colors duration-200 ${
      activeHash === hash
        ? "text-[#2C5F7C]"
        : "text-[#26333B]/70 hover:text-[#2C5F7C]"
    }`;

  const mobileLink = (hash) =>
    `block rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${
      activeHash === hash
        ? "bg-[#2C5F7C]/10 text-[#2C5F7C]"
        : "text-[#26333B]/70 hover:bg-[#F0876B]/10 hover:text-[#F0876B]"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-[#FAFAF8] transition-all duration-300 ${
        scrolled
          ? "shadow-md shadow-[#2C5F7C]/8 border-b border-[#E8E6E0]"
          : "border-b border-[#E8E6E0]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C5F7C] to-[#1a3d52] flex items-center justify-center shadow-lg shadow-[#2C5F7C]/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <LogoIcon size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#26333B]">eBook</span>
            <span className="text-[#F0876B]">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(({ label, hash }) => (
            <a key={label} href={hash} className={desktopLink(hash)}>
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <ProfileMenu
              isOpen={profileMenuOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileMenuOpen((prev) => !prev);
              }}
              avatarUrl={user?.avatar}
              username={user?.name}
              email={user?.email}
              signoutCallback={handleSignout}
            />
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-[#26333B]/70 hover:text-[#2C5F7C] transition-colors duration-200"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white font-semibold shadow-lg shadow-[#F0876B]/30 hover:shadow-[#F0876B]/50 hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-[#2C5F7C]/8 text-[#26333B] transition-colors"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E6E0] bg-[#FAFAF8]">
          <nav className="flex flex-col p-4 gap-1.5">
            {navLinks.map(({ label, hash }) => (
              <a
                key={label}
                href={hash}
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLink(hash)}
              >
                {label}
              </a>
            ))}

            <hr className="my-2 border-[#E8E6E0]" />

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="font-semibold text-[#26333B]">{user?.name}</p>
                  <p className="text-sm text-[#26333B]/50">{user?.email}</p>
                </div>

                <button
                  onClick={handleSignout}
                  className="flex items-center justify-center gap-2 text-red-500 py-2.5 rounded-xl hover:bg-red-50 font-medium transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl font-medium text-[#26333B]/70 hover:bg-[#2C5F7C]/8 hover:text-[#2C5F7C] transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white font-semibold shadow-md shadow-[#F0876B]/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;