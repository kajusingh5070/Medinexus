import React from "react";
import {
  GraduationCap,
  Award,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Building,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
} from "lucide-react";
import { InteractiveHoverButton } from "./InteractiveHoverButton";

interface LandingAboutProps {
  onOpenAuth: (mode: "login" | "register") => void;
}

export const LandingAbout: React.FC<LandingAboutProps> = ({
  onOpenAuth,
}) => {
  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            About the Web Application
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Project Architecture & Vision
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            MediNexus was architected and developed as a comprehensive final-year Computer Science project
            aimed at bringing hospital-grade digital transformation to community and regional healthcare ecosystems.
          </p>
        </div>

        {/* Academic Profile Card & Institutional Credentials */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <GraduationCap className="w-5 h-5" />
                <span>Undergraduate Computer Science Project • Academic Year 2025 – 2026</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Nirmala Memorial Foundation College of Commerce and Science (Autonomous)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Department of Computer Science • Re-accredited with 'A' Grade by NAAC <br />
                Affiliated with the University of Mumbai, Kandivali (East), Mumbai – 400101.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1">
                  <div className="text-xs text-amber-300 font-medium">Developed By:</div>
                  <div className="text-base font-bold text-white">Kajal Singh Deepak</div>
                  <div className="text-xs text-slate-300">
                    Roll No: <span className="font-mono text-white font-semibold">67</span> | Seat No:{" "}
                    <span className="font-mono text-white font-semibold">24TCS110</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Class: T.Y.B.Sc. Computer Science (Div B)</div>
                </div>

                <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1">
                  <div className="text-xs text-amber-300 font-medium">Project Mentorship:</div>
                  <div className="text-base font-bold text-white">Prof. Cristin</div>
                  <div className="text-xs text-slate-300">Assistant Professor & Project Guide</div>
                  <div className="text-[11px] text-slate-400">
                    Department of Computer Science
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Clinical System Highlights
                  </h4>
                  <p className="text-xs text-slate-300">
                    Enterprise Hospital Information System
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time Bed Allocation & Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>NABL-Accredited Pathology Diagnostics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated GST Invoicing & Billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-Based Multi-Portal Authentication</span>
                </div>
              </div>

              <InteractiveHoverButton
                id="btn-about-portal-access"
                variant="gradient"
                size="md"
                className="w-full"
                onClick={() => onOpenAuth("login")}
              >
                Access Hospital Portals
              </InteractiveHoverButton>
            </div>
          </div>
        </div>

        {/* Technical Architecture Specs (id="architecture") */}
        <div id="architecture" className="scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Technical Stack & Specifications
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Modern Enterprise Technology Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Constructed according to professional web standards, strict privacy rules, and reactive state management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Frontend Engineering</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                React 19 + TypeScript with Tailwind CSS utility architecture, Lucide icons, and Motion layout transitions for 60fps animations.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                React 19 • TypeScript • Vite • Tailwind
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Express Proxy Backend</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Node.js and Express RESTful API server routing queries securely. Guarantees zero sensitive API keys are exposed to client browser DevTools.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                Node.js • Express • CORS • Security
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Gemini 3.7 AI Copilot</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Google Gen AI SDK proxy integration providing intelligent clinical decision support, symptom triage, and medical reference validation.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                Gemini 3.7 • Clinical AI • Decision Support
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Data Persistence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Normalized data structures aligned with MongoDB collections (Patients, Beds, Pharmacy, Labs, Invoices) with local synchronization.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                JSON Schemas • MongoDB Ready • LocalStorage
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
