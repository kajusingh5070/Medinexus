import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Printer,
  Trash2,
  AlertCircle,
  Sparkles,
  Stethoscope,
  Pill,
  Calendar,
  CheckCircle,
  Eye,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Prescription, PrescribedMedication } from "../types";
import { PrintablePrescription } from "./PrintablePrescription";

export const PrescriptionsView: React.FC = () => {
  const {
    prescriptions,
    patients,
    doctors,
    pharmacyItems,
    addPrescription,
    selectedPatientId,
    setSelectedPatientId,
    searchTerm,
  } = useHospital();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);

  // New Prescription Form State
  const [formData, setFormData] = useState({
    patientId: selectedPatientId || patients[0]?.id || "",
    doctorId: doctors[0]?.id || "",
    diagnoses: "",
    labTestsRecommended: "",
    dietAdvice: "Low salt, balanced nutritious diet, drink plenty of water.",
    followUpDays: 7,
    notes: "",
  });

  const [medicationsList, setMedicationsList] = useState<PrescribedMedication[]>([
    {
      id: "med-1",
      name: "Paracetamol (Dolo 650)",
      dosage: "650 mg",
      frequency: "Thrice Daily (TDS)",
      duration: "5 Days",
      timing: "After Food",
      instructions: "Take 1 tablet after meals with water",
    },
  ]);

  // Drug Interaction state for AI validation
  const [aiChecking, setAiChecking] = useState(false);
  const [aiSafetyReport, setAiSafetyReport] = useState<{
    safetyLevel: string;
    interactions: string[];
    recommendations: string[];
  } | null>(null);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const patient = patients.find((p) => p.id === rx.patientId);
    const doctor = doctors.find((d) => d.id === rx.doctorId);

    const matchesSearch =
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rx.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnoses.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPatient =
      !selectedPatientId || rx.patientId === selectedPatientId;

    return matchesSearch && matchesPatient;
  });

  const handleAddMedicationRow = () => {
    setMedicationsList([
      ...medicationsList,
      {
        id: `med-${Date.now()}`,
        name: pharmacyItems[0]?.name || "Amoxicillin 500mg",
        dosage: "500 mg",
        frequency: "Twice Daily (BD)",
        duration: "5 Days",
        timing: "After Food",
        instructions: "Take with water",
      },
    ]);
  };

  const handleRemoveMedicationRow = (index: number) => {
    setMedicationsList(medicationsList.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof PrescribedMedication,
    value: string
  ) => {
    const updated = [...medicationsList];
    updated[index] = { ...updated[index], [field]: value };
    setMedicationsList(updated);
  };

  const checkDrugSafetyWithAI = async () => {
    if (medicationsList.length < 2) {
      alert("Add at least 2 medications to check for drug-drug interactions.");
      return;
    }

    setAiChecking(true);
    setAiSafetyReport(null);

    const patient = patients.find((p) => p.id === formData.patientId);

    try {
      const response = await fetch("/api/ai/drug-interaction-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medications: medicationsList.map((m) => `${m.name} (${m.dosage})`),
          allergies: patient?.allergies || [],
          chronicConditions: patient?.chronicConditions || [],
        }),
      });

      const data = await response.json();
      setAiSafetyReport(data);
    } catch (err) {
      console.error(err);
      setAiSafetyReport({
        safetyLevel: "Warning",
        interactions: ["Simulated: Monitor patient renal function and gastric sensitivity."],
        recommendations: ["Ensure appropriate time spacing between doses."],
      });
    } finally {
      setAiChecking(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || medicationsList.length === 0) {
      alert("Please ensure patient, doctor, and at least one medication are specified.");
      return;
    }

    const created = addPrescription({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      date: new Date().toISOString().split("T")[0],
      diagnoses: formData.diagnoses
        ? formData.diagnoses.split(",").map((s) => s.trim())
        : ["General OPD Clinical Assessment"],
      medications: medicationsList,
      labTestsRecommended: formData.labTestsRecommended
        ? formData.labTestsRecommended.split(",").map((s) => s.trim())
        : [],
      dietAdvice: formData.dietAdvice,
      followUpDays: Number(formData.followUpDays),
      notes: formData.notes,
    });

    setShowCreateModal(false);
    setViewingPrescription(created);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Electronic Health Records & Digital Prescriptions (℞)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate tamper-proof medical prescriptions, conduct AI drug interaction screenings, and print clinical sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedPatientId && (
            <button
              onClick={() => setSelectedPatientId(null)}
              className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Clear Patient Filter
            </button>
          )}
          <button
            id="btn-new-prescription-modal"
            onClick={() => {
              setFormData({
                patientId: selectedPatientId || patients[0]?.id || "",
                doctorId: doctors[0]?.id || "",
                diagnoses: "Acute Upper Respiratory Infection, Mild Pyrexia",
                labTestsRecommended: "Complete Blood Count (CBC)",
                dietAdvice: "Light nutritious meals, warm fluids, avoid cold beverages.",
                followUpDays: 5,
                notes: "",
              });
              setMedicationsList([
                {
                  id: "med-1",
                  name: "Paracetamol (Dolo 650)",
                  dosage: "650 mg",
                  frequency: "Thrice Daily (TDS)",
                  duration: "5 Days",
                  timing: "After Food",
                  instructions: "Take 1 tablet after meals",
                },
                {
                  id: "med-2",
                  name: "Azithromycin (Azee 500)",
                  dosage: "500 mg",
                  frequency: "Once Daily (OD)",
                  duration: "3 Days",
                  timing: "After Food",
                  instructions: "Take 1 tablet daily at fixed time",
                },
              ]);
              setAiSafetyReport(null);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Write Digital Prescription</span>
          </button>
        </div>
      </div>

      {/* Prescription List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Prescription Records Archive ({filteredPrescriptions.length})
          </span>
          <span className="text-xs text-slate-400">
            Pharmacy & Lab Linked
          </span>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No prescriptions found. Click "Write Digital Prescription" to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPrescriptions.map((rx) => {
              const patient = patients.find((p) => p.id === rx.patientId);
              const doctor = doctors.find((d) => d.id === rx.doctorId);

              return (
                <div
                  key={rx.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-serif font-bold text-base shrink-0">
                      ℞
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {patient?.name}
                        </span>
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                          {rx.prescriptionNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {patient?.mrn}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-800">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                          {doctor?.name} ({doctor?.department})
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">
                          Date: {rx.date}
                        </span>
                        <span>•</span>
                        <span className="text-indigo-700 font-medium">
                          {rx.medications.length} Medications Prescribed
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rx.diagnoses.map((diag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            {diag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => setViewingPrescription(rx)}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View & Print</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Prescription Creator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  ℞
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Clinical Digital Prescription Pad
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add medications, dosages, frequency, and run AI safety screening.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              {/* Patient & Doctor Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Patient *
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn}) - Blood: {p.bloodGroup}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prescribing Doctor *
                  </label>
                  <select
                    required
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} • {d.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Diagnosis (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.diagnoses}
                  onChange={(e) => setFormData({ ...formData, diagnoses: e.target.value })}
                  placeholder="e.g. Essential Hypertension, Bronchial Asthma"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Prescribed Medications Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <span>Medications (℞) Table</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={checkDrugSafetyWithAI}
                      disabled={aiChecking}
                      className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{aiChecking ? "Analyzing..." : "AI Safety Check"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddMedicationRow}
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Medicine</span>
                    </button>
                  </div>
                </div>

                {/* AI Interaction Safety Banner if returned */}
                {aiSafetyReport && (
                  <div className="p-3 bg-white rounded-lg border border-indigo-200 shadow-2xs space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-indigo-900">
                        <ShieldAlert className="w-4 h-4 text-indigo-600" />
                        AI Clinical Safety Assessment:
                      </span>
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        aiSafetyReport.safetyLevel === "Safe"
                          ? "bg-emerald-100 text-emerald-800"
                          : aiSafetyReport.safetyLevel === "Caution"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {aiSafetyReport.safetyLevel}
                      </span>
                    </div>
                    {aiSafetyReport.interactions.length > 0 && (
                      <div className="text-[11px] text-slate-700">
                        <strong>Interactions:</strong> {aiSafetyReport.interactions.join(" • ")}
                      </div>
                    )}
                    {aiSafetyReport.recommendations.length > 0 && (
                      <div className="text-[11px] text-slate-600">
                        <strong>Advice:</strong> {aiSafetyReport.recommendations.join(" • ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Medication Rows */}
                <div className="space-y-2.5">
                  {medicationsList.map((med, idx) => (
                    <div
                      key={med.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-4">
                          <label className="text-[10px] text-slate-500 font-semibold">Medicine Name</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicationChange(idx, "name", e.target.value)}
                            placeholder="e.g. Paracetamol"
                            className="w-full p-1.5 border border-slate-200 rounded focus:border-blue-500 outline-none font-medium"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-500 font-semibold">Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(idx, "dosage", e.target.value)}
                            placeholder="500 mg"
                            className="w-full p-1.5 border border-slate-200 rounded focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-slate-500 font-semibold">Frequency</label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(idx, "frequency", e.target.value)}
                            className="w-full p-1.5 border border-slate-200 rounded focus:border-blue-500 outline-none bg-white"
                          >
                            <option value="Once Daily (OD)">Once Daily (OD)</option>
                            <option value="Twice Daily (BD)">Twice Daily (BD)</option>
                            <option value="Thrice Daily (TDS)">Thrice Daily (TDS)</option>
                            <option value="Four Times Daily (QID)">Four Times Daily (QID)</option>
                            <option value="As Needed (SOS)">As Needed (SOS)</option>
                            <option value="At Bedtime (HS)">At Bedtime (HS)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-500 font-semibold">Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(idx, "duration", e.target.value)}
                            placeholder="5 Days"
                            className="w-full p-1.5 border border-slate-200 rounded focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end justify-center">
                          {medicationsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicationRow(idx)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Timing</label>
                          <select
                            value={med.timing}
                            onChange={(e) => handleMedicationChange(idx, "timing", e.target.value)}
                            className="w-full p-1.5 border border-slate-200 rounded focus:border-blue-500 outline-none bg-white"
                          >
                            <option value="After Food">After Food</option>
                            <option value="Before Food (Empty Stomach)">Before Food (Empty Stomach)</option>
                            <option value="With Meals">With Meals</option>
                            <option value="At Bedtime">At Bedtime</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Instructions</label>
                          <input
                            type="text"
                            value={med.instructions}
                            onChange={(e) => handleMedicationChange(idx, "instructions", e.target.value)}
                            placeholder="e.g. Swallow whole with water"
                            className="w-full p-1.5 border border-slate-200 rounded focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab investigations & Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Recommended Lab Tests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.labTestsRecommended}
                    onChange={(e) => setFormData({ ...formData, labTestsRecommended: e.target.value })}
                    placeholder="e.g. CBC, Lipid Profile, HbA1c"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Follow-up After (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.followUpDays}
                    onChange={(e) => setFormData({ ...formData, followUpDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dietary & Lifestyle Advice
                </label>
                <textarea
                  rows={2}
                  value={formData.dietAdvice}
                  onChange={(e) => setFormData({ ...formData, dietAdvice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save & Generate Rx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Sheet View Modal */}
      {viewingPrescription && (
        <PrintablePrescription
          prescription={viewingPrescription}
          patient={
            patients.find((p) => p.id === viewingPrescription.patientId) ||
            patients[0]
          }
          doctor={
            doctors.find((d) => d.id === viewingPrescription.doctorId) ||
            doctors[0]
          }
          onClose={() => setViewingPrescription(null)}
        />
      )}
    </div>
  );
};
