import React, { useState } from "react";
import {
  BedDouble,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRightLeft,
  LogOut,
  Plus,
  Building,
  HeartPulse,
  Sparkles,
  Info,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Bed, Patient, WardType } from "../types";

export const BedsView: React.FC = () => {
  const {
    beds,
    patients,
    doctors,
    assignBedToPatient,
    dischargeBed,
    sanitizeBed,
    transferBed,
    setSelectedPatientId,
    setActiveView,
    searchTerm,
  } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>("ALL");
  const [assigningBed, setAssigningBed] = useState<Bed | null>(null);
  const [transferringBed, setTransferringBed] = useState<Bed | null>(null);
  const [dischargingBed, setDischargingBed] = useState<Bed | null>(null);

  // Form states
  const [selectedPatientIdInput, setSelectedPatientIdInput] = useState<string>("");
  const [targetBedId, setTargetBedId] = useState<string>("");

  const wardTypes: WardType[] = [
    "Intensive Care Unit (ICU)",
    "General Ward (Male)",
    "General Ward (Female)",
    "Emergency Triage",
    "Deluxe Private Suite",
    "Post-Op Recovery",
  ];

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const availableBeds = beds.filter((b) => b.status === "Available").length;
  const maintenanceBeds = beds.filter(
    (b) => b.status === "Under Maintenance" || b.status === "Cleaning"
  ).length;

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch =
      bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.wardType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.floor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWard =
      selectedWard === "ALL" || bed.wardType === selectedWard;

    return matchesSearch && matchesWard;
  });

  const handleAssignConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBed || !selectedPatientIdInput) return;

    assignBedToPatient(selectedPatientIdInput, assigningBed.id);
    setAssigningBed(null);
    setSelectedPatientIdInput("");
  };

  const handleTransferConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferringBed || !targetBedId || !transferringBed.currentPatientId) return;

    transferBed(transferringBed.currentPatientId, transferringBed.id, targetBedId);
    setTransferringBed(null);
    setTargetBedId("");
  };

  const unassignedPatients = patients.filter((p) => !p.assignedBedId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Bed Allocation & Ward Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual map of Intensive Care Units, General Wards, Emergency Triage, and Private Suites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200">
            Occupancy Rate: {Math.round((occupiedBeds / totalBeds) * 100)}%
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Total Operational Beds
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalBeds} Beds
          </div>
          <div className="text-xs text-slate-400 mt-1">Across 6 hospital wards</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase">
            Currently Occupied
          </span>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {occupiedBeds} Beds
          </div>
          <div className="text-xs text-slate-400 mt-1">Active inpatient care</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">
            Available For Intake
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {availableBeds} Beds
          </div>
          <div className="text-xs text-slate-400 mt-1">Sanitized & ready</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase">
            Sanitization / Maintenance
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {maintenanceBeds} Beds
          </div>
          <div className="text-xs text-slate-400 mt-1">Turnaround in progress</div>
        </div>
      </div>

      {/* Ward Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedWard("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedWard === "ALL"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          All Wards ({beds.length})
        </button>
        {wardTypes.map((ward) => {
          const count = beds.filter((b) => b.wardType === ward).length;
          return (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedWard === ward
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {ward} ({count})
            </button>
          );
        })}
      </div>

      {/* Bed Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeds.map((bed) => {
          const patient = patients.find((p) => p.id === bed.currentPatientId);
          const isOccupied = bed.status === "Occupied";
          const isAvailable = bed.status === "Available";

          return (
            <div
              key={bed.id}
              className={`p-4 rounded-xl border transition-all bg-white relative overflow-hidden ${
                isOccupied
                  ? "border-rose-300 shadow-2xs bg-gradient-to-b from-white to-rose-50/20"
                  : isAvailable
                  ? "border-emerald-300 shadow-2xs hover:border-emerald-500"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              {/* Top Row: Bed Number & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 font-mono">
                      {bed.bedNumber}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      {bed.floor}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {bed.wardType}
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                    isOccupied
                      ? "bg-rose-100 text-rose-800"
                      : isAvailable
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {bed.status}
                </span>
              </div>

              {/* Middle: Patient Info if occupied or Features if available */}
              <div className="my-3 py-2.5 border-y border-slate-100 text-xs">
                {isOccupied && patient ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Admitted Patient</span>
                      <span className="font-mono text-blue-600 font-bold">{patient.mrn}</span>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setActiveView("patients");
                      }}
                      className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {patient.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{patient.age}y / {patient.gender} • Blood: {patient.bloodGroup}</span>
                      <span>Adm: {bed.admissionDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Daily Room Tariff:</span>
                      <span className="font-bold text-slate-900">₹{bed.dailyRate} / day</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Features: {bed.features.join(" • ")}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1">
                {isAvailable && (
                  <button
                    onClick={() => {
                      setAssigningBed(bed);
                      setSelectedPatientIdInput(unassignedPatients[0]?.id || "");
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Patient</span>
                  </button>
                )}

                {isOccupied && (
                  <div className="w-full flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTransferringBed(bed);
                        const otherAvailable = beds.find((b) => b.status === "Available" && b.id !== bed.id);
                        setTargetBedId(otherAvailable?.id || "");
                      }}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                      title="Transfer to another Bed"
                    >
                      <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                      <span>Transfer</span>
                    </button>
                    <button
                      onClick={() => setDischargingBed(bed)}
                      className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                      title="Discharge and Free Bed"
                    >
                      <LogOut className="w-3 h-3 text-rose-600" />
                      <span>Discharge</span>
                    </button>
                  </div>
                )}

                {(bed.status === "Cleaning" || bed.status === "Under Maintenance") && (
                  <button
                    onClick={() => sanitizeBed(bed.id)}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mark Sanitized & Ready</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Bed Modal */}
      {assigningBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Assign Patient to {assigningBed.bedNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {assigningBed.wardType} • {assigningBed.floor} • Rate: ₹{assigningBed.dailyRate}/day
            </p>

            <form onSubmit={handleAssignConfirm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Patient for Admission *
                </label>
                {unassignedPatients.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-xs">
                    All registered patients currently have beds assigned. Register a new patient or set admission status.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedPatientIdInput}
                    onChange={(e) => setSelectedPatientIdInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    {unassignedPatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn}) - {p.admissionStatus}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningBed(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={unassignedPatients.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Confirm Bed Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Bed Modal */}
      {transferringBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Internal Inpatient Bed Transfer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Transfer patient from <strong>{transferringBed.bedNumber}</strong> to another open bed.
            </p>

            <form onSubmit={handleTransferConfirm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Target Destination Bed *
                </label>
                <select
                  required
                  value={targetBedId}
                  onChange={(e) => setTargetBedId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white font-medium"
                >
                  {beds
                    .filter((b) => b.status === "Available" && b.id !== transferringBed.id)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bedNumber} - {b.wardType} ({b.floor})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferringBed(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discharge Inpatient Confirmation Modal */}
      {dischargingBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Inpatient Discharge
                </h3>
                <p className="text-xs text-slate-500">
                  Bed: {dischargingBed.bedNumber} ({dischargingBed.wardType})
                </p>
              </div>
            </div>

            {(() => {
              const bedPatient = patients.find((p) => p.id === dischargingBed.currentPatientId);
              return (
                <div className="space-y-3 text-xs mb-5">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-800 text-sm">
                      {bedPatient ? bedPatient.name : "Admitted Inpatient"}
                    </div>
                    <div className="text-slate-500 mt-1 flex items-center gap-2">
                      <span>MRN: {bedPatient?.mrn || "N/A"}</span>
                      <span>•</span>
                      <span>Floor: {dischargingBed.floor}</span>
                    </div>
                    <div className="text-slate-500 mt-1 text-[11px]">
                      Admitted: {dischargingBed.admissionDate || "Active admission"}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    Executing this discharge will update the patient status to <strong>Discharged</strong>, release the bed, and flag the bed for housekeeping sanitization.
                  </p>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDischargingBed(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  dischargeBed(dischargingBed.id);
                  setDischargingBed(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                Confirm & Discharge Bed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
