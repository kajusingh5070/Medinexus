import React from "react";
import { LabOrder, Patient, Doctor } from "../types";
import { Printer, FlaskConical, AlertCircle, ShieldCheck } from "lucide-react";

interface Props {
  labOrder: LabOrder;
  patient: Patient;
  doctor?: Doctor;
  onClose: () => void;
}

export const PrintableLabReport: React.FC<Props> = ({
  labOrder,
  patient,
  doctor,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-8 my-8 print:border-none print:shadow-none print:m-0 print:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Print / Close Toolbar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            NABL Accredited Diagnostic Pathology Report
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Diagnostic Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Report Document Sheet */}
        <div className="space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-indigo-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-700 flex items-center justify-center text-white font-bold text-xl">
                <FlaskConical className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  MediNexus Central Clinical Laboratory
                </h1>
                <p className="text-xs text-slate-500">
                  Department of Biochemistry, Hematology, Pathology & Microbiology
                </p>
                <p className="text-[11px] text-slate-400">
                  NABL Accreditation No: MC-2849 • ISO 15189:2012 Certified Laboratory
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-900 rounded font-bold text-xs">
                CONFIDENTIAL REPORT
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Barcode: {labOrder.orderNumber}</p>
            </div>
          </div>

          {/* Patient & Sample Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Patient Name</span>
              <span className="font-bold text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">MRN / Age / Sex</span>
              <span className="font-mono font-semibold text-slate-800">{patient.mrn} • {patient.age}y/{patient.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Referring Doctor</span>
              <span className="font-semibold text-slate-800">{doctor ? doctor.name : "Hospital Attending Physician"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Sample Collected</span>
              <span className="font-semibold text-slate-800">{labOrder.orderDate} ({labOrder.sampleType})</span>
            </div>
          </div>

          {/* Test Name & Category */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                Diagnostic Investigation
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {labOrder.testName}
              </h2>
              <p className="text-xs text-slate-500">
                Category: {labOrder.category} • Method: Automated Spectrophotometry / Cell Counter
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Status: {labOrder.status}
              </span>
            </div>
          </div>

          {/* Parameter Results Table */}
          <div>
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Test Parameter</th>
                  <th className="p-2.5">Observed Value</th>
                  <th className="p-2.5">Unit</th>
                  <th className="p-2.5">Biological Reference Range</th>
                  <th className="p-2.5 text-center">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {labOrder.results.map((res, idx) => (
                  <tr
                    key={res.id || idx}
                    className={`hover:bg-slate-50 ${res.isAbnormal ? "bg-rose-50/50" : ""}`}
                  >
                    <td className="p-2.5 font-semibold text-slate-900">{res.parameter}</td>
                    <td className={`p-2.5 font-mono font-bold ${res.isAbnormal ? "text-rose-600" : "text-slate-800"}`}>
                      {res.value}
                    </td>
                    <td className="p-2.5 text-slate-500 font-mono">{res.unit}</td>
                    <td className="p-2.5 text-slate-600 font-mono">{res.referenceRange}</td>
                    <td className="p-2.5 text-center">
                      {res.isAbnormal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                          <AlertCircle className="w-3 h-3" /> ABNORMAL
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          NORMAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clinical Interpretation & Notes */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Pathologist Clinical Interpretation
            </div>
            <p className="text-slate-700 leading-relaxed">
              {labOrder.notes || "Specimen processed on automated clinical chemistry analyzer. Quality control standards within 2SD. Results correlate with clinical presentation."}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>NABL Quality Verified & Electronic Sign-off</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Analyzed by: Senior Medical Lab Technologist
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-indigo-900 mb-1">
                Dr. Rekha Verma, MD
              </div>
              <div className="w-40 border-t border-slate-400 ml-auto" />
              <div className="font-bold text-slate-800 mt-1">Consultant Pathologist</div>
              <div className="text-[10px] text-slate-400">Reg: NABL-PATH-10294</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
