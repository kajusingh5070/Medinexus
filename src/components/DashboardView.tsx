import React from "react";
import {
  Users,
  Calendar,
  BedDouble,
  Receipt,
  Pill,
  FlaskConical,
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  Stethoscope,
  ArrowUpRight,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Shield,
  Building2,
  User,
  CheckCircle2,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { UserRole } from "../types";

export const DashboardView: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    beds,
    labOrders,
    pharmacyItems,
    invoices,
    prescriptions,
    currentRole,
    setCurrentRole,
    setActiveView,
    setSelectedPatientId,
  } = useHospital();

  const totalPatients = patients.length;
  const inpatients = patients.filter((p) => p.admissionStatus === "Inpatient").length;
  const opdPatients = patients.filter((p) => p.admissionStatus === "OPD").length;
  const emergencyPatients = patients.filter((p) => p.admissionStatus === "Emergency").length;

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100) || 0;

  const todayAppointments = appointments.filter((a) => a.date === "2026-08-19");
  const pendingAppointments = appointments.filter(
    (a) => a.status === "Scheduled" || a.status === "In-Progress"
  );

  const pendingLabTests = labOrders.filter(
    (l) => l.status !== "Completed" && l.status !== "Delivered"
  );

  const lowStockMeds = pharmacyItems.filter(
    (m) => m.stockQuantity <= m.minStockLevel
  );

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const pendingCollections = totalBilled - totalRevenue;

  const availableDoctors = doctors.filter((d) => d.status === "Available");

  const roleHeaders: Record<
    UserRole,
    { title: string; subtitle: string; badge: string; gradient: string }
  > = {
    admin: {
      title: "Hospital Operations Overview",
      subtitle: "Real-time synchronization across Patient Admissions, Doctor Schedules, Laboratory Diagnostics, Pharmacy Dispensing, and Bed Ward Allocations.",
      badge: "MediNexus Command Center • Super Admin",
      gradient: "from-blue-700 via-indigo-700 to-slate-900",
    },
    doctor: {
      title: "Doctor Clinical Workstation",
      subtitle: "Manage your OPD consultation queue, review patient vitals, examine diagnostic reports, and write digital prescriptions with AI clinical triage.",
      badge: "Clinical Attending Doctor Portal",
      gradient: "from-blue-700 via-cyan-800 to-slate-900",
    },
    receptionist: {
      title: "Front Desk & Admissions Desk",
      subtitle: "Execute rapid patient intake registrations, issue OPD consultation tokens, check available ward beds, and process cashier billing.",
      badge: "Front Desk & Admissions Operations",
      gradient: "from-emerald-700 via-teal-800 to-slate-900",
    },
    pharmacist: {
      title: "Pharmacy & Dispensary Control",
      subtitle: "Real-time formulary stock levels, automated low-inventory alerts, prescription dispensing, and medicine restock management.",
      badge: "Hospital Pharmacy In-Charge Portal",
      gradient: "from-amber-700 via-yellow-800 to-slate-900",
    },
    lab_tech: {
      title: "Diagnostic Pathology & Laboratory",
      subtitle: "Manage diagnostic test orders, enter hematology and biochemistry findings, review abnormal flags, and generate printable pathology reports.",
      badge: "Clinical Pathology & Diagnostic Lab",
      gradient: "from-indigo-700 via-purple-800 to-slate-900",
    },
    patient: {
      title: "My Health & Clinical Records",
      subtitle: "Access your digitized medical record, active prescriptions, scheduled doctor visits, diagnostic lab reports, and itemized billing receipts.",
      badge: "Patient Personal Health Portal",
      gradient: "from-rose-700 via-pink-800 to-slate-900",
    },
  };

  const currentHeader = roleHeaders[currentRole];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className={`bg-gradient-to-r ${currentHeader.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="bg-white/20 text-white border border-white/30 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                {currentHeader.badge}
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Systems Normal
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {currentHeader.title}
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl">
              {currentHeader.subtitle}
            </p>
          </div>

          {/* Role-Specific Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {currentRole === "admin" && (
              <>
                <button
                  id="btn-dash-register-patient"
                  onClick={() => setActiveView("patients")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-blue-900 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Register Patient</span>
                </button>
                <button
                  id="btn-dash-book-appointment"
                  onClick={() => setActiveView("appointments")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600/80 hover:bg-blue-600 border border-blue-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
                <button
                  id="btn-dash-ai-triage"
                  onClick={() => setActiveView("ai_assistant")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Triage</span>
                </button>
              </>
            )}

            {currentRole === "doctor" && (
              <>
                <button
                  onClick={() => setActiveView("prescriptions")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-blue-900 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Write Prescription</span>
                </button>
                <button
                  onClick={() => setActiveView("appointments")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600/80 hover:bg-blue-600 border border-blue-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>OPD Queue ({pendingAppointments.length})</span>
                </button>
                <button
                  onClick={() => setActiveView("ai_assistant")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Clinical Co-Pilot</span>
                </button>
              </>
            )}

            {currentRole === "receptionist" && (
              <>
                <button
                  onClick={() => setActiveView("patients")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>New Admission</span>
                </button>
                <button
                  onClick={() => setActiveView("beds")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <BedDouble className="w-4 h-4" />
                  <span>Ward Beds ({totalBeds - occupiedBeds} Free)</span>
                </button>
                <button
                  onClick={() => setActiveView("appointments")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600/80 hover:bg-teal-600 border border-teal-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Issue OPD Token</span>
                </button>
              </>
            )}

            {currentRole === "pharmacist" && (
              <>
                <button
                  onClick={() => setActiveView("pharmacy")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-amber-900 hover:bg-amber-50 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-amber-600" />
                  <span>Formulary Catalog</span>
                </button>
                <button
                  onClick={() => setActiveView("prescriptions")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600/80 hover:bg-amber-600 border border-amber-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Dispense Prescriptions</span>
                </button>
              </>
            )}

            {currentRole === "lab_tech" && (
              <>
                <button
                  onClick={() => setActiveView("laboratory")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  <span>Pending Tests ({pendingLabTests.length})</span>
                </button>
                <button
                  onClick={() => setActiveView("patients")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Specimen Patients</span>
                </button>
              </>
            )}

            {currentRole === "patient" && (
              <>
                <button
                  onClick={() => setActiveView("appointments")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-rose-900 hover:bg-rose-50 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>Book Doctor Visit</span>
                </button>
                <button
                  onClick={() => setActiveView("prescriptions")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 border border-rose-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Pill className="w-4 h-4" />
                  <span>My Active Dosages</span>
                </button>
                <button
                  onClick={() => setActiveView("laboratory")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-600/80 hover:bg-pink-600 border border-pink-400/40 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Lab Reports</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div
          onClick={() => setActiveView("patients")}
          className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Patients
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-slate-900">
              {totalPatients}
            </span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Active
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{inpatients} Inpatients</span>
            <span>•</span>
            <span>{opdPatients} OPD</span>
            <span>•</span>
            <span>{emergencyPatients} ER</span>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div
          onClick={() => setActiveView("beds")}
          className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bed Occupancy
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-slate-900">
              {occupancyRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({occupiedBeds}/{totalBeds} Beds)
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                occupancyRate > 75
                  ? "bg-rose-500"
                  : occupancyRate > 50
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Appointments Today */}
        <div
          onClick={() => setActiveView("appointments")}
          className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Appointments
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-slate-900">
              {pendingAppointments.length}
            </span>
            <span className="text-xs text-blue-600 font-medium">
              ({todayAppointments.length} Today)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {availableDoctors.length} Doctors currently on active duty
          </div>
        </div>

        {/* Revenue Collected */}
        <div
          onClick={() => setActiveView("billing")}
          className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Revenue Collections
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl lg:text-3xl font-bold text-slate-900">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>₹{totalBilled.toLocaleString()} Total Billed</span>
            <span className="text-amber-600 font-medium">₹{pendingCollections.toLocaleString()} Due</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Patients & Appointments Queues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Appointments Queue */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-800">
                  Today's Consultation Queue
                </h2>
              </div>
              <button
                onClick={() => setActiveView("appointments")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({appointments.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {appointments.slice(0, 4).map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);
                const doctor = doctors.find((d) => d.id === apt.doctorId);
                return (
                  <div
                    key={apt.id}
                    className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {patient?.name.charAt(0) || "P"}
                      </div>
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                          <span>{patient?.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            {patient?.mrn}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {doctor?.name} • <span className="text-slate-700">{doctor?.department}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-semibold text-slate-800">
                          {apt.timeSlot}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {apt.type}
                        </div>
                      </div>

                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          apt.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : apt.status === "In-Progress"
                            ? "bg-blue-100 text-blue-800 animate-pulse"
                            : apt.status === "Cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inpatient Admission & Vitals Monitor */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <h2 className="font-bold text-sm text-slate-800">
                  Critical Care & Inpatient Vitals
                </h2>
              </div>
              <button
                onClick={() => setActiveView("patients")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Patient Directory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {patients
                .filter((p) => p.vitals.length > 0)
                .slice(0, 4)
                .map((patient) => {
                  const latestVital = patient.vitals[0];
                  const bed = beds.find((b) => b.id === patient.assignedBedId);
                  return (
                    <div
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setActiveView("patients");
                      }}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60 hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {patient.name}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {bed ? bed.bedNumber : patient.admissionStatus}
                        </span>
                      </div>

                      {/* Vitals Row */}
                      <div className="grid grid-cols-4 gap-1.5 text-center mt-2">
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                          <div className="text-[10px] text-slate-400">BP</div>
                          <div className="text-xs font-bold text-slate-800 font-mono">
                            {latestVital?.bp || "—"}
                          </div>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                          <div className="text-[10px] text-slate-400">Pulse</div>
                          <div className="text-xs font-bold text-slate-800 font-mono">
                            {latestVital?.pulse || "—"} <span className="text-[9px] font-normal">bpm</span>
                          </div>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                          <div className="text-[10px] text-slate-400">SpO2</div>
                          <div className="text-xs font-bold text-emerald-700 font-mono">
                            {latestVital?.spO2 || "—"}%
                          </div>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                          <div className="text-[10px] text-slate-400">Temp</div>
                          <div className="text-xs font-bold text-slate-800 font-mono">
                            {latestVital?.temperature || "—"}°F
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Recorded: {latestVital?.recordedAt}</span>
                        <span className="text-blue-600 font-medium">View Chart →</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Department Status, Low Stock & Lab Warnings */}
        <div className="space-y-6">
          {/* Active Doctor Availability */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Doctor Duty Status
                </h3>
              </div>
              <button
                onClick={() => setActiveView("doctors")}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                All ({doctors.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {doctors.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.department}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      doc.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : doc.status === "In Consultation"
                        ? "bg-blue-100 text-blue-800"
                        : doc.status === "Emergency Duty"
                        ? "bg-rose-100 text-rose-800 font-semibold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Operational Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Department Alerts
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Pharmacy Alert */}
              <div
                onClick={() => setActiveView("pharmacy")}
                className="p-3 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <Pill className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pharmacy Restock Needed</span>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                    {lowStockMeds.length} Items
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1 line-clamp-2">
                  {lowStockMeds.map((m) => `${m.name} (${m.stockQuantity} left)`).join(", ")}
                </p>
              </div>

              {/* Lab Order Alert */}
              <div
                onClick={() => setActiveView("laboratory")}
                className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                    <FlaskConical className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Diagnostics in Pipeline</span>
                  </div>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded font-bold">
                    {pendingLabTests.length} Tests
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 mt-1">
                  Samples collected and pending bio-chemical assay analysis.
                </p>
              </div>

              {/* Security & System Integrity */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Role-based access & patient EHR audit logging active.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
