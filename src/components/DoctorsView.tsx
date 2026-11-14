import React, { useState } from "react";
import {
  Stethoscope,
  UserPlus,
  Search,
  Calendar,
  Clock,
  Star,
  Phone,
  Mail,
  Building,
  CheckCircle,
  AlertCircle,
  Plus,
  Users,
  ChevronRight,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Doctor } from "../types";

export const DoctorsView: React.FC = () => {
  const {
    doctors,
    appointments,
    patients,
    addDoctor,
    updateDoctor,
    setActiveView,
    searchTerm,
  } = useHospital();

  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "Cardiology",
    specialty: "",
    qualification: "",
    experienceYears: 10,
    consultationFee: 1000,
    phone: "",
    email: "",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableHours: "09:00 AM - 02:00 PM",
    status: "Available" as Doctor["status"],
    roomNumber: "OPD 101",
  });

  const departments = [
    "ALL",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "General Medicine",
    "Emergency / Trauma",
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDepartment === "ALL" || doc.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  const activeDoctor =
    doctors.find((d) => d.id === selectedDoctorId) || filteredDoctors[0] || doctors[0];

  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === activeDoctor?.id
  );

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addDoctor({
      name: formData.name.startsWith("Dr.") ? formData.name : `Dr. ${formData.name}`,
      department: formData.department,
      specialty: formData.specialty || `${formData.department} Specialist`,
      qualification: formData.qualification || "MBBS, MD",
      experienceYears: Number(formData.experienceYears),
      consultationFee: Number(formData.consultationFee),
      phone: formData.phone || "+91 98765 00000",
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@medinexus.org`,
      availableDays: formData.availableDays,
      availableHours: formData.availableHours,
      status: formData.status,
      roomNumber: formData.roomNumber,
      rating: 4.8,
    });

    setShowAddDoctorModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Doctor & Specialist Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage clinical departments, consultation hours, duty status, and OPD queues.
          </p>
        </div>

        <button
          id="btn-add-doctor-modal"
          onClick={() => {
            setFormData({
              name: "",
              department: "Cardiology",
              specialty: "",
              qualification: "",
              experienceYears: 8,
              consultationFee: 1000,
              phone: "",
              email: "",
              availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              availableHours: "09:00 AM - 02:00 PM",
              status: "Available",
              roomNumber: "OPD 105",
            });
            setShowAddDoctorModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Specialist Doctor</span>
        </button>
      </div>

      {/* Department Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDepartment === dept
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {dept === "ALL" ? `All Specialties (${doctors.length})` : dept}
          </button>
        ))}
      </div>

      {/* Main Grid: Doctor Cards (Left 7) and Doctor Profile Detail (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doctor Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => {
            const isSelected = doc.id === activeDoctor?.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative overflow-hidden ${
                  isSelected
                    ? "border-blue-600 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200/80 hover:border-blue-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-base overflow-hidden shrink-0">
                      {doc.avatarUrl ? (
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        doc.name.replace("Dr. ", "").charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                        {doc.name}
                      </h3>
                      <div className="text-xs text-blue-600 font-medium line-clamp-1">
                        {doc.specialty}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {doc.department}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] truncate max-w-[140px]">{doc.availableHours}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      doc.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : doc.status === "In Consultation"
                        ? "bg-blue-100 text-blue-800"
                        : doc.status === "Emergency Duty"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Doctor Active Detail & Schedule Card */}
        <div className="lg:col-span-5">
          {activeDoctor ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden sticky top-20">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md overflow-hidden">
                    {activeDoctor.avatarUrl ? (
                      <img
                        src={activeDoctor.avatarUrl}
                        alt={activeDoctor.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      activeDoctor.name.charAt(4) || "D"
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{activeDoctor.name}</h2>
                    <div className="text-xs text-blue-300 font-medium">
                      {activeDoctor.specialty}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {activeDoctor.qualification}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Experience</span>
                    <span className="font-semibold text-white">{activeDoctor.experienceYears} Years Clinical</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Consultation Fee</span>
                    <span className="font-bold text-amber-300">₹{activeDoctor.consultationFee} / OPD</span>
                  </div>
                </div>
              </div>

              {/* Status Toggle & Schedule Info */}
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Update Current Availability Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Available", "In Consultation", "Emergency Duty", "On Leave"] as Doctor["status"][]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => updateDoctor(activeDoctor.id, { status })}
                          className={`p-2 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                            activeDoctor.status === status
                              ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800">Consultation Schedule & Room</div>
                  <div className="text-slate-600">
                    <strong>OPD Room:</strong> {activeDoctor.roomNumber}
                  </div>
                  <div className="text-slate-600">
                    <strong>Working Days:</strong> {activeDoctor.availableDays.join(", ")}
                  </div>
                  <div className="text-slate-600">
                    <strong>Duty Hours:</strong> {activeDoctor.availableHours}
                  </div>
                </div>

                {/* Doctor's Consultation Queue */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Assigned Patients Queue ({doctorAppointments.length})
                    </span>
                    <button
                      onClick={() => setActiveView("appointments")}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {doctorAppointments.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl">
                      No appointments currently scheduled for this doctor.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {doctorAppointments.map((apt) => {
                        const patient = patients.find((p) => p.id === apt.patientId);
                        return (
                          <div
                            key={apt.id}
                            className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-slate-900">
                                {patient?.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {apt.timeSlot} • {apt.type}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                apt.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : apt.status === "In-Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveView("appointments")}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer text-center"
                  >
                    Book Appointment With {activeDoctor.name.split(" ")[1] || "Doctor"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
              Select a doctor to view their profile and duty schedule.
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Enroll Specialist Doctor
              </h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor Full Name (with title) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Siddharth Mukherjee"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Emergency / Trauma">Emergency / Trauma</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sub-Specialty
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Pediatric Cardiology"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. MBBS, MD, DM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    OPD Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="Room 102"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Duty Hours
                  </label>
                  <input
                    type="text"
                    value={formData.availableHours}
                    onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
                    placeholder="09:00 AM - 02:00 PM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
