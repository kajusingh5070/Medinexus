import React from "react";
import { Invoice, Patient } from "../types";
import { Printer, Receipt, CheckCircle, ShieldCheck } from "lucide-react";

interface Props {
  invoice: Invoice;
  patient: Patient;
  onClose: () => void;
}

export const PrintableInvoice: React.FC<Props> = ({
  invoice,
  patient,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const dueAmount = invoice.grandTotal - invoice.paidAmount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-8 my-8 print:border-none print:shadow-none print:m-0 print:p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Print / Close Toolbar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Hospital Final Invoicing & Tax Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice Document Sheet */}
        <div className="space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  MediNexus Super Specialty Hospital
                </h1>
                <p className="text-xs text-slate-500">
                  Registered Healthcare Institution • GSTIN: 27AABCM8899K1Z4
                </p>
                <p className="text-[11px] text-slate-400">
                  Plot 14-B, Healthcare Enclave, Central Avenue • Phone: +91 (022) 2890-5000
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">TAX INVOICE</div>
              <div className="font-mono text-xs font-bold text-emerald-700 mt-0.5">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {invoice.date}
              </div>
            </div>
          </div>

          {/* Billed To Patient Strip */}
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
              <span className="text-slate-400 text-[10px] uppercase block">Age / Gender / Contact</span>
              <span className="font-semibold text-slate-800">{patient.age}y / {patient.gender} • {patient.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Payment Status</span>
              <span className={`font-bold uppercase ${
                invoice.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"
              }`}>
                {invoice.paymentStatus} ({invoice.paymentMethod})
              </span>
            </div>
          </div>

          {/* Itemized Services Table */}
          <div>
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Service Description</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-center">Qty / Days</th>
                  <th className="p-2.5 text-right">Unit Rate (₹)</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{item.description}</td>
                    <td className="p-2.5 text-slate-500">{item.category}</td>
                    <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      {item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation Box */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Services & Meds):</span>
                <span className="font-mono">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Healthcare GST / Tax (5%):</span>
                <span className="font-mono">₹{invoice.tax.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Concession / Discount:</span>
                  <span className="font-mono">-₹{invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono text-base">₹{invoice.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-dashed border-slate-200">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-700">₹{invoice.paidAmount.toFixed(2)}</span>
              </div>
              {dueAmount > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{dueAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Bank Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            <div>
              <div className="font-bold text-slate-800 mb-1">Payment Instructions:</div>
              <p>UPI ID: <span className="font-mono text-slate-800">medinexus.hospital@icici</span></p>
              <p>Bank: HDFC Bank, Healthcare Branch, A/C: 50200012894102, IFSC: HDFC0001248</p>
            </div>

            <div className="text-right">
              <div className="font-semibold text-slate-800">MediNexus Billing Authority</div>
              <p className="text-[10px] mt-1">This is a system generated tax invoice with electronic signature validation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
