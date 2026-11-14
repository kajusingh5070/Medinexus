import React from "react";
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  Building2,
  Pill,
  FlaskConical,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartPulse,
  BedDouble,
  Receipt,
  Users,
  Play,
  FileCode,
} from "lucide-react";
import { InteractiveHoverButton } from "./InteractiveHoverButton";
import { UserRole } from "../../types";

interface LandingHomeProps {
  onOpenAuth: (mode: "login" | "register", prefilledRole?: UserRole) => void;
  onExploreFeatures: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  onOpenAuth,
  onExploreFeatures,
}) => {
  const rolePortals: {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    borderColor: string;
  }[] = [
    {
      role: "admin",
      title: "Super Admin Portal",
      description: "Full hospital control, clinical analytics, staff rosters, bed telemetry & audit trails.",
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      color: "text-purple-700",
      bg: "bg-purple-50 hover:bg-purple-100/80",
      borderColor: "border-purple-200",
    },
    {
      role: "doctor",
      title: "Doctor Consultation Desk",
      description: "OPD queues, digital prescriptions, ICD diagnoses, longitudinal vitals & lab review.",
      icon: <Stethoscope className="w-5 h-5 text-blue-600" />,
      color: "text-blue-700",
      bg: "bg-blue-50 hover:bg-blue-100/80",
      borderColor: "border-blue-200",
    },
    {
      role: "receptionist",
      title: "Admissions & Bed Matrix",
      description: "Fast patient registration, MRN issuance, ICU/Ward bed allocation & appointments.",
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      color: "text-emerald-700",
      bg: "bg-emerald-50 hover:bg-emerald-100/80",
      borderColor: "border-emerald-200",
    },
    {
      role: "pharmacist",
      title: "Pharmacy & Formulary",
      description: "Drug inventory, stock batch tracking, automated low-stock alerts & digital dispensing.",
      icon: <Pill className="w-5 h-5 text-amber-600" />,
      color: "text-amber-700",
      bg: "bg-amber-50 hover:bg-amber-100/80",
      borderColor: "border-amber-200",
    },
    {
      role: "lab_tech",
      title: "Pathology Diagnostics",
      description: "NABL-aligned test orders, abnormal parameter flags, verified reports & printable sheets.",
      icon: <FlaskConical className="w-5 h-5 text-indigo-600" />,
      color: "text-indigo-700",
      bg: "bg-indigo-50 hover:bg-indigo-100/80",
      borderColor: "border-indigo-200",
    },
    {
      role: "patient",
      title: "Patient Self-Service",
      description: "Personal health records, active prescriptions, lab reports, doctor visits & billing invoices.",
      icon: <User className="w-5 h-5 text-rose-600" />,
      color: "text-rose-700",
      bg: "bg-rose-50 hover:bg-rose-100/80",
      borderColor: "border-rose-200",
    },
  ];

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background Subtle Ambient Highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-100/40 via-indigo-100/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges & Academic Black Book Link */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Next-Gen Hospital Information System (HIS)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Powered by Clinical AI Copilot
          </span>
        </div>

        {/* Main Hero Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Unified Hospital Management & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Clinical Intelligence
            </span>{" "}
            Platform
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            MediNexus orchestrates every clinical workflow in real time—from instant outpatient registration,
            doctor scheduling, and live bed occupancy to automated pharmacy dispensing, pathology diagnostics,
            and GST-compliant patient billing.
          </p>
        </div>

        {/* Interactive Action Buttons with Cursor-Tracking Hover Animation */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-6 pb-12">
          {/* Primary CTA: Register Button */}
          <InteractiveHoverButton
            id="btn-hero-register"
            variant="gradient"
            size="lg"
            onClick={() => onOpenAuth("register")}
            icon={<User className="w-5 h-5 text-white" />}
          >
            Register Hospital Account
          </InteractiveHoverButton>

          {/* Secondary CTA: Login Button */}
          <InteractiveHoverButton
            id="btn-hero-login"
            variant="secondary"
            size="lg"
            onClick={() => onOpenAuth("login")}
            icon={<ArrowRight className="w-5 h-5 text-blue-400" />}
          >
            Sign In to Portal
          </InteractiveHoverButton>

          {/* Tertiary CTA: Quick Demo Admin */}
          <InteractiveHoverButton
            id="btn-hero-demo-admin"
            variant="outline"
            size="lg"
            onClick={() => onOpenAuth("login", "admin")}
            icon={<Play className="w-4 h-4 text-purple-600 fill-purple-600" />}
          >
            1-Click Super Admin Demo
          </InteractiveHoverButton>
        </div>

        {/* Real-Time Hospital Key Performance Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-16">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Portals
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">6 Roles</div>
            <p className="text-[11px] text-slate-500 mt-1">Admin, Doctor, Nurse, Pharmacy, Lab, Patient</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bed Allocation
              </span>
              <BedDouble className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">99.8%</div>
            <p className="text-[11px] text-slate-500 mt-1">Real-time ICU, Ward & Maternity telemetry</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Formulary Items
              </span>
              <Pill className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">100% Digital</div>
            <p className="text-[11px] text-slate-500 mt-1">Batch stock alerts & instant drug dispensing</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Clinical Diagnostics
              </span>
              <FlaskConical className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">NABL Ready</div>
            <p className="text-[11px] text-slate-500 mt-1">Automated abnormal reference range flagging</p>
          </div>
        </div>

        {/* Interactive Hospital Role Portals Selection Bar */}
        <div id="portals" className="pt-4 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Role-Based Access Control (RBAC)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Specialized Portals for Every Hospital Department
            </h2>
            <p className="text-sm text-slate-600">
              Click any department below to instantly test and preview the dedicated workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {rolePortals.map((item) => (
              <div
                key={item.role}
                onClick={() => onOpenAuth("login", item.role)}
                className={`p-5 rounded-2xl border ${item.borderColor} ${item.bg} transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-700">
                      1-Click Demo
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className={item.color}>Sign In as {item.role}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
