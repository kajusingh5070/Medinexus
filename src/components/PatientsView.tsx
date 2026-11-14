import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  HeartPulse,
  FileText,
  FlaskConical,
  BedDouble,
  Receipt,
  AlertCircle,
  Plus,
  Check,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Printer,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Patient, VitalRecord, AdmissionStatus } from "../types";

export const PatientsView: React.FC = () => {
  const {
    patients,
    doctors,
    beds,
    prescriptions,
    labOrders,
    invoices,
    addPatient,
    updatePatient,
    deletePatient,
    addPatientVitals,
    searchTerm,
    selectedPatientId,
    setSelectedPatientId,
    setActiveView,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Form states for new patient registration
  const [formData, setFormData] = useState({
    name: "",
    age: 30,
    gender: "Male" as "Male" | "Female" | "Other",
    bloodGroup: "O+" as Patient["bloodGroup"],
    phone: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    admissionStatus: "OPD" as AdmissionStatus,
    assignedDoctorId: "",
    allergies: "",
    chronicConditions: "",
    medicalHistory: "",
    notes: "",
    bp: "120/80",
    pulse: 72,
    spO2: 99,
    temperature: 98.4,
    weight: 65,
    respiratoryRate: 16,
  });

  // Vitals form
  const [vitalsFormData, setVitalsFormData] = useState({
    bp: "120/80",
    pulse: 74,
    spO2: 98,
    temperature: 98.6,
    weight: 68,
    respiratoryRate: 16,
    recordedBy: "Staff Nurse On Duty",
  });

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.admissionStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Active selected patient
  const currentPatient =
    patients.find((p) => p.id === selectedPatientId) ||
    (selectedPatientId ? null : patients[0]);

  const assignedDoc = doctors.find((d) => d.id === currentPatient?.assignedDoctorId);
  const assignedBed = beds.find((b) => b.id === currentPatient?.assignedBedId);
  const patientPrescriptions = prescriptions.filter((rx) => rx.patientId === currentPatient?.id);
  const patientLabOrders = labOrders.filter((l) => l.patientId === currentPatient?.id);
  const patientInvoices = invoices.filter((i) => i.patientId === currentPatient?.id);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone,
        },
        admissionStatus: formData.admissionStatus,
        assignedDoctorId: formData.assignedDoctorId || undefined,
        allergies: formData.allergies ? formData.allergies.split(",").map((s) => s.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(",").map((s) => s.trim()) : [],
        notes: formData.notes,
      });
      setEditingPatient(null);
    } else {
      const created = addPatient({
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyName || "Family Contact",
          relation: formData.emergencyRelation || "Relation",
          phone: formData.emergencyPhone || formData.phone,
        },
        admissionStatus: formData.admissionStatus,
        assignedDoctorId: formData.assignedDoctorId || undefined,
        admissionDate: new Date().toISOString().split("T")[0],
        allergies: formData.allergies ? formData.allergies.split(",").map((s) => s.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(",").map((s) => s.trim()) : [],
        medicalHistory: formData.medicalHistory ? formData.medicalHistory.split("\n").filter(Boolean) : [],
        notes: formData.notes,
        initialVitals: {
          bp: formData.bp,
          pulse: Number(formData.pulse),
          spO2: Number(formData.spO2),
          temperature: Number(formData.temperature),
          weight: Number(formData.weight),
          respiratoryRate: Number(formData.respiratoryRate),
        },
      });
      setSelectedPatientId(created.id);
    }

    setShowRegisterModal(false);
  };

  const handleAddVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;
    addPatientVitals(currentPatient.id, {
      bp: vitalsFormData.bp,
      pulse: Number(vitalsFormData.pulse),
      spO2: Number(vitalsFormData.spO2),
      temperature: Number(vitalsFormData.temperature),
      weight: Number(vitalsFormData.weight),
      respiratoryRate: Number(vitalsFormData.respiratoryRate),
      recordedBy: vitalsFormData.recordedBy,
    });
    setShowAddVitalsModal(false);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      emergencyName: patient.emergencyContact.name,
      emergencyRelation: patient.emergencyContact.relation,
      emergencyPhone: patient.emergencyContact.phone,
      admissionStatus: patient.admissionStatus,
      assignedDoctorId: patient.assignedDoctorId || "",
      allergies: patient.allergies.join(", "),
      chronicConditions: patient.chronicConditions.join(", "),
      medicalHistory: patient.medicalHistory.join("\n"),
      notes: patient.notes,
      bp: patient.vitals[0]?.bp || "120/80",
      pulse: patient.vitals[0]?.pulse || 72,
      spO2: patient.vitals[0]?.spO2 || 99,
      temperature: patient.vitals[0]?.temperature || 98.4,
      weight: patient.vitals[0]?.weight || 65,
      respiratoryRate: patient.vitals[0]?.respiratoryRate || 16,
    });
    setShowRegisterModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient Registration & Electronic Health Records
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain centralized clinical profiles, biometric vitals history, allergy warnings, and inpatient bed tracking.
          </p>
        </div>

        <button
          id="btn-register-patient-modal"
          onClick={() => {
            setEditingPatient(null);
            setFormData({
              name: "",
              age: 35,
              gender: "Male",
              bloodGroup: "O+",
              phone: "",
              email: "",
              address: "",
              emergencyName: "",
              emergencyRelation: "",
              emergencyPhone: "",
              admissionStatus: "OPD",
              assignedDoctorId: "",
              allergies: "",
              chronicConditions: "",
              medicalHistory: "",
              notes: "",
              bp: "120/80",
              pulse: 72,
              spO2: 99,
              temperature: 98.4,
              weight: 65,
              respiratoryRate: 16,
            });
            setShowRegisterModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Patient Registration</span>
        </button>
      </div>

      {/* Filter Tabs & Patient Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
          {["ALL", "OPD", "Inpatient", "Emergency", "Discharged"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status === "ALL" ? `All (${patients.length})` : status}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredPatients.length}</span> patient records
        </div>
      </div>

      {/* Split View: Left List (40%) and Right Detail (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Master List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col max-h-[750px]">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Registered Patient Directory
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              MRN Index
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No patients match the search or filter criteria.
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = patient.id === currentPatient?.id;
                const latestVital = patient.vitals[0];
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 group/row ${
                      isSelected
                        ? "bg-blue-50/70 border-l-4 border-blue-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                          <span>{patient.name}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {patient.bloodGroup}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="font-mono text-blue-600 font-medium">
                            {patient.mrn}
                          </span>
                          <span>•</span>
                          <span>
                            {patient.age}y / {patient.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            patient.admissionStatus === "Inpatient"
                              ? "bg-amber-100 text-amber-800"
                              : patient.admissionStatus === "Emergency"
                              ? "bg-rose-100 text-rose-800 font-bold"
                              : patient.admissionStatus === "Discharged"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {patient.admissionStatus}
                        </span>
                        {latestVital && (
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            BP: {latestVital.bp}
                          </div>
                        )}
                      </div>

                      {/* Quick inline list actions */}
                      <div className="flex items-center gap-1 opacity-80 group-hover/row:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(patient);
                          }}
                          className="p-1.5 hover:bg-blue-100 text-slate-500 hover:text-blue-700 rounded-md transition-colors"
                          title="Edit Patient"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPatientToDelete(patient);
                          }}
                          className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Patient Comprehensive Clinical Chart / Profile */}
        <div className="lg:col-span-7 space-y-4">
          {currentPatient ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Profile Header */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                      {currentPatient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-bold">
                          {currentPatient.name}
                        </h2>
                        <span className="text-xs bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded font-mono">
                          {currentPatient.mrn}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                        <span>{currentPatient.age} Years</span>
                        <span>•</span>
                        <span>{currentPatient.gender}</span>
                        <span>•</span>
                        <span className="font-bold text-amber-300">
                          Blood: {currentPatient.bloodGroup}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                          Status: {currentPatient.admissionStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(currentPatient)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer transition-colors font-medium"
                      title="Edit Patient Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => setPatientToDelete(currentPatient)}
                      className="px-3 py-1.5 bg-rose-900/70 hover:bg-rose-800 rounded-lg text-rose-200 text-xs flex items-center gap-1.5 cursor-pointer transition-colors font-medium"
                      title="Delete Patient Record"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Contact Strip */}
                <div className="mt-4 pt-3 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>{currentPatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400 truncate" />
                    <span className="truncate">{currentPatient.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 truncate" />
                    <span className="truncate">{currentPatient.address}</span>
                  </div>
                </div>
              </div>

              {/* Patient Core Clinical Details */}
              <div className="p-5 space-y-5">
                {/* Allergy & Warning Alert */}
                {currentPatient.allergies.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold">KNOWN CLINICAL ALLERGIES: </span>
                      <span>{currentPatient.allergies.join(", ")}</span>
                    </div>
                  </div>
                )}

                {/* Quick Care Assignment Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Attending Physician
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        {assignedDoc ? assignedDoc.name : "Unassigned"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {assignedDoc?.department || "OPD General"}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView("doctors")}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Change →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Assigned Bed & Ward
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        {assignedBed ? `${assignedBed.bedNumber} (${assignedBed.wardType})` : "Not Admitted (OPD)"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {assignedBed ? assignedBed.floor : "Outpatient Status"}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView("beds")}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Manage →
                    </button>
                  </div>
                </div>

                {/* Latest Vitals & Add Vitals Button */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-600" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        Biometric Vital Signs Log
                      </h3>
                    </div>
                    <button
                      id="btn-log-vitals"
                      onClick={() => setShowAddVitalsModal(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Vitals</span>
                    </button>
                  </div>

                  {currentPatient.vitals.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-dashed border-slate-200">
                      No vitals recorded yet. Click "Log Vitals" to record patient temperature, blood pressure, and pulse.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentPatient.vitals.map((vit, idx) => (
                        <div
                          key={vit.id || idx}
                          className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-6 gap-2 text-center"
                        >
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                            <div className="text-[10px] text-slate-400">BP</div>
                            <div className="text-xs font-bold text-slate-800 font-mono">{vit.bp}</div>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                            <div className="text-[10px] text-slate-400">Pulse</div>
                            <div className="text-xs font-bold text-slate-800 font-mono">{vit.pulse} bpm</div>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                            <div className="text-[10px] text-slate-400">SpO2</div>
                            <div className="text-xs font-bold text-emerald-700 font-mono">{vit.spO2}%</div>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                            <div className="text-[10px] text-slate-400">Temp</div>
                            <div className="text-xs font-bold text-slate-800 font-mono">{vit.temperature}°F</div>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                            <div className="text-[10px] text-slate-400">Weight</div>
                            <div className="text-xs font-bold text-slate-800 font-mono">{vit.weight} kg</div>
                          </div>
                          <div className="flex flex-col justify-center text-[10px] text-slate-400 text-right pr-2">
                            <span>{vit.recordedAt}</span>
                            <span className="truncate text-slate-500">{vit.recordedBy}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Medical History & Chronic Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Chronic Medical Conditions
                    </div>
                    {currentPatient.chronicConditions.length === 0 ? (
                      <div className="text-xs text-slate-400 italic">None reported</div>
                    ) : (
                      <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                        {currentPatient.chronicConditions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Emergency Contact Info
                    </div>
                    <div className="text-xs text-slate-700">
                      <div className="font-semibold">{currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relation})</div>
                      <div className="text-slate-500 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-blue-500" />
                        <span>{currentPatient.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked Clinical Records (Prescriptions, Lab, Invoices) */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span><strong>{patientPrescriptions.length}</strong> Prescriptions</span>
                    <span>•</span>
                    <span><strong>{patientLabOrders.length}</strong> Lab Orders</span>
                    <span>•</span>
                    <span><strong>{patientInvoices.length}</strong> Invoices</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView("prescriptions")}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      New Prescription
                    </button>
                    <button
                      onClick={() => setActiveView("laboratory")}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Order Lab Test
                    </button>
                    <button
                      onClick={() => setActiveView("ai_assistant")}
                      className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Discharge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Select a patient from the list to view their complete clinical health record.
            </div>
          )}
        </div>
      </div>

      {/* Register / Edit Patient Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingPatient ? "Edit Patient Clinical Record" : "New Patient Registration Form"}
                </h3>
                <p className="text-xs text-slate-500">
                  Enter demographic, contact, emergency contact, and baseline vitals.
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4 text-xs">
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Kumar Rao"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="125"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Admission Type *
                  </label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="OPD">OPD (Outpatient)</option>
                    <option value="Inpatient">Inpatient (Admitted)</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Area, City, State"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Emergency Contact */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Emergency Contact Person</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Spouse/Parent)"
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                    className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:border-blue-500 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Allergies & Conditions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Known Drug Allergies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Sulfa, Aspirin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chronic Conditions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.chronicConditions}
                    onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                    placeholder="e.g. Hypertension, Diabetes, Asthma"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Initial Vitals if registering new */}
              {!editingPatient && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
                  <div className="font-bold text-blue-900">Baseline Vitals At Intake</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                    <div>
                      <label className="text-[10px] text-slate-500">BP</label>
                      <input
                        type="text"
                        value={formData.bp}
                        onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                        className="w-full p-1 border border-slate-200 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Pulse (bpm)</label>
                      <input
                        type="number"
                        value={formData.pulse}
                        onChange={(e) => setFormData({ ...formData, pulse: Number(e.target.value) })}
                        className="w-full p-1 border border-slate-200 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">SpO2 (%)</label>
                      <input
                        type="number"
                        value={formData.spO2}
                        onChange={(e) => setFormData({ ...formData, spO2: Number(e.target.value) })}
                        className="w-full p-1 border border-slate-200 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Temp (°F)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                        className="w-full p-1 border border-slate-200 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        className="w-full p-1 border border-slate-200 bg-white rounded text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Resp. Rate</label>
                      <input
                        type="number"
                        value={formData.respiratoryRate}
                        onChange={(e) => setFormData({ ...formData, respiratoryRate: Number(e.target.value) })}
                        className="w-full p-1 border border-slate-200 bg-white rounded text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-all cursor-pointer"
                >
                  {editingPatient ? "Save Changes" : "Register Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Vitals Modal */}
      {showAddVitalsModal && currentPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Patient Vitals
                </h3>
                <p className="text-xs text-slate-500">
                  {currentPatient.name} ({currentPatient.mrn})
                </p>
              </div>
              <button
                onClick={() => setShowAddVitalsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVitalsSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    required
                    value={vitalsFormData.bp}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, bp: e.target.value })}
                    placeholder="120/80"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pulse (Heart Rate bpm)
                  </label>
                  <input
                    type="number"
                    required
                    value={vitalsFormData.pulse}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, pulse: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Oxygen Saturation SpO2 (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="100"
                    value={vitalsFormData.spO2}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, spO2: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vitalsFormData.temperature}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, temperature: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={vitalsFormData.weight}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Respiratory Rate (/min)
                  </label>
                  <input
                    type="number"
                    value={vitalsFormData.respiratoryRate}
                    onChange={(e) => setVitalsFormData({ ...vitalsFormData, respiratoryRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recorded By (Nurse / Attendant)
                </label>
                <input
                  type="text"
                  value={vitalsFormData.recordedBy}
                  onChange={(e) => setVitalsFormData({ ...vitalsFormData, recordedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVitalsModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save Vitals Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Patient Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Delete Patient Record
                </h3>
                <p className="text-xs text-slate-500">
                  Permanent removal confirmation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to delete the clinical record for{" "}
              <strong className="text-slate-900">{patientToDelete.name}</strong>{" "}
              (MRN: <span className="font-mono">{patientToDelete.mrn}</span>)?
              Any assigned hospital bed will be released immediately.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePatient(patientToDelete.id);
                  setPatientToDelete(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
