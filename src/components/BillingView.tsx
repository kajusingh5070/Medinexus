import React, { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CreditCard,
  Printer,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  TrendingUp,
  Percent,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Invoice, InvoiceItem, PaymentMethod, PaymentStatus } from "../types";
import { PrintableInvoice } from "./PrintableInvoice";

export const BillingView: React.FC = () => {
  const {
    invoices,
    patients,
    addInvoice,
    recordPayment,
    searchTerm,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [recordingPaymentInvoice, setRecordingPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);
  const [paymentMethodInput, setPaymentMethodInput] = useState<PaymentMethod>("UPI");

  // New Invoice Form
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || "",
    paymentMethod: "Cash" as PaymentMethod,
    paymentStatus: "Pending" as PaymentStatus,
    discountPercent: 0,
    paidAmount: 0,
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: "item-1",
      description: "Specialist Physician Consultation Fee",
      category: "Consultation",
      quantity: 1,
      unitPrice: 1000,
      totalPrice: 1000,
    },
    {
      id: "item-2",
      description: "Diagnostic Blood Investigations (CBC & Lipid)",
      category: "Laboratory",
      quantity: 1,
      unitPrice: 1300,
      totalPrice: 1300,
    },
  ]);

  const filteredInvoices = invoices.filter((inv) => {
    const patient = patients.find((p) => p.id === inv.patientId);

    const matchesSearch =
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalPending = totalBilled - totalCollected;

  const handleAddItemRow = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: `item-${Date.now()}`,
        description: "Hospital Pharmacy Medication Package",
        category: "Pharmacy",
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const updated = [...invoiceItems];
    const item = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      item.totalPrice = Number(item.quantity) * Number(item.unitPrice);
    }
    updated[index] = item;
    setInvoiceItems(updated);
  };

  const subtotal = invoiceItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const tax = subtotal * 0.05; // 5% GST
  const discount = (subtotal * formData.discountPercent) / 100;
  const grandTotal = subtotal + tax - discount;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || invoiceItems.length === 0) return;

    const created = addInvoice({
      patientId: formData.patientId,
      date: new Date().toISOString().split("T")[0],
      items: invoiceItems,
      subtotal,
      tax,
      discount,
      grandTotal,
      paidAmount: formData.paymentStatus === "Paid" ? grandTotal : Number(formData.paidAmount),
      paymentStatus: formData.paymentStatus,
      paymentMethod: formData.paymentMethod,
    });

    setShowCreateModal(false);
    setViewingInvoice(created);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingPaymentInvoice || paymentAmountInput <= 0) return;

    recordPayment(
      recordingPaymentInvoice.id,
      paymentAmountInput,
      paymentMethodInput
    );

    setRecordingPaymentInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Billing, Invoicing & Payment Gateway
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate itemized tax invoices, record multi-modal payments (UPI, Cash, Card, Insurance TPA), and print receipts.
          </p>
        </div>

        <button
          id="btn-new-invoice-modal"
          onClick={() => {
            setFormData({
              patientId: patients[0]?.id || "",
              paymentMethod: "Cash",
              paymentStatus: "Pending",
              discountPercent: 0,
              paidAmount: 0,
            });
            setInvoiceItems([
              {
                id: "item-1",
                description: "Specialist Consultation Fee",
                category: "Consultation",
                quantity: 1,
                unitPrice: 1000,
                totalPrice: 1000,
              },
              {
                id: "item-2",
                description: "Diagnostic Blood Investigations (CBC)",
                category: "Laboratory",
                quantity: 1,
                unitPrice: 450,
                totalPrice: 450,
              },
            ]);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Tax Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Total Invoiced Billing
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ₹{totalBilled.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across {invoices.length} invoices</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">
            Total Revenue Collected
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Directly cleared & settled</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase">
            Pending Balances Due
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            ₹{totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Awaiting patient / TPA clearance</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "Paid", "Pending", "Partially Paid"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === status
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {status === "ALL" ? `All Invoices (${invoices.length})` : status}
          </button>
        ))}
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Hospital Invoice Ledger ({filteredInvoices.length})
          </span>
          <span className="text-xs text-slate-400">
            GST & TPA Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Invoice No. & Date</th>
                <th className="p-3">Patient Details</th>
                <th className="p-3">Itemized Breakdown</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Paid / Due</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const patient = patients.find((p) => p.id === inv.patientId);
                const due = inv.grandTotal - inv.paidAmount;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {inv.date}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        {patient?.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {patient?.mrn} • {patient?.phone}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-700">
                        {inv.items.length} Billable Services
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {inv.items.map((i) => i.description).join(", ")}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        ₹{inv.grandTotal.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        (Incl. 5% GST)
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-emerald-700 font-mono">
                        Paid: ₹{inv.paidAmount.toFixed(2)}
                      </div>
                      {due > 0 && (
                        <div className="font-bold text-rose-600 font-mono text-[11px]">
                          Due: ₹{due.toFixed(2)}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          inv.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.paymentStatus === "Partially Paid"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        via {inv.paymentMethod}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {due > 0 && (
                          <button
                            onClick={() => {
                              setRecordingPaymentInvoice(inv);
                              setPaymentAmountInput(due);
                              setPaymentMethodInput("UPI");
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition-colors cursor-pointer"
                            title="Collect Payment"
                          >
                            Collect ₹
                          </button>
                        )}
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                          title="Print Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Generate Hospital Tax Invoice
                </h3>
                <p className="text-xs text-slate-500">
                  Add itemized medical charges, medications, lab tests, and calculate taxes.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Patient *
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn}) • {p.admissionStatus}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Discount Concession (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Itemized Billing Services & Products
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {invoiceItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-400">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          className="w-full p-1 border border-slate-200 rounded font-medium"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                          className="w-full p-1 border border-slate-200 rounded bg-white"
                        >
                          <option value="Consultation">Consultation</option>
                          <option value="Bed Charges">Bed / Room</option>
                          <option value="Laboratory">Laboratory</option>
                          <option value="Pharmacy">Pharmacy</option>
                          <option value="Surgery / OT">Surgery / OT</option>
                          <option value="Nursing / Emergency">Nursing Care</option>
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-slate-400">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                          className="w-full p-1 border border-slate-200 rounded text-center font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400">Rate (₹)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                          className="w-full p-1 border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right font-mono font-bold text-slate-900 pt-3">
                        ₹{item.totalPrice}
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-center pt-3">
                        {invoiceItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Taxes calculation */}
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <div className="w-64 space-y-1 text-slate-600 text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5% GST):</span>
                      <span className="font-mono">₹{tax.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount ({formData.discountPercent}%):</span>
                        <span className="font-mono">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-300">
                      <span>Grand Total:</span>
                      <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="Paid">Fully Paid (100%)</option>
                    <option value="Pending">Pending / Unpaid</option>
                    <option value="Partially Paid">Partially Paid (Advance)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Insurance TPA">Insurance TPA Cashless</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                {formData.paymentStatus === "Partially Paid" && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Advance Paid Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                )}
              </div>

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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save & Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {recordingPaymentInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Collect Invoice Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Invoice #{recordingPaymentInvoice.invoiceNumber} • Grand Total: ₹{recordingPaymentInvoice.grandTotal.toFixed(2)}
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Collection Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={recordingPaymentInvoice.grandTotal - recordingPaymentInvoice.paidAmount}
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Mode *
                </label>
                <select
                  value={paymentMethodInput}
                  onChange={(e) => setPaymentMethodInput(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="UPI">UPI / Google Pay / PhonePe</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Credit Card">Credit / Debit Card POS</option>
                  <option value="Insurance TPA">Insurance TPA Settlement</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRecordingPaymentInvoice(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Confirm Payment Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Sheet View Modal */}
      {viewingInvoice && (
        <PrintableInvoice
          invoice={viewingInvoice}
          patient={
            patients.find((p) => p.id === viewingInvoice.patientId) ||
            patients[0]
          }
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
};
