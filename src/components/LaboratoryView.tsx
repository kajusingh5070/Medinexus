import React, { useState } from "react";
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  Eye,
  Edit2,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { LabOrder, LabResultItem, Patient, Doctor } from "../types";
import { PrintableLabReport } from "./PrintableLabReport";

export const LaboratoryView: React.FC = () => {
  const {
    labOrders,
    patients,
    doctors,
    addLabOrder,
    updateLabOrderResults,
    normalizeAllLabParameters,
    searchTerm,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrderForResults, setSelectedOrderForResults] = useState<LabOrder | null>(null);
  const [viewingReport, setViewingReport] = useState<LabOrder | null>(null);

  // New Order Form
  const [orderFormData, setOrderFormData] = useState({
    patientId: patients[0]?.id || "",
    doctorId: doctors[0]?.id || "",
    testName: "Complete Blood Count (CBC)",
    category: "Hematology",
    sampleType: "Whole Blood (EDTA)",
    cost: 450,
    isUrgent: false,
    notes: "",
  });

  // Results Entry Form
  const [resultsList, setResultsList] = useState<LabResultItem[]>([]);
  const [technicianNotes, setTechnicianNotes] = useState("");

  const testCatalog = [
    { name: "Complete Blood Count (CBC)", category: "Hematology", sample: "Whole Blood (EDTA)", cost: 450 },
    { name: "Lipid Profile Panel", category: "Biochemistry", sample: "Serum (Fasting)", cost: 850 },
    { name: "Liver Function Test (LFT)", category: "Biochemistry", sample: "Serum", cost: 750 },
    { name: "Kidney Function & Electrolytes (KFT)", category: "Biochemistry", sample: "Serum", cost: 700 },
    { name: "Glycated Hemoglobin (HbA1c)", category: "Biochemistry", sample: "Whole Blood", cost: 550 },
    { name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology", sample: "Serum", cost: 650 },
    { name: "Cardiac Troponin I & CPK-MB", category: "Cardiology", sample: "Plasma", cost: 1400 },
    { name: "Digital Chest X-Ray (PA View)", category: "Radiology", sample: "Radiographic Scan", cost: 600 },
  ];

  const filteredOrders = labOrders.filter((order) => {
    const patient = patients.find((p) => p.id === order.patientId);
    const doctor = doctors.find((d) => d.id === order.doctorId);

    const matchesSearch =
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFormData.patientId || !orderFormData.testName) return;

    addLabOrder({
      patientId: orderFormData.patientId,
      doctorId: orderFormData.doctorId,
      orderDate: new Date().toISOString().split("T")[0],
      testName: orderFormData.testName,
      category: orderFormData.category,
      sampleType: orderFormData.sampleType,
      status: "Ordered",
      cost: orderFormData.cost,
      notes: orderFormData.notes,
      results: [],
    });

    setShowOrderModal(false);
  };

  const openResultsEntryModal = (order: LabOrder) => {
    setSelectedOrderForResults(order);
    setTechnicianNotes(order.notes || "Specimen processed and verified as per NABL standard controls.");

    if (order.results && order.results.length > 0) {
      setResultsList(order.results);
    } else {
      // Pre-populate with typical parameters based on test name
      if (order.testName.includes("CBC")) {
        setResultsList([
          { id: "1", parameter: "Hemoglobin", value: "13.8", unit: "g/dL", referenceRange: "13.0 - 17.0", isAbnormal: false },
          { id: "2", parameter: "Total Leukocyte Count (WBC)", value: "11800", unit: "/cumm", referenceRange: "4,000 - 11,000", isAbnormal: true },
          { id: "3", parameter: "Platelet Count", value: "245000", unit: "/cumm", referenceRange: "150,000 - 450,000", isAbnormal: false },
          { id: "4", parameter: "Packed Cell Volume (PCV)", value: "42.1", unit: "%", referenceRange: "40.0 - 50.0", isAbnormal: false },
        ]);
      } else if (order.testName.includes("Lipid")) {
        setResultsList([
          { id: "1", parameter: "Total Cholesterol", value: "235", unit: "mg/dL", referenceRange: "< 200", isAbnormal: true },
          { id: "2", parameter: "Triglycerides", value: "180", unit: "mg/dL", referenceRange: "< 150", isAbnormal: true },
          { id: "3", parameter: "HDL (Good) Cholesterol", value: "42", unit: "mg/dL", referenceRange: "> 40", isAbnormal: false },
          { id: "4", parameter: "LDL (Bad) Cholesterol", value: "148", unit: "mg/dL", referenceRange: "< 100", isAbnormal: true },
        ]);
      } else {
        setResultsList([
          { id: "1", parameter: "Primary Biological Parameter", value: "Normal", unit: "Index", referenceRange: "Negative / Normal", isAbnormal: false },
        ]);
      }
    }
  };

  const handleResultParamChange = (index: number, field: keyof LabResultItem, value: any) => {
    const updated = [...resultsList];
    updated[index] = { ...updated[index], [field]: value };
    setResultsList(updated);
  };

  const handleAddParamRow = () => {
    setResultsList([
      ...resultsList,
      {
        id: `p-${Date.now()}`,
        parameter: "New Parameter",
        value: "",
        unit: "mg/dL",
        referenceRange: "0 - 100",
        isAbnormal: false,
      },
    ]);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForResults) return;

    updateLabOrderResults(
      selectedOrderForResults.id,
      resultsList,
      technicianNotes
    );

    setSelectedOrderForResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Laboratory & Pathology Diagnostics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Requisition diagnostic panels, enter laboratory parameter values, and print verified NABL pathology reports.
          </p>
        </div>

        <button
          id="btn-order-lab-modal"
          onClick={() => {
            setOrderFormData({
              patientId: patients[0]?.id || "",
              doctorId: doctors[0]?.id || "",
              testName: "Complete Blood Count (CBC)",
              category: "Hematology",
              sampleType: "Whole Blood (EDTA)",
              cost: 450,
              isUrgent: false,
              notes: "",
            });
            setShowOrderModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Order Diagnostic Test</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "Ordered", "Sample Collected", "In-Analysis", "Completed", "Delivered"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status === "ALL" ? `All Investigations (${labOrders.length})` : status}
            </button>
          )
        )}
      </div>

      {/* Lab Orders List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Diagnostics Pipeline ({filteredOrders.length})
          </span>
          <span className="text-xs text-slate-400">
            Automated Barcode Verification
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No lab orders match the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const patient = patients.find((p) => p.id === order.patientId);
              const doctor = doctors.find((d) => d.id === order.doctorId);
              const hasAbnormal = order.results.some((r) => r.isAbnormal);

              return (
                <div
                  key={order.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {order.testName}
                        </span>
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({order.category})
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                        <span>
                          <strong>Patient:</strong> {patient?.name} ({patient?.mrn})
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Ref. Doctor:</strong> {doctor?.name || "Hospital Staff"}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">
                          Sample: {order.sampleType}
                        </span>
                      </div>

                      {order.results.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[11px] text-slate-600 font-mono">
                            {order.results.length} Parameters Evaluated
                          </span>
                          {hasAbnormal && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Abnormal Parameter Detected
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        order.status === "Completed" || order.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "In-Analysis"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>

                    {/* Enter Results button */}
                    <button
                      onClick={() => openResultsEntryModal(order)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Enter / Edit Diagnostic Results"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{order.results.length > 0 ? "Edit Results" : "Enter Results"}</span>
                    </button>

                    {/* Quick Normalize action if abnormal */}
                    {order.results.length > 0 && hasAbnormal && (
                      <button
                        onClick={() => normalizeAllLabParameters(order.id)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-emerald-200"
                        title="Set all parameters for this order into normal range"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Normalize</span>
                      </button>
                    )}

                    {/* View/Print Report button */}
                    {order.results.length > 0 && (
                      <button
                        onClick={() => setViewingReport(order)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Print Diagnostic Report"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Print Report</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Lab Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Order Diagnostic Laboratory Investigation
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Patient *
                </label>
                <select
                  required
                  value={orderFormData.patientId}
                  onChange={(e) => setOrderFormData({ ...orderFormData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Referring Physician *
                </label>
                <select
                  required
                  value={orderFormData.doctorId}
                  onChange={(e) => setOrderFormData({ ...orderFormData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Diagnostic Test *
                </label>
                <select
                  value={orderFormData.testName}
                  onChange={(e) => {
                    const selected = testCatalog.find((t) => t.name === e.target.value);
                    if (selected) {
                      setOrderFormData({
                        ...orderFormData,
                        testName: selected.name,
                        category: selected.category,
                        sampleType: selected.sample,
                        cost: selected.cost,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                >
                  {testCatalog.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} • {t.category} (₹{t.cost})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sample Type
                  </label>
                  <input
                    type="text"
                    value={orderFormData.sampleType}
                    onChange={(e) => setOrderFormData({ ...orderFormData, sampleType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Investigation Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={orderFormData.cost}
                    onChange={(e) => setOrderFormData({ ...orderFormData, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Indication / Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={orderFormData.notes}
                  onChange={(e) => setOrderFormData({ ...orderFormData, notes: e.target.value })}
                  placeholder="e.g. Fasting sample required, evaluate for infection markers."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Create Lab Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter / Edit Lab Results Modal */}
      {selectedOrderForResults && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Enter Laboratory Analysis Results
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedOrderForResults.testName} • Barcode: {selectedOrderForResults.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForResults(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-4 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Observed Biological Parameters
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResultsList(resultsList.map((r) => ({ ...r, isAbnormal: false })));
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
                    title="Mark all parameters as within normal range"
                  >
                    ⚡ Set All Normal
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddParamRow}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              </div>

              {/* Parameters Input Rows */}
              <div className="space-y-2 max-h-72 overflow-y-auto p-1">
                {resultsList.map((param, idx) => (
                  <div
                    key={param.id || idx}
                    className={`p-2.5 rounded-lg border grid grid-cols-1 sm:grid-cols-12 gap-2 items-center transition-colors ${
                      param.isAbnormal ? "bg-rose-50/40 border-rose-200" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-slate-400">Parameter Name</label>
                      <input
                        type="text"
                        value={param.parameter}
                        onChange={(e) => handleResultParamChange(idx, "parameter", e.target.value)}
                        className="w-full p-1 border border-slate-200 bg-white rounded font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400">Observed Value</label>
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => handleResultParamChange(idx, "value", e.target.value)}
                        className={`w-full p-1 border rounded font-mono font-bold ${
                          param.isAbnormal ? "border-rose-300 text-rose-700 bg-rose-50" : "border-slate-200 bg-white text-slate-900"
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400">Unit</label>
                      <input
                        type="text"
                        value={param.unit}
                        onChange={(e) => handleResultParamChange(idx, "unit", e.target.value)}
                        className="w-full p-1 border border-slate-200 bg-white rounded font-mono text-slate-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400">Ref Range</label>
                      <input
                        type="text"
                        value={param.referenceRange}
                        onChange={(e) => handleResultParamChange(idx, "referenceRange", e.target.value)}
                        className="w-full p-1 border border-slate-200 bg-white rounded font-mono text-slate-600"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center justify-end gap-1 pt-3">
                      <button
                        type="button"
                        onClick={() => handleResultParamChange(idx, "isAbnormal", false)}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors border ${
                          !param.isAbnormal
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResultParamChange(idx, "isAbnormal", true)}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors border ${
                          param.isAbnormal
                            ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-rose-50 hover:text-rose-700"
                        }`}
                      >
                        High/Abnormal
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pathologist Clinical Findings & Interpretation
                </label>
                <textarea
                  rows={2}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="Enter remarks, microscopic observations, and clinical advice."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForResults(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save & Validate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Report Modal */}
      {viewingReport && (
        <PrintableLabReport
          labOrder={viewingReport}
          patient={patients.find((p) => p.id === viewingReport.patientId) || patients[0]}
          doctor={doctors.find((d) => d.id === viewingReport.doctorId)}
          onClose={() => setViewingReport(null)}
        />
      )}
    </div>
  );
};
