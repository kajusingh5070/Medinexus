import React from "react";
import {
  FileCode,
  Layers,
  Sparkles,
  Server,
  ShieldCheck,
  Activity,
  BedDouble,
  Pill,
  FlaskConical,
  Receipt,
  Users,
  CheckCircle2,
} from "lucide-react";

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600">
          <FileCode className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">
            System Documentation & Technical Blueprint
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          MediNexus: Comprehensive Smart Digital Hospital Information Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Full-stack digital hospital information system (HIS) engineered with modular clinical workflows, real-time bed and pharmacy inventory control, NABL-standard pathology diagnostics, GST-compliant invoicing, and server-side Gemini 3.7 clinical intelligence decision support.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Frontend Architecture</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Built with React 19, TypeScript, and Tailwind CSS. Features role-based views (Super Admin, Doctor, Nurse, Pharmacist, Lab Tech, Billing Clerk), responsive grid layouts, and printable clinical sheets.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Express & Node.js Backend</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Secure Node.js / Express proxy layer handling RESTful endpoints and securing third-party & AI credentials server-side without exposing API keys to browser clients.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Gemini 3.7 Clinical Engine</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Integrated with the official <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">@google/genai</code> SDK for triage risk stratification, AI discharge summaries, and polypharmacy interaction checks.
          </p>
        </div>
      </div>

      {/* Modules Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Core Hospital Workflows & Operational Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Users className="w-4 h-4 text-blue-600" />
              <span>1. Patient Registration & Electronic Health Records (EHR)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Maintains unique Medical Record Numbers (MRN), contact profiles, emergency contacts, chronic conditions, recorded allergy alerts, and longitudinal vital sign tracking logs.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>2. Doctors Directory & OPD Consultation Queue</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Specialist physician profiles with departmental allocation (Cardiology, Neurology, Pediatrics, Orthopedics), OPD consultation queues, on-duty toggles, and token dispatching.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <BedDouble className="w-4 h-4 text-cyan-600" />
              <span>3. Bed Allocation & Ward Matrix</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Visual bed map categorized by Intensive Care Unit (ICU), General Wards (Male/Female), Emergency Triage, and Deluxe Suites with real-time intake assignment, transfer, and discharge.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>4. Digital Prescriptions & Pharmacy Dispensing</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Doctor prescription builder with printable Rx sheets, batch inventory tracking, low-stock threshold alerts, and one-click medication dispensing.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>5. Laboratory & Pathology Diagnostics</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Diagnostic test requisitioning, parameter result entry with abnormal flags and biological reference ranges, and verified printable NABL pathology reports.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>6. Billing, Invoicing & Multi-Modal Payments</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Itemized patient bills covering consultation, bed tariffs, lab tests, and pharmacy with 5% GST calculation, discount concession, and printable formal tax receipts.
            </p>
          </div>
        </div>
      </div>

      {/* AI API Endpoints */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Server-Side Clinical AI API Endpoints</span>
        </h2>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded text-[11px]">POST</span>
              <span>/api/ai/triage</span>
            </div>
            <p className="text-slate-600 mt-1">
              Takes patient age, gender, reported symptoms, and vitals (BP, pulse, SpO2, temp); returns emergency acuity level, differential diagnoses, immediate nursing resuscitation actions, and priority lab orders.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded text-[11px]">POST</span>
              <span>/api/ai/drug-interaction-check</span>
            </div>
            <p className="text-slate-600 mt-1">
              Takes list of prescribed medications and patient allergies/conditions; evaluates dangerous pharmacodynamic interactions, bleeding risks, and provides clinical adjustments.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded text-[11px]">POST</span>
              <span>/api/ai/discharge-summary</span>
            </div>
            <p className="text-slate-600 mt-1">
              Takes inpatient admission notes, hospital course, final diagnosis, and discharge medications; compiles a structured medical discharge summary document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
