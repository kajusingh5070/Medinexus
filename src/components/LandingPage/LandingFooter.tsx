import React from "react";
import {
  Activity,
  ShieldCheck,
  Heart,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { UserRole } from "../../types";

interface LandingFooterProps {
  onOpenAuth: (mode: "login" | "register", prefilledRole?: UserRole) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onOpenAuth,
}) => {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                MediNexus
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
                Hospital System
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An intelligent, full-stack Hospital Information Management System engineered to harmonize outpatient triage,
              bed telemetry, digital pharmacy inventories, NABL laboratory reporting, and automated revenue reconciliation.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Nirmala Memorial Foundation College, Kandivali (E), Mumbai – 400101</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Clinical Telemetry Grid Active 24/7/365</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Architected for NABH & HIPAA Clinical Security Standards</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollTo("#home")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#introduction")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Application Introduction
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#features")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clinical Modules & Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#about")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About the Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#architecture")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Technical Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Department Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenAuth("login", "admin")}
                  className="hover:text-white transition-colors flex items-center justify-between w-full"
                >
                  <span>Super Admin Portal</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth("login", "doctor")}
                  className="hover:text-white transition-colors flex items-center justify-between w-full"
                >
                  <span>Doctor Consultation OPD</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth("login", "receptionist")}
                  className="hover:text-white transition-colors flex items-center justify-between w-full"
                >
                  <span>Admissions & Bed Matrix</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth("login", "pharmacist")}
                  className="hover:text-white transition-colors flex items-center justify-between w-full"
                >
                  <span>Pharmacy & Dispensary</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth("login", "lab_tech")}
                  className="hover:text-white transition-colors flex items-center justify-between w-full"
                >
                  <span>Pathology Diagnostics</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth("login", "patient")}
                  className="hover:text-white transition-colors flex items-center justify-between w-full"
                >
                  <span>Patient Health Portal</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Academic Attribution & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Academic Credits
            </h4>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Final Year Project</span>
              </div>
              <div className="text-slate-200 font-bold">Kajal Singh Deepak</div>
              <div className="text-[11px] text-slate-400">
                Roll No: 67 | Seat: 24TCS110 <br />
                T.Y.B.Sc. Computer Science (Div B)
              </div>
              <div className="pt-1.5 border-t border-slate-700 text-[11px] text-slate-400">
                Project Guide: <span className="text-slate-200 font-semibold">Prof. Cristin</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => onOpenAuth("register")}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-center"
              >
                Register Portal Account
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Disclaimer & Heart */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 – 2026 MediNexus. All rights reserved. Academic Project Demonstration.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Community Healthcare Advancement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
