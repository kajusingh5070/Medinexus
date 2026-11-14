import React, { useState } from "react";
import {
  FileText,
  Stethoscope,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Activity,
  Zap,
  Clock,
  HeartHandshake,
} from "lucide-react";

export const LandingIntro: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const patientJourneySteps = [
    {
      step: "01",
      title: "Patient Arrival & Instant MRN",
      department: "Front Desk & Admissions",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      description:
        "Patients are registered in under 60 seconds with a unique Medical Record Number (MRN). Emergency cases receive instant priority flags, baseline vitals intake, and direct ward routing.",
      highlight: "Eliminates physical paperwork and duplicates across lifetime hospital visits.",
    },
    {
      step: "02",
      title: "Physician Consult & Vital Telemetry",
      department: "OPD Consultation Wing",
      icon: <Stethoscope className="w-5 h-5 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      description:
        "Attending physicians review longitudinal vital charts (BP, Pulse, SpO2, Temperature), record ICD-10 diagnostic findings, and generate digital prescriptions linked directly to the pharmacy.",
      highlight: "Zero prescription handwriting errors, instant allergy interaction checks.",
    },
    {
      step: "03",
      title: "Dynamic Bed & Ward Allocation",
      department: "Inpatient Wards & ICU",
      icon: <BedDouble className="w-5 h-5 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      description:
        "Real-time visual floor grid of ICU, General, Maternity, and Pediatric beds. Staff instantly allocate available beds, manage bed transfers, track daily room tariffs, and trigger post-discharge sanitization.",
      highlight: "Optimizes hospital bed turnover and prevents emergency patient diversions.",
    },
    {
      step: "04",
      title: "Smart Formulary & Drug Dispensing",
      department: "Central Hospital Pharmacy",
      icon: <Pill className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50 border-amber-200 text-amber-800",
      description:
        "The pharmacy receives e-prescriptions instantly. Pharmacists verify batch numbers, dispense required dosages, and system inventory automatically deducts stock while sounding reorder alarms for critical drugs.",
      highlight: "Automated stock reconciliation prevents life-saving drug shortages.",
    },
    {
      step: "05",
      title: "NABL-Standard Pathology Diagnostics",
      department: "Clinical Diagnostic Laboratory",
      icon: <FlaskConical className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      description:
        "Blood, metabolic, and radiology orders appear in the lab dashboard. Technicians record verified values; the system automatically detects abnormal high/low parameters against medical reference ranges.",
      highlight: "Instant digital lab report generation with official printable medical formatting.",
    },
    {
      step: "06",
      title: "Consolidated Billing & Discharge",
      department: "Revenue Cycle & Cashier",
      icon: <Receipt className="w-5 h-5 text-rose-600" />,
      color: "bg-rose-50 border-rose-200 text-rose-800",
      description:
        "Consultation fees, bed duration tariffs, lab orders, and pharmacy drugs are automatically consolidated into an itemized, GST-compliant invoice ready for Cash, Card, UPI, or TPA Insurance claims.",
      highlight: "Transparent billing with zero surprise charges and automated printable receipts.",
    },
  ];

  return (
    <section id="introduction" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Introduction to MediNexus
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How the Web Application Revolutionizes Healthcare Operations
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            In conventional healthcare centers, patient records, bed states, and drug stocks live in disconnected
            silos. MediNexus establishes a single source of truth across all hospital departments.
          </p>
        </div>

        {/* Why MediNexus Matters: Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* The Traditional Bottleneck */}
          <div className="p-6 sm:p-8 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700 font-bold text-lg">
              <ShieldAlert className="w-6 h-6" />
              <h3>The Challenge of Legacy Hospital Systems</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Traditional hospitals struggle with lost paper folders, illegible doctor handwriting, slow bed turnovers,
              unreported medication stockouts, and manual billing disputes. Patients wait hours between consultation,
              testing, and medication collection.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Fragmented patient medical histories scattered across paper files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Uncoordinated bed allocations causing emergency room gridlocks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Medication dosage errors due to unvalidated physical prescription slips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Delayed pathology lab deliveries and manual calculations on billing invoices</span>
              </li>
            </ul>
          </div>

          {/* The MediNexus Solution */}
          <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-700 font-bold text-lg">
              <Zap className="w-6 h-6" />
              <h3>The MediNexus Digital Paradigm</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              MediNexus links the front desk, doctor consultation room, inpatient wards, central pharmacy, pathology
              lab, and billing office into one high-speed reactive network with role-based security and clinical decision support.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant MRN generation and lifetime digital Electronic Medical Records (EMR)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Real-time color-coded bed telemetry across ICU, Maternity, General & Pediatric wards</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Closed-loop digital e-prescriptions with automatic formulary stock deduction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>NABL pathology reference validation and automated GST-compliant invoice generation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Patient Care Journey Stepper */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Interactive Architectural Workflow
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Follow a Patient Through the MediNexus Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any step to see how information flows seamlessly between departments.
            </p>
          </div>

          {/* Step Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {patientJourneySteps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeStep === idx
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{s.step}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Showcase Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
                  Stage {patientJourneySteps[activeStep].step}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {patientJourneySteps[activeStep].department}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                {patientJourneySteps[activeStep].title}
              </h4>

              <p className="text-sm text-slate-600 leading-relaxed">
                {patientJourneySteps[activeStep].description}
              </p>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{patientJourneySteps[activeStep].highlight}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                {patientJourneySteps[activeStep].icon}
              </div>
              <div className="text-xs font-bold text-slate-800">
                Connected Hospital Node
              </div>
              <p className="text-[11px] text-slate-500">
                Synchronized with Central Database & Real-Time Role Views
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={activeStep === patientJourneySteps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(patientJourneySteps.length - 1, prev + 1))}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
