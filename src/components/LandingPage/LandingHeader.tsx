import React, { useState, useEffect } from "react";
import {
  Activity,
  LogIn,
  UserPlus,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { InteractiveHoverButton } from "./InteractiveHoverButton";
import { useHospital } from "../../context/HospitalContext";

interface LandingHeaderProps {
  onOpenAuth: (mode: "login" | "register") => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onOpenAuth,
}) => {
  const { isAuthenticated, authUser, logout, setActiveView } = useHospital();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Introduction", href: "#introduction" },
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Hospital Portals", href: "#portals" },
    { label: "Architecture", href: "#architecture" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
          : "bg-white/80 backdrop-blur-xs border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  MediNexus
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
                  v2.5 HMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart Digital Hospital Management Platform
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Elements: Quick Emergency, Academic Report, Login & Register */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Live Uptime Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>System Online</span>
            </div>


            {isAuthenticated && authUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveView("dashboard");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Dashboard ({authUser.name.split(" ")[0]})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                {/* Login Button with cursor hover animation */}
                <InteractiveHoverButton
                  id="btn-header-login"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenAuth("login")}
                  icon={<LogIn className="w-3.5 h-3.5 text-blue-600" />}
                >
                  Login
                </InteractiveHoverButton>

                {/* Register Button with cursor hover animation */}
                <InteractiveHoverButton
                  id="btn-header-register"
                  variant="gradient"
                  size="sm"
                  onClick={() => onOpenAuth("register")}
                  icon={<UserPlus className="w-3.5 h-3.5 text-white" />}
                >
                  Register
                </InteractiveHoverButton>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenAuth("login")}
              className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg border border-blue-200"
            >
              Login
            </button>
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-200 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-1 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 rounded-lg"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">

              <div className="grid grid-cols-2 gap-2 pt-1">
                <InteractiveHoverButton
                  id="btn-mobile-login"
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("login");
                  }}
                  icon={<LogIn className="w-4 h-4" />}
                >
                  Login
                </InteractiveHoverButton>

                <InteractiveHoverButton
                  id="btn-mobile-register"
                  variant="gradient"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("register");
                  }}
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  Register
                </InteractiveHoverButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
