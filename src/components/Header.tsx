import React, { useState, useEffect } from "react";
import {
  Activity,
  Bell,
  Search,
  UserCheck,
  FileText,
  RotateCcw,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  Shield,
  Stethoscope,
  Building2,
  Pill,
  FlaskConical,
  User,
  Sparkles,
  Globe,
  LogOut,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { UserRole } from "../types";

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    searchTerm,
    setSearchTerm,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetToSampleData,
    setActiveView,
    authUser,
    logout,
    setShowLandingPage,
  } = useHospital();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleConfig: Record<
    UserRole,
    { label: string; icon: React.ReactNode; color: string; desc: string }
  > = {
    admin: {
      label: "Super Admin",
      icon: <Shield className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-800 border-purple-300",
      desc: "Full hospital control & analytics",
    },
    doctor: {
      label: "Attending Doctor",
      icon: <Stethoscope className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-800 border-blue-300",
      desc: "OPD, Prescriptions & Vitals",
    },
    receptionist: {
      label: "Front Desk & Admissions",
      icon: <Building2 className="w-4 h-4" />,
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      desc: "Registration & Bed Allocation",
    },
    pharmacist: {
      label: "Pharmacy In-Charge",
      icon: <Pill className="w-4 h-4" />,
      color: "bg-amber-100 text-amber-800 border-amber-300",
      desc: "Inventory & Drug Dispensing",
    },
    lab_tech: {
      label: "Lab Pathologist",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "bg-indigo-100 text-indigo-800 border-indigo-300",
      desc: "Diagnostics & Test Results",
    },
    patient: {
      label: "Patient Portal",
      icon: <User className="w-4 h-4" />,
      color: "bg-rose-100 text-rose-800 border-rose-300",
      desc: "My Records, Bills & Visits",
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  MediNexus
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Smart Digital Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hospital Management & Clinical Intelligence System
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, MRN, doctors, medicines, tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Live System Time */}
          <div className="hidden xl:flex flex-col items-end pr-2 border-r border-slate-200 text-right">
            <span className="text-xs font-semibold text-slate-800">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="text-[11px] text-slate-500">
              {currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          {/* AI Clinical Copilot Quick Trigger */}
          <button
            id="btn-ai-quick-trigger"
            onClick={() => setActiveView("ai_assistant")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-xs cursor-pointer"
            title="Open AI Symptom Triage & Clinical Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Triage</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-800">
                      Live Hospital Alerts
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-rose-100 text-rose-700 font-medium px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications available
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                          !n.read ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.type === "emergency" ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                          ) : n.type === "warning" ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : n.type === "success" ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              id="btn-role-switcher"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                roleConfig[currentRole].color
              }`}
            >
              {roleConfig[currentRole].icon}
              <span className="hidden sm:inline">
                {roleConfig[currentRole].label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Active Portal
                  </span>
                </div>
                {(
                  Object.keys(roleConfig) as UserRole[]
                ).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      currentRole === role ? "bg-blue-50/60 font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          currentRole === role
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {roleConfig[role].icon}
                      </div>
                      <div>
                        <div className="text-xs text-slate-900 font-medium">
                          {roleConfig[role].label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {roleConfig[role].desc}
                        </div>
                      </div>
                    </div>
                    {currentRole === role && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Return to Public Landing Page Button */}
          <button
            id="btn-header-landing"
            onClick={() => setShowLandingPage(true)}
            title="View Public Landing Page"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Home</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-demo"
            onClick={resetToSampleData}
            title="Reset data to initial state"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sign Out Button */}
          <button
            id="btn-header-signout"
            onClick={logout}
            title={`Sign Out (${authUser ? authUser.name : "Portal"})`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
