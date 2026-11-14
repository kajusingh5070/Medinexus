import React, { useState } from "react";
import {
  Pill,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  PackageCheck,
  TrendingDown,
  RefreshCw,
  Minus,
  CheckCircle,
  Tag,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { PharmacyItem } from "../types";

export const PharmacyView: React.FC = () => {
  const {
    pharmacyItems,
    addPharmacyItem,
    updatePharmacyStock,
    quickRestockItem,
    searchTerm,
  } = useHospital();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispenseItem, setDispenseItem] = useState<PharmacyItem | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [restockItem, setRestockItem] = useState<PharmacyItem | null>(null);
  const [restockQty, setRestockQty] = useState(50);

  // New Item Form
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    category: "Antibiotics",
    dosageForm: "Tablet",
    strength: "500 mg",
    stockQuantity: 100,
    minStockLevel: 20,
    unitPrice: 15.0,
    batchNumber: "BAT-2026-99",
    expiryDate: "2027-12-31",
    manufacturer: "Sun Pharma / Cipla",
    rackLocation: "Rack A-04",
  });

  const categories = [
    "ALL",
    "Antibiotics",
    "Analgesics & Antipyretics",
    "Cardiovascular",
    "Antidiabetic",
    "Respiratory",
    "Gastrointestinal",
    "IV Fluids & Critical",
  ];

  const filteredItems = pharmacyItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const lowStockItems = pharmacyItems.filter(
    (item) => item.stockQuantity <= item.minStockLevel
  );

  const totalInventoryValue = pharmacyItems.reduce(
    (acc, item) => acc + item.stockQuantity * item.unitPrice,
    0
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addPharmacyItem({
      name: formData.name,
      genericName: formData.genericName,
      category: formData.category,
      dosageForm: formData.dosageForm,
      strength: formData.strength,
      stockQuantity: Number(formData.stockQuantity),
      minStockLevel: Number(formData.minStockLevel),
      unitPrice: Number(formData.unitPrice),
      batchNumber: formData.batchNumber,
      expiryDate: formData.expiryDate,
      manufacturer: formData.manufacturer,
      rackLocation: formData.rackLocation,
    });

    setShowAddModal(false);
  };

  const handleDispenseConfirm = () => {
    if (!dispenseItem) return;
    updatePharmacyStock(dispenseItem.id, -dispenseQty);
    setDispenseItem(null);
    setDispenseQty(1);
  };

  const handleRestockConfirm = () => {
    if (!restockItem) return;
    updatePharmacyStock(restockItem.id, restockQty);
    setRestockItem(null);
    setRestockQty(50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Pharmacy & Formulary Inventory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time batch tracking, expiration monitoring, automated re-order triggers, and point-of-care dispensing.
          </p>
        </div>

        <button
          id="btn-add-medicine-modal"
          onClick={() => {
            setFormData({
              name: "",
              genericName: "",
              category: "Antibiotics",
              dosageForm: "Tablet",
              strength: "500 mg",
              stockQuantity: 100,
              minStockLevel: 25,
              unitPrice: 18.5,
              batchNumber: `BAT-2026-${Math.floor(100 + Math.random() * 900)}`,
              expiryDate: "2028-06-30",
              manufacturer: "Torrent Pharma",
              rackLocation: "Rack C-02",
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Formulary Drug</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Total Inventory SKUs
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {pharmacyItems.length} Drugs
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across 8 therapeutic categories
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock Alerts
            </span>
            {lowStockItems.length > 0 && (
              <button
                onClick={() => {
                  lowStockItems.forEach((item) => quickRestockItem(item.id, 100));
                }}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                title="Restock all critical drugs in 1-click"
              >
                ⚡ Replenish All (+100)
              </button>
            )}
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {lowStockItems.length} Items
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {lowStockItems.length > 0
              ? "Click 'Replenish All' to restock all low inventory instantly"
              : "All formulary items are at safe threshold levels"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">
            Current Stock Asset Value
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ₹{Math.round(totalInventoryValue).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            At active wholesale purchase valuation
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              categoryFilter === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat === "ALL" ? `All Categories (${pharmacyItems.length})` : cat}
          </button>
        ))}
      </div>

      {/* Pharmacy Stock Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Formulary Inventory Catalog ({filteredItems.length})
          </span>
          <span className="text-xs text-slate-400">
            Auto Batch Tracking Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Medication Name & Generic</th>
                <th className="p-3">Category</th>
                <th className="p-3">Batch & Rack</th>
                <th className="p-3">Stock Units</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.stockQuantity <= item.minStockLevel;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.genericName}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.dosageForm} • {item.strength} • {item.manufacturer}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-slate-800">{item.batchNumber}</div>
                      <div className="text-[11px] text-slate-400">{item.rackLocation}</div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold font-mono text-sm ${
                            isLow ? "text-rose-600 font-extrabold" : "text-slate-900"
                          }`}
                        >
                          {item.stockQuantity}
                        </span>
                        {isLow && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold uppercase">
                            Low
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Min threshold: {item.minStockLevel}
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-slate-900">
                      ₹{item.unitPrice.toFixed(2)}
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-slate-700">{item.expiryDate}</span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLow && (
                          <button
                            onClick={() => quickRestockItem(item.id, 100)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition-colors cursor-pointer text-[11px] flex items-center gap-1 border border-amber-200 shadow-2xs"
                            title="Instant 1-Click Restock +100 Units"
                          >
                            <span>⚡ +100</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setDispenseItem(item);
                            setDispenseQty(1);
                          }}
                          disabled={item.stockQuantity <= 0}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                          title="Dispense to Patient"
                        >
                          Dispense
                        </button>
                        <button
                          onClick={() => {
                            setRestockItem(item);
                            setRestockQty(50);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition-colors cursor-pointer"
                          title="Custom Restock Inventory"
                        >
                          Restock
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

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Register New Drug into Formulary
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Augmentin 625 Duo"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Generic Chemical Name
                  </label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="Amoxicillin + Clavulanic Acid"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Therapeutic Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    {categories.filter((c) => c !== "ALL").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dosage Form & Strength
                  </label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g. 625 mg Tablet / 100ml Syrup"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unit Retail Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Stock Count (Units)
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Storage Rack Location
                  </label>
                  <input
                    type="text"
                    value={formData.rackLocation}
                    onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save Drug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {dispenseItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Dispense Medication
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {dispenseItem.name} ({dispenseItem.strength}) • Current Stock: {dispenseItem.stockQuantity}
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity to Dispense (Units)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDispenseQty(Math.max(1, dispenseQty - 1))}
                    className="p-2 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={dispenseItem.stockQuantity}
                    value={dispenseQty}
                    onChange={(e) => setDispenseQty(Number(e.target.value))}
                    className="w-24 text-center font-bold font-mono text-base p-2 border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => setDispenseQty(Math.min(dispenseItem.stockQuantity, dispenseQty + 1))}
                    className="p-2 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between">
                <span>Calculated Amount:</span>
                <span className="font-bold text-slate-900">
                  ₹{(dispenseQty * dispenseItem.unitPrice).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDispenseItem(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDispenseConfirm}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Confirm Dispense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Replenish Pharmacy Inventory
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {restockItem.name} • Batch: {restockItem.batchNumber}
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Received Quantity from Supplier
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {[25, 50, 100, 250, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRestockQty(preset)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                        restockQty === preset
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none font-bold text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRestockItem(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestockConfirm}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Add to Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
