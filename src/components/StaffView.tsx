import React, { useState } from "react";
import {
  UserCog,
  UserPlus,
  Search,
  Filter,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  CheckCircle,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { StaffMember } from "../types";

export const StaffView: React.FC = () => {
  const { staff, addStaff, searchTerm } = useHospital();

  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [shiftFilter, setShiftFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "Nurse" as StaffMember["role"],
    department: "ICU & Critical Care",
    shift: "Morning (07:00 AM - 03:00 PM)" as StaffMember["shift"],
    phone: "",
    email: "",
    joiningDate: new Date().toISOString().split("T")[0],
    isActive: true,
  });

  const roles = [
    "ALL",
    "Nurse",
    "Head Nurse",
    "Lab Technician",
    "Pharmacist",
    "Receptionist",
    "Administrator",
    "Ward Attendant",
  ];

  const shifts = [
    "ALL",
    "Morning (07:00 AM - 03:00 PM)",
    "Evening (03:00 PM - 11:00 PM)",
    "Night (11:00 PM - 07:00 AM)",
    "General (09:00 AM - 05:00 PM)",
  ];

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "ALL" || s.role === roleFilter;
    const matchesShift = shiftFilter === "ALL" || s.shift.includes(shiftFilter.split(" ")[0]);

    return matchesSearch && matchesRole && matchesShift;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addStaff({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      shift: formData.shift,
      phone: formData.phone || "+91 98765 11111",
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@medinexus.org`,
      joiningDate: formData.joiningDate,
      isActive: formData.isActive,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Staff Directory & Shift Rosters
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain nursing staff, laboratory technicians, pharmacists, reception desk officers, and rotating shift schedules.
          </p>
        </div>

        <button
          id="btn-add-staff-modal"
          onClick={() => {
            setFormData({
              name: "",
              role: "Nurse",
              department: "ICU & Critical Care",
              shift: "Morning (07:00 AM - 03:00 PM)",
              phone: "",
              email: "",
              joiningDate: new Date().toISOString().split("T")[0],
              isActive: true,
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Hospital Staff</span>
        </button>
      </div>

      {/* Role & Shift Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === role
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {role === "ALL" ? `All Personnel (${staff.length})` : role}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {member.name}
                    </h3>
                    <div className="text-xs text-blue-600 font-medium">
                      {member.role}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                  {member.employeeCode}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{member.shift}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Joined: {member.joiningDate}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Duty
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Register New Hospital Staff
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
                  Full Staff Member Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sister Mary Joseph"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designation Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="Nurse">Nurse</option>
                    <option value="Head Nurse">Head Nurse</option>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Ward Attendant">Ward Attendant</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="ICU / OPD / Emergency"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Shift Roster
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Morning (07:00 AM - 03:00 PM)">Morning (07:00 AM - 03:00 PM)</option>
                  <option value="Evening (03:00 PM - 11:00 PM)">Evening (03:00 PM - 11:00 PM)</option>
                  <option value="Night (11:00 PM - 07:00 AM)">Night (11:00 PM - 07:00 AM)</option>
                  <option value="General (09:00 AM - 05:00 PM)">General (09:00 AM - 05:00 PM)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone
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
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@medinexus.org"
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
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
