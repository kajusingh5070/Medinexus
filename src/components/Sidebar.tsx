import React from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  BedDouble,
  Receipt,
  UserCog,
  Sparkles,
  ChevronRight,
  HeartPulse,
  Shield,
  Building2,
  User,
  Check,
  LogOut,
  Globe,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { UserRole } from "../types";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  allowedRoles: UserRole[];
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    patients,
    appointments,
    pharmacyItems,
    labOrders,
    beds,
    invoices,
    currentRole,
    setCurrentRole,
    authUser,
    logout,
    setShowLandingPage,
  } = useHospital();

  const pendingAppointments = appointments.filter(
    (a) => a.status === "Scheduled" || a.status === "In-Progress"
  ).length;

  const lowStockCount = pharmacyItems.filter(
    (m) => m.stockQuantity <= m.minStockLevel
  ).length;

  const pendingLabTests = labOrders.filter(
    (l) => l.status !== "Completed" && l.status !== "Delivered"
  ).length;

  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const totalBeds = beds.length;

  const unpaidInvoices = invoices.filter(
    (i) => i.paymentStatus === "Pending" || i.paymentStatus === "Partially Paid"
  ).length;

  const allNavItems: NavItem[] = [
    {
      id: "dashboard",
      label: currentRole === "patient" ? "My Health Hub" : "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ["admin", "doctor", "receptionist", "pharmacist", "lab_tech", "patient"],
    },
    {
      id: "patients",
      label: currentRole === "patient" ? "My Medical Profile" : "Patient Records",
      icon: <Users className="w-4 h-4" />,
      badge: currentRole === "patient" ? undefined : patients.length,
      badgeColor: "bg-slate-800 text-slate-300",
      allowedRoles: ["admin", "doctor", "receptionist", "lab_tech", "patient"],
    },
    {
      id: "doctors",
      label: "Doctor Directory",
      icon: <Stethoscope className="w-4 h-4" />,
      allowedRoles: ["admin", "receptionist"],
    },
    {
      id: "appointments",
      label: currentRole === "patient" ? "My Appointments" : "Appointments",
      icon: <Calendar className="w-4 h-4" />,
      badge: pendingAppointments > 0 ? pendingAppointments : undefined,
      badgeColor: "bg-blue-900/80 text-blue-300 font-semibold",
      allowedRoles: ["admin", "doctor", "receptionist", "patient"],
    },
    {
      id: "prescriptions",
      label: currentRole === "patient" ? "My Prescriptions" : "EHR & Prescriptions",
      icon: <FileText className="w-4 h-4" />,
      allowedRoles: ["admin", "doctor", "pharmacist", "patient"],
    },
    {
      id: "pharmacy",
      label: "Pharmacy & Stock",
      icon: <Pill className="w-4 h-4" />,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: "bg-amber-900/80 text-amber-300 font-medium",
      allowedRoles: ["admin", "pharmacist"],
    },
    {
      id: "laboratory",
      label: currentRole === "patient" ? "My Diagnostic Tests" : "Lab & Diagnostics",
      icon: <FlaskConical className="w-4 h-4" />,
      badge: pendingLabTests > 0 ? pendingLabTests : undefined,
      badgeColor: "bg-indigo-900/80 text-indigo-300",
      allowedRoles: ["admin", "doctor", "lab_tech", "patient"],
    },
    {
      id: "beds",
      label: "Bed & Ward Matrix",
      icon: <BedDouble className="w-4 h-4" />,
      badge: `${occupiedBeds}/${totalBeds}`,
      badgeColor:
        occupiedBeds / totalBeds > 0.7
          ? "bg-rose-900/80 text-rose-300"
          : "bg-emerald-900/80 text-emerald-300",
      allowedRoles: ["admin", "doctor", "receptionist"],
    },
    {
      id: "billing",
      label: currentRole === "patient" ? "My Bills & Invoices" : "Billing & Invoicing",
      icon: <Receipt className="w-4 h-4" />,
      badge: unpaidInvoices > 0 ? `${unpaidInvoices} Due` : undefined,
      badgeColor: "bg-amber-900/80 text-amber-300",
      allowedRoles: ["admin", "receptionist", "pharmacist", "patient"],
    },
    {
      id: "staff",
      label: "Staff & Duty Roster",
      icon: <UserCog className="w-4 h-4" />,
      allowedRoles: ["admin"],
    },
    {
      id: "ai_assistant",
      label: "AI Clinical Triage",
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      badge: "Gemini 3.7",
      badgeColor: "bg-indigo-900/70 text-indigo-300 border border-indigo-700/50",
      allowedRoles: ["admin", "doctor"],
    },
  ];

  // Filter modules visible to current role
  const visibleNavItems = allNavItems.filter((item) =>
    item.allowedRoles.includes(currentRole)
  );

  const roleRoles: { id: UserRole; name: string; icon: React.ReactNode; color: string }[] = [
    { id: "admin", name: "Super Admin", icon: <Shield className="w-3.5 h-3.5" />, color: "text-purple-400" },
    { id: "doctor", name: "Doctor", icon: <Stethoscope className="w-3.5 h-3.5" />, color: "text-blue-400" },
    { id: "receptionist", name: "Front Desk", icon: <Building2 className="w-3.5 h-3.5" />, color: "text-emerald-400" },
    { id: "pharmacist", name: "Pharmacist", icon: <Pill className="w-3.5 h-3.5" />, color: "text-amber-400" },
    { id: "lab_tech", name: "Lab Tech", icon: <FlaskConical className="w-3.5 h-3.5" />, color: "text-indigo-400" },
    { id: "patient", name: "Patient", icon: <User className="w-3.5 h-3.5" />, color: "text-rose-400" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-[calc(100vh-61px)]">
      {/* Role Switcher & Portal Selector */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-800/90 border border-slate-700/70">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Portal
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-slate-700 text-slate-300">
            RBAC Enabled
          </span>
        </div>

        {/* Quick Role Grid */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {roleRoles.map((r) => {
            const isCurrent = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setCurrentRole(r.id);
                  // Ensure active view is permitted for new role
                  const allowed = allNavItems.filter((i) => i.allowedRoles.includes(r.id));
                  if (!allowed.some((i) => i.id === activeView)) {
                    setActiveView(allowed[0]?.id || "dashboard");
                  }
                }}
                className={`p-1.5 rounded-lg text-[11px] font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                  isCurrent
                    ? "bg-blue-600/30 border-blue-500 text-white font-bold shadow-2xs"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
                }`}
                title={`Switch to ${r.name} Portal`}
              >
                <span className={isCurrent ? "text-blue-400" : r.color}>{r.icon}</span>
                <span className="truncate w-full text-center">{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>{currentRole.replace("_", " ")} Modules</span>
          <span className="text-slate-600 font-mono text-[9px]">{visibleNavItems.length} active</span>
        </div>

        {visibleNavItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : item.badgeColor || "bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Status & Sign Out */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setShowLandingPage(true)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
            title="Return to Public Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Home</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-[11px] font-semibold"
            title="Log out of hospital portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

