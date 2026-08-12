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

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);

    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      if (profileMenuOpen) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [profileMenuOpen]);

  const handleSignout = () => {
    logout(() => navigate("/", { replace: true }));
  };

  const desktopLink = (hash) =>
    `font-medium transition ${
      activeHash === hash
        ? "text-violet-600"
        : "text-gray-600 hover:text-violet-600"
    }`;

  const mobileLink = (hash) =>
    `block rounded-lg px-4 py-2.5 transition ${
      activeHash === hash
        ? "bg-violet-50 text-violet-600"
        : "text-gray-700 hover:bg-violet-50 hover:text-violet-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <LogoIcon size={20} className="text-white" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            <span className="text-gray-900">eBook</span>
            <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
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
                className="font-medium text-gray-700 hover:text-violet-600 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-4 gap-2">
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

            <hr className="my-2" />

            {isAuthenticated ? (
              <>
                <div className="px-2 py-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={handleSignout}
                  className="flex items-center justify-center gap-2 text-red-600 py-2 rounded-lg hover:bg-red-50"
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
                  className="text-center py-2 rounded-lg hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white"
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