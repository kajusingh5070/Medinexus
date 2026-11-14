import React from "react";
import { Prescription, Patient, Doctor } from "../types";
import { Printer, Activity, Phone, Mail, MapPin } from "lucide-react";

interface Props {
  prescription: Prescription;
  patient: Patient;
  doctor: Doctor;
  onClose: () => void;
}

export const PrintablePrescription: React.FC<Props> = ({
  prescription,
  patient,
  doctor,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const latestVital = patient.vitals[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-8 my-8 print:border-none print:shadow-none print:m-0 print:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Print / Close Toolbar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Digital Medical Prescription Document
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Prescription Document Sheet */}
        <div className="space-y-6 text-slate-800">
          {/* Hospital & Doctor Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  MediNexus Super Specialty Hospital
                </h1>
                <p className="text-xs text-slate-500">
                  Multi-Specialty Care, ICU, Diagnostics & Emergency Center
                </p>
                <p className="text-[11px] text-slate-400">
                  Plot 14-B, Healthcare Enclave, Central Avenue • Helpline: +91 (022) 2890-5000
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-sm font-bold text-slate-900">{doctor.name}</h2>
              <p className="text-xs text-blue-700 font-semibold">{doctor.specialty}</p>
              <p className="text-[11px] text-slate-500">{doctor.qualification}</p>
              <p className="text-[11px] text-slate-400">Reg No: MCI-MH-2014-9981</p>
            </div>
          </div>

          {/* Patient Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Patient Name</span>
              <span className="font-bold text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">MRN / ID</span>
              <span className="font-mono font-semibold text-blue-700">{patient.mrn}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Age / Gender / Blood</span>
              <span className="font-semibold text-slate-800">{patient.age} Yrs / {patient.gender} / {patient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Date & Rx No.</span>
              <span className="font-semibold text-slate-800">{prescription.date} • {prescription.prescriptionNumber}</span>
            </div>
          </div>

          {/* Vitals Summary Strip */}
          {latestVital && (
            <div className="flex items-center gap-6 p-2.5 bg-blue-50/50 rounded-lg text-xs border border-blue-100 font-mono">
              <span className="text-[11px] font-bold text-slate-500">VITALS:</span>
              <span><strong>BP:</strong> {latestVital.bp}</span>
              <span><strong>Pulse:</strong> {latestVital.pulse} bpm</span>
              <span><strong>SpO2:</strong> {latestVital.spO2}%</span>
              <span><strong>Temp:</strong> {latestVital.temperature}°F</span>
              <span><strong>Weight:</strong> {latestVital.weight} kg</span>
            </div>
          )}

          {/* Clinical Diagnoses */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Clinical Diagnoses & Assessment
            </div>
            <div className="text-sm font-semibold text-slate-900 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              {prescription.diagnoses.join(" • ") || "Clinical consultation & symptomatic relief"}
            </div>
          </div>

          {/* Rx Medication Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
              <span className="font-serif italic text-2xl">℞</span>
              <span className="text-xs uppercase tracking-wider text-slate-700 font-sans">
                Prescribed Medications & Dosage
              </span>
            </div>

            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Medication Name</th>
                  <th className="p-2.5">Dosage</th>
                  <th className="p-2.5">Frequency</th>
                  <th className="p-2.5">Duration</th>
                  <th className="p-2.5">Timing & Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {prescription.medications.map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{med.name}</td>
                    <td className="p-2.5 font-mono">{med.dosage}</td>
                    <td className="p-2.5 font-medium text-blue-700">{med.frequency}</td>
                    <td className="p-2.5 font-medium">{med.duration}</td>
                    <td className="p-2.5 text-slate-600">
                      <span className="font-semibold text-slate-800">{med.timing}:</span> {med.instructions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommended Diagnostics & Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                Recommended Lab Investigations
              </div>
              {prescription.labTestsRecommended.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {prescription.labTestsRecommended.map((test, i) => (
                    <li key={i}>{test}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-slate-400 italic">No diagnostic tests required</div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                Dietary & Lifestyle Advice
              </div>
              <p className="text-slate-700">
                {prescription.dietAdvice || "Follow regular balanced diet. Adequate fluid intake."}
              </p>
              <div className="mt-2 text-slate-600">
                <strong>Follow Up:</strong> In {prescription.followUpDays || 7} days or SOS in case of acute distress.
              </div>
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="pt-8 flex justify-between items-end border-t border-slate-200">
            <div className="text-[11px] text-slate-400">
              <p>Electronically generated and validated in MediNexus Health Cloud.</p>
              <p>Valid for dispensing across all licensed hospital & retail pharmacies.</p>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-lg text-blue-900 mb-1">
                {doctor.name}
              </div>
              <div className="w-40 border-t border-slate-400 ml-auto" />
              <div className="text-xs font-semibold text-slate-800 mt-1">Authorized Physician Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
