import React, { useState } from "react";
import {
  Users,
  Stethoscope,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Activity,
  Layers,
  FileText,
  Clock,
  Printer,
  Bell,
} from "lucide-react";
import { InteractiveHoverButton } from "./InteractiveHoverButton";
import { UserRole } from "../../types";

interface LandingFeaturesProps {
  onOpenAuth: (mode: "login" | "register", prefilledRole?: UserRole) => void;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({ onOpenAuth }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Modules" },
    { id: "clinical", label: "Clinical & EMR" },
    { id: "operations", label: "Wards & Pharmacy" },
    { id: "diagnostics", label: "Labs & Billing" },
    { id: "intelligence", label: "AI & Security" },
  ];

  const features = [
    {
      id: "emr",
      category: "clinical",
      title: "Electronic Medical Records (EMR)",
      role: "doctor" as UserRole,
      badge: "Clinical Core",
      badgeColor: "bg-blue-100 text-blue-800",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      description:
        "Comprehensive longitudinal patient charts featuring automatic MRN indexing, dynamic vital signs telemetry, allergy tracking, chronic condition tags, and emergency contact registries.",
      capabilities: [
        "Unique MRN (e.g. MN-2026-104) tracking",
        "BP, Pulse, SpO2 & Temp vital telemetry",
        "Allergy alerts and chronic medical histories",
        "Printable patient health summaries",
      ],
    },
    {
      id: "opd",
      category: "clinical",
      title: "Doctor Consultations & OPD Queues",
      role: "doctor" as UserRole,
      badge: "Outpatient",
      badgeColor: "bg-indigo-100 text-indigo-800",
      icon: <Stethoscope className="w-6 h-6 text-indigo-600" />,
      description:
        "Streamlined appointment scheduling and live OPD waitlist management. Attending physicians write structured electronic prescriptions with medicine frequencies, durations, and clinical notes.",
      capabilities: [
        "Real-time appointment triage & queue status",
        "Closed-loop digital e-prescriptions",
        "Specialist physician directory & consulting fees",
        "Printable clinical prescription slips",
      ],
    },
    {
      id: "beds",
      category: "operations",
      title: "Real-Time Ward & Bed Matrix",
      role: "receptionist" as UserRole,
      badge: "Inpatient Wards",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: <BedDouble className="w-6 h-6 text-emerald-600" />,
      description:
        "Interactive graphical floor layout of ICU, General, Maternity, and Pediatric beds. Instant visibility into Available, Occupied, Cleaning, and Maintenance states with 1-click bed transfers.",
      capabilities: [
        "Color-coded live bed occupancy grid",
        "1-Click admission, discharge & sanitization",
        "Daily ward tariffs automatically billed",
        "Instant bed transfer between hospital wings",
      ],
    },
    {
      id: "pharmacy",
      category: "operations",
      title: "Smart Pharmacy & Formulary",
      role: "pharmacist" as UserRole,
      badge: "Drug Dispensary",
      badgeColor: "bg-amber-100 text-amber-800",
      icon: <Pill className="w-6 h-6 text-amber-600" />,
      description:
        "Digital medication formulary with live batch stock tracking, automatic low-stock alarms, unit price management, and 1-click dispensing tied directly to doctor prescriptions.",
      capabilities: [
        "Automated reorder warnings on low stock",
        "Closed-loop prescription dispensing",
        "1-Click rapid stock restock (+50 units)",
        "Dosage and formulary category indexing",
      ],
    },
    {
      id: "lab",
      category: "diagnostics",
      title: "Diagnostic Pathology Engine",
      role: "lab_tech" as UserRole,
      badge: "NABL Diagnostics",
      badgeColor: "bg-purple-100 text-purple-800",
      icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
      description:
        "Integrated clinical laboratory workflow covering CBC, Lipid, Metabolic, and Renal test panels. Automatic detection of abnormal high/low values against standardized medical reference ranges.",
      capabilities: [
        "NABL-aligned standardized test panels",
        "Automated abnormal high/low flags",
        "Pathologist verification & remarks",
        "Official printable diagnostic report sheets",
      ],
    },
    {
      id: "billing",
      category: "diagnostics",
      title: "Automated Invoicing & Revenue Cycle",
      role: "admin" as UserRole,
      badge: "Finance & Tax",
      badgeColor: "bg-rose-100 text-rose-800",
      icon: <Receipt className="w-6 h-6 text-rose-600" />,
      description:
        "Automated financial reconciliation consolidating doctor fees, ward tariffs, pharmacy medications, and lab diagnostics into itemized GST-compliant invoices with insurance claim tracking.",
      capabilities: [
        "Itemized automatic tariff calculation",
        "GST tax calculation and discounts",
        "Cash, UPI, Card, & Insurance TPA support",
        "Official printable tax invoices with QR & stamp",
      ],
    },
    {
      id: "ai",
      category: "intelligence",
      title: "Server-Side AI Clinical Copilot",
      role: "doctor" as UserRole,
      badge: "Gemini 3.7 AI",
      badgeColor: "bg-purple-100 text-purple-900 border border-purple-300",
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      description:
        "Clinical decision support powered by Google Gemini. Provides real-time symptom differential suggestions, abnormal vital risk assessments, and drug interaction safety alerts.",
      capabilities: [
        "Server-side API proxy (zero key leaks)",
        "Symptom triage & differential possibilities",
        "Clinical vital sign risk analysis",
        "Patient-friendly discharge explanation generator",
      ],
    },
    {
      id: "security",
      category: "intelligence",
      title: "Multi-Role Security & Audit Control",
      role: "admin" as UserRole,
      badge: "RBAC & Security",
      badgeColor: "bg-slate-100 text-slate-800",
      icon: <ShieldCheck className="w-6 h-6 text-slate-700" />,
      description:
        "Strict Role-Based Access Control (RBAC) ensuring staff only access authorized data. Includes department rosters, shift scheduling, real-time hospital alerts, and audit histories.",
      capabilities: [
        "6 specialized departmental role portals",
        "Staff shift scheduling & status controls",
        "Real-time system notification alerts",
        "Persistent localStorage & database syncing",
      ],
    },
  ];

  const filteredFeatures =
    activeCategory === "all"
      ? features
      : features.filter((f) => f.category === activeCategory);

  return (
    <section id="features" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Comprehensive Hospital Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Modern Clinical Workflow Precision
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Every module in MediNexus is crafted to eliminate administrative friction and provide clinical
            staff with instantaneous, reliable medical intelligence.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${feat.badgeColor}`}
                  >
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  {feat.description}
                </p>

                <div className="space-y-2 mb-6">
                  {feat.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenAuth("login", feat.role)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer group/btn"
                >
                  <span>Test this Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <span className="text-[11px] text-slate-400 capitalize">
                  Role: {feat.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick CTA Banner Inside Features */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to Experience the Entire Hospital Network?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Register your account in seconds or sign in with 1-click demo profiles to test any of the 6 specialized hospital portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <InteractiveHoverButton
              variant="glass"
              size="md"
              onClick={() => onOpenAuth("register")}
            >
              Create Account
            </InteractiveHoverButton>

            <InteractiveHoverButton
              variant="secondary"
              size="md"
              onClick={() => onOpenAuth("login", "admin")}
            >
              Sign In as Admin
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </section>
  );
};
