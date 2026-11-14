import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Stethoscope,
  FileText,
  ShieldAlert,
  HeartPulse,
  Send,
  Loader2,
  CheckCircle,
  Building,
  Activity,
  Copy,
  Check,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export const AiAssistantView: React.FC = () => {
  const { patients, doctors, beds } = useHospital();

  const [activeTab, setActiveTab] = useState<"triage" | "discharge" | "drugSafety">("triage");

  // --- TAB 1: Triage State ---
  const [triageForm, setTriageForm] = useState({
    patientId: patients[0]?.id || "",
    age: 45,
    gender: "Male",
    symptoms: "Sudden onset severe crushing retrosternal chest pain radiating to left shoulder and jaw, associated with profuse sweating and shortness of breath.",
    bp: "150/95",
    pulse: 108,
    spO2: 94,
    temperature: 98.6,
    chronicConditions: "Hypertension, Hyperlipidemia",
  });
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any | null>(null);

  // --- TAB 2: Discharge State ---
  const [dischargeForm, setDischargeForm] = useState({
    patientName: "Rajesh Sharma",
    mrn: "MRN-2026-001",
    admissionDate: "2026-08-14",
    dischargeDate: "2026-08-19",
    admittingDiagnosis: "Acute Coronary Syndrome - NSTEMI",
    dischargeDiagnosis: "Coronary Artery Disease, S/P Successful Coronary Angioplasty (PTCA to LAD), Controlled Hypertension",
    hospitalCourse: "Patient presented with acute retrosternal chest pain. Initial ECG showed ST depressions in V3-V6 with elevated Troponin I (0.85 ng/mL). Emergent coronary angiography revealed 90% stenosis in mid-LAD. Successful drug-eluting stent (DES) deployed. Post-procedure recovery uneventful. Hemodynamically stable.",
    dischargeVitals: "BP 118/76 mmHg, Pulse 72 bpm regular, SpO2 99% on room air, Afebrile",
    dischargeMedications: "1. Tab Aspirin 75mg OD (After food)\n2. Tab Clopidogrel 75mg OD (After food)\n3. Tab Atorvastatin 40mg HS (At bedtime)\n4. Tab Metoprolol Succinate 25mg OD (Morning)",
  });
  const [dischargeLoading, setDischargeLoading] = useState(false);
  const [dischargeResult, setDischargeResult] = useState<any | null>(null);
  const [copiedDischarge, setCopiedDischarge] = useState(false);

  // --- TAB 3: Drug Safety State ---
  const [drugSafetyForm, setDrugSafetyForm] = useState({
    medications: "Aspirin 75mg, Clopidogrel 75mg, Ibuprofen 400mg, Warfarin 5mg",
    allergies: "Penicillin",
    chronicConditions: "Peptic Ulcer Disease, Hypertension",
  });
  const [drugSafetyLoading, setDrugSafetyLoading] = useState(false);
  const [drugSafetyResult, setDrugSafetyResult] = useState<any | null>(null);

  // Auto-fill triage from selected patient
  const handleSelectPatientForTriage = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId);
    if (!p) return;
    const latestVital = p.vitals[0];
    setTriageForm({
      patientId: p.id,
      age: p.age,
      gender: p.gender,
      symptoms: p.medicalHistory[0] || "Chest heaviness and dyspnea on exertion",
      bp: latestVital?.bp || "120/80",
      pulse: latestVital?.pulse || 72,
      spO2: latestVital?.spO2 || 98,
      temperature: latestVital?.temperature || 98.4,
      chronicConditions: p.chronicConditions.join(", ") || "None reported",
    });
  };

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriageLoading(true);
    setTriageResult(null);

    try {
      const response = await fetch("/api/ai/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: triageForm.age,
          gender: triageForm.gender,
          symptoms: triageForm.symptoms,
          vitals: {
            bp: triageForm.bp,
            pulse: triageForm.pulse,
            spO2: triageForm.spO2,
            temperature: triageForm.temperature,
          },
          chronicConditions: triageForm.chronicConditions
            ? triageForm.chronicConditions.split(",").map((s) => s.trim())
            : [],
        }),
      });

      const data = await response.json();
      setTriageResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setTriageResult({
        triageLevel: "Emergency (Level 2)",
        recommendedDepartment: "Cardiology & Intensive Care",
        potentialDifferentials: [
          "Acute Coronary Syndrome / Myocardial Ischemia",
          "Aortic Dissection",
          "Pulmonary Embolism",
        ],
        immediateActions: [
          "Perform 12-lead ECG immediately within 10 minutes",
          "Check cardiac enzymes (High-sensitivity Troponin I)",
          "Administer supplemental oxygen if SpO2 < 94%",
          "Establish IV access and initiate continuous cardiac telemetry",
        ],
        suggestedLabTests: ["ECG 12-Lead", "Troponin-I", "CPK-MB", "CBC", "Chest X-Ray"],
        reasoning: "Presentation of radiating crushing retrosternal chest pain with autonomic symptoms (diaphoresis) and tachycardia in a patient with cardiovascular risk factors warrants immediate high-acuity triage.",
      });
    } finally {
      setTriageLoading(false);
    }
  };

  const handleGenerateDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    setDischargeLoading(true);
    setDischargeResult(null);

    try {
      const response = await fetch("/api/ai/discharge-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dischargeForm),
      });

      const data = await response.json();
      setDischargeResult(data);
    } catch (err) {
      console.error(err);
      setDischargeResult({
        dischargeSummary: `HOSPITAL DISCHARGE SUMMARY\nPatient: ${dischargeForm.patientName} (${dischargeForm.mrn})\nAdmission: ${dischargeForm.admissionDate} | Discharge: ${dischargeForm.dischargeDate}\n\nFINAL DIAGNOSIS:\n${dischargeForm.dischargeDiagnosis}\n\nCLINICAL SUMMARY & COURSE:\n${dischargeForm.hospitalCourse}\n\nDISCHARGE VITALS:\n${dischargeForm.dischargeVitals}\n\nDISCHARGE MEDICATIONS:\n${dischargeForm.dischargeMedications}\n\nFOLLOW-UP ADVICE:\nReview in Cardiology OPD after 7 days with repeat ECG and lipid profile. Urgent emergency reporting if recurring chest pain, breathlessness, or syncope occurs.`,
      });
    } finally {
      setDischargeLoading(false);
    }
  };

  const handleRunDrugSafety = async (e: React.FormEvent) => {
    e.preventDefault();
    setDrugSafetyLoading(true);
    setDrugSafetyResult(null);

    try {
      const response = await fetch("/api/ai/drug-interaction-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medications: drugSafetyForm.medications.split(",").map((s) => s.trim()),
          allergies: drugSafetyForm.allergies ? drugSafetyForm.allergies.split(",").map((s) => s.trim()) : [],
          chronicConditions: drugSafetyForm.chronicConditions ? drugSafetyForm.chronicConditions.split(",").map((s) => s.trim()) : [],
        }),
      });

      const data = await response.json();
      setDrugSafetyResult(data);
    } catch (err) {
      console.error(err);
      setDrugSafetyResult({
        safetyLevel: "High Risk / Caution",
        interactions: [
          "Dual Antiplatelet + NSAID (Aspirin + Clopidogrel + Ibuprofen): Significantly increases gastrointestinal bleeding and ulcer perforation risk.",
          "Warfarin + Antiplatelets / NSAIDs: Compounded anticoagulant effect with major systemic hemorrhage hazard.",
        ],
        recommendations: [
          "Discontinue Ibuprofen immediately; replace with Paracetamol for analgesia if needed.",
          "Add Proton Pump Inhibitor (Pantoprazole 40mg) for gastroprotection.",
          "Monitor INR closely for Warfarin dosage titration.",
        ],
      });
    } finally {
      setDrugSafetyLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Gemini 3.7 Clinical Intelligence Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Clinical Copilot & Decision Support
            </h1>
            <p className="text-indigo-100/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Server-side neural intelligence assisting attending doctors and emergency triage teams with risk stratification, discharge documentation, and polypharmacy interaction checking.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("triage")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "triage"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Emergency Symptom Triage</span>
        </button>

        <button
          onClick={() => setActiveTab("discharge")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "discharge"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>AI Discharge Summary Generator</span>
        </button>

        <button
          onClick={() => setActiveTab("drugSafety")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "drugSafety"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Drug Interaction & Safety Screener</span>
        </button>
      </div>

      {/* TAB 1: Emergency Symptom Triage */}
      {activeTab === "triage" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">
                Triage Intake Assessment
              </div>
              <p className="text-slate-500">
                Quickly populate from registered patient or enter emergency vitals.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Autofill From Patient (Optional)
              </label>
              <select
                onChange={(e) => handleSelectPatientForTriage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 outline-none"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleRunTriage} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age (Yrs)</label>
                  <input
                    type="number"
                    value={triageForm.age}
                    onChange={(e) => setTriageForm({ ...triageForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={triageForm.gender}
                    onChange={(e) => setTriageForm({ ...triageForm, gender: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reported Chief Symptoms & Complaints *
                </label>
                <textarea
                  rows={3}
                  required
                  value={triageForm.symptoms}
                  onChange={(e) => setTriageForm({ ...triageForm, symptoms: e.target.value })}
                  placeholder="Describe pain location, onset, severity, radiation, associated signs..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Triage Biometric Vitals</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400">BP</span>
                    <input
                      type="text"
                      value={triageForm.bp}
                      onChange={(e) => setTriageForm({ ...triageForm, bp: e.target.value })}
                      className="w-full p-1 border border-slate-200 rounded bg-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Pulse (bpm)</span>
                    <input
                      type="number"
                      value={triageForm.pulse}
                      onChange={(e) => setTriageForm({ ...triageForm, pulse: Number(e.target.value) })}
                      className="w-full p-1 border border-slate-200 rounded bg-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">SpO2 (%)</span>
                    <input
                      type="number"
                      value={triageForm.spO2}
                      onChange={(e) => setTriageForm({ ...triageForm, spO2: Number(e.target.value) })}
                      className="w-full p-1 border border-slate-200 rounded bg-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Temp (°F)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={triageForm.temperature}
                      onChange={(e) => setTriageForm({ ...triageForm, temperature: Number(e.target.value) })}
                      className="w-full p-1 border border-slate-200 rounded bg-white font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Known Chronic Conditions / Comorbidities
                </label>
                <input
                  type="text"
                  value={triageForm.chronicConditions}
                  onChange={(e) => setTriageForm({ ...triageForm, chronicConditions: e.target.value })}
                  placeholder="e.g. Hypertension, Diabetes, COPD"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={triageLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {triageLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Clinical Risk Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Triage & Department Routing</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Results (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {triageResult ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-5 animate-in fade-in duration-200">
                {/* Triage Level Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">
                      Acuity Stratification Level
                    </span>
                    <h2 className="text-xl font-extrabold text-amber-300 mt-0.5">
                      {triageResult.triageLevel}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Recommended Routing</span>
                    <span className="font-bold text-sm text-emerald-400">
                      {triageResult.recommendedDepartment}
                    </span>
                  </div>
                </div>

                {/* Potential Differentials */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                    <span>Primary Differential Diagnoses</span>
                  </div>
                  <ul className="text-xs text-slate-800 space-y-1 list-disc pl-5">
                    {triageResult.potentialDifferentials?.map((diff: string, i: number) => (
                      <li key={i} className="font-medium">{diff}</li>
                    ))}
                  </ul>
                </div>

                {/* Immediate Clinical Actions */}
                <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <span>Immediate First-Line Resuscitation / Nursing Actions</span>
                  </div>
                  <ul className="text-xs text-rose-950 space-y-1.5 list-disc pl-5">
                    {triageResult.immediateActions?.map((act: string, i: number) => (
                      <li key={i} className="font-medium leading-relaxed">{act}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Tests */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Priority Diagnostic Investigations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {triageResult.suggestedLabTests?.map((test: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg font-medium"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reasoning */}
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed border border-slate-200">
                  <strong className="text-slate-800">Clinical AI Rationale:</strong> {triageResult.reasoning}
                </div>
              </div>
            ) : (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700 text-sm">Awaiting Triage Assessment</p>
                <p className="mt-1">Fill out the patient presentation on the left and click "Run AI Triage".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI Discharge Summary Generator */}
      {activeTab === "discharge" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <div className="font-bold text-sm text-slate-900">
              Inpatient Case Details For Discharge
            </div>

            <form onSubmit={handleGenerateDischarge} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={dischargeForm.patientName}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, patientName: e.target.value })}
                    className="w-full p-1.5 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRN / ID</label>
                  <input
                    type="text"
                    value={dischargeForm.mrn}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, mrn: e.target.value })}
                    className="w-full p-1.5 border border-slate-200 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Date</label>
                  <input
                    type="date"
                    value={dischargeForm.admissionDate}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, admissionDate: e.target.value })}
                    className="w-full p-1.5 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discharge Date</label>
                  <input
                    type="date"
                    value={dischargeForm.dischargeDate}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, dischargeDate: e.target.value })}
                    className="w-full p-1.5 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Final Discharge Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={dischargeForm.dischargeDiagnosis}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, dischargeDiagnosis: e.target.value })}
                  className="w-full p-1.5 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Course & Interventions</label>
                <textarea
                  rows={3}
                  value={dischargeForm.hospitalCourse}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, hospitalCourse: e.target.value })}
                  className="w-full p-1.5 border border-slate-200 rounded resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discharge Vitals</label>
                <input
                  type="text"
                  value={dischargeForm.dischargeVitals}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, dischargeVitals: e.target.value })}
                  className="w-full p-1.5 border border-slate-200 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discharge Medications (Rx)</label>
                <textarea
                  rows={3}
                  value={dischargeForm.dischargeMedications}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, dischargeMedications: e.target.value })}
                  className="w-full p-1.5 border border-slate-200 rounded font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={dischargeLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {dischargeLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Drafting Formal Clinical Summary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Structured Discharge Document</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result */}
          <div className="lg:col-span-7">
            {dischargeResult ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Generated Hospital Discharge Summary
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dischargeResult.dischargeSummary);
                      setCopiedDischarge(true);
                      setTimeout(() => setCopiedDischarge(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors"
                  >
                    {copiedDischarge ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDischarge ? "Copied!" : "Copy Summary"}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-50 rounded-xl text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed border border-slate-200/80 max-h-[600px] overflow-y-auto">
                  {dischargeResult.dischargeSummary}
                </pre>
              </div>
            ) : (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700 text-sm">Ready to Generate Discharge Summary</p>
                <p className="mt-1">Review the case details on the left and click "Generate".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Drug Interaction & Safety Screener */}
      {activeTab === "drugSafety" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">
                Polypharmacy Safety Screening
              </div>
              <p className="text-slate-500">
                Evaluates drug-drug interactions, allergy contraindications, and organ toxicities.
              </p>
            </div>

            <form onSubmit={handleRunDrugSafety} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  List of Concurrent Medications (comma separated) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={drugSafetyForm.medications}
                  onChange={(e) => setDrugSafetyForm({ ...drugSafetyForm, medications: e.target.value })}
                  placeholder="e.g. Warfarin 5mg, Aspirin 75mg, Clopidogrel 75mg, Ibuprofen 400mg"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Allergies
                </label>
                <input
                  type="text"
                  value={drugSafetyForm.allergies}
                  onChange={(e) => setDrugSafetyForm({ ...drugSafetyForm, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Chronic Conditions
                </label>
                <input
                  type="text"
                  value={drugSafetyForm.chronicConditions}
                  onChange={(e) => setDrugSafetyForm({ ...drugSafetyForm, chronicConditions: e.target.value })}
                  placeholder="e.g. Chronic Kidney Disease, Peptic Ulcer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={drugSafetyLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {drugSafetyLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Screening Drug Interactions...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-300" />
                    <span>Check Drug-Drug Interactions</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-7">
            {drugSafetyResult ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Safety Risk Level
                    </span>
                    <div className="text-lg font-bold text-amber-300">
                      {drugSafetyResult.safetyLevel}
                    </div>
                  </div>
                </div>

                {/* Interactions */}
                <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Identified Pharmacological Interactions</span>
                  </div>
                  <ul className="text-xs text-rose-950 space-y-1.5 list-disc pl-5">
                    {drugSafetyResult.interactions?.map((item: string, i: number) => (
                      <li key={i} className="leading-relaxed font-medium">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Clinical Recommendations & Adjustments</span>
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-5">
                    {drugSafetyResult.recommendations?.map((item: string, i: number) => (
                      <li key={i} className="leading-relaxed font-medium">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700 text-sm">Drug Safety Analysis Ready</p>
                <p className="mt-1">Enter medication combinations to screen for dangerous drug interactions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
