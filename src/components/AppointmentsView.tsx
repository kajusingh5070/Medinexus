import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  PlayCircle,
  FileText,
  AlertTriangle,
  Plus,
  Stethoscope,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Appointment, AppointmentStatus } from "../types";

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    patients,
    doctors,
    addAppointment,
    updateAppointmentStatus,
    setSelectedPatientId,
    setActiveView,
    searchTerm,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>("ALL");
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);

  // Booking Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || "",
    doctorId: doctors[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "10:00 AM - 10:30 AM",
    type: "OPD Consultation" as Appointment["type"],
    symptoms: "",
    notes: "",
  });

  const [completingAptId, setCompletingAptId] = useState<string | null>(null);
  const [diagnosisInput, setDiagnosisInput] = useState<string>("");

  const timeSlots = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const patient = patients.find((p) => p.id === apt.patientId);
    const doctor = doctors.find((d) => d.id === apt.doctorId);

    const matchesSearch =
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      apt.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || apt.status === statusFilter;

    const matchesDoctor =
      selectedDoctorFilter === "ALL" || apt.doctorId === selectedDoctorFilter;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId) return;

    const doctor = doctors.find((d) => d.id === formData.doctorId);

    addAppointment({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      date: formData.date,
      timeSlot: formData.timeSlot,
      type: formData.type,
      status: "Scheduled",
      symptoms: formData.symptoms || "General health consultation",
      fee: doctor?.consultationFee || 800,
      notes: formData.notes,
    });

    setShowBookModal(false);
  };

  const handleCompleteAppointment = (aptId: string) => {
    updateAppointmentStatus(aptId, "Completed", diagnosisInput || "Consultation completed");
    setCompletingAptId(null);
    setDiagnosisInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Appointment Scheduling & OPD Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Book slots, track real-time consultation statuses, check in patients, and route to EHR.
          </p>
        </div>

        <button
          id="btn-book-appointment-modal"
          onClick={() => {
            setFormData({
              patientId: patients[0]?.id || "",
              doctorId: doctors[0]?.id || "",
              date: new Date().toISOString().split("T")[0],
              timeSlot: "10:00 AM - 10:30 AM",
              type: "OPD Consultation",
              symptoms: "",
              notes: "",
            });
            setShowBookModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          {["ALL", "Scheduled", "In-Progress", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Doctor:</span>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 outline-none"
          >
            <option value="ALL">All Doctors ({doctors.length})</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Consultation Appointments Directory ({filteredAppointments.length})
          </span>
          <span className="text-xs text-slate-400">
            Real-time Status Sync
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No appointments match the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredAppointments.map((apt) => {
              const patient = patients.find((p) => p.id === apt.patientId);
              const doctor = doctors.find((d) => d.id === apt.doctorId);

              return (
                <div
                  key={apt.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Patient Info & MRN */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {patient?.name.charAt(0) || "P"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => {
                            if (patient) {
                              setSelectedPatientId(patient.id);
                              setActiveView("patients");
                            }
                          }}
                          className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {patient?.name}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {apt.appointmentNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({patient?.age}y / {patient?.gender})
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-800">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                          {doctor?.name} ({doctor?.department})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {apt.date} at {apt.timeSlot}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500 font-medium">
                          Type: {apt.type}
                        </span>
                      </div>

                      {apt.symptoms && (
                        <div className="text-xs text-slate-500 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 max-w-xl">
                          <strong className="text-slate-700">Reported Symptoms:</strong> {apt.symptoms}
                          {apt.diagnosis && (
                            <span className="text-emerald-700 ml-2">
                              • <strong>Diagnosis:</strong> {apt.diagnosis}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        apt.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "In-Progress"
                          ? "bg-blue-100 text-blue-800 animate-pulse font-bold"
                          : apt.status === "Cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {apt.status}
                    </span>

                    {/* Action buttons based on status */}
                    {apt.status === "Scheduled" && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "In-Progress")}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Start Consultation"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start</span>
                      </button>
                    )}

                    {apt.status === "In-Progress" && (
                      <button
                        onClick={() => setCompletingAptId(apt.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Mark Consultation Completed"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    )}

                    {apt.status !== "Completed" && apt.status !== "Cancelled" && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs cursor-pointer transition-colors"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Write Prescription Quick Button */}
                    <button
                      onClick={() => {
                        if (patient) setSelectedPatientId(patient.id);
                        setActiveView("prescriptions");
                      }}
                      className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Write Digital Prescription"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Rx</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Book Consultation Appointment
              </h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Registered Patient *
                </label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Specialist Doctor *
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white font-medium"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} • {d.department} (Fee: ₹{d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Visit Category
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                >
                  <option value="OPD Consultation">OPD Consultation</option>
                  <option value="Follow-up">Follow-up Visit</option>
                  <option value="Routine Checkup">Routine Preventive Checkup</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Telehealth">Telehealth Virtual</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chief Symptoms & Complaints
                </label>
                <textarea
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="e.g. Chest discomfort, palpitations on exertion, dizziness"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Consultation Dialog */}
      {completingAptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Complete Consultation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter primary diagnosis and clinical findings to mark appointment as finished.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosisInput}
                  onChange={(e) => setDiagnosisInput(e.target.value)}
                  placeholder="e.g. Essential Hypertension Grade I, Chronic Bronchitis"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  onClick={() => setCompletingAptId(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCompleteAppointment(completingAptId)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
