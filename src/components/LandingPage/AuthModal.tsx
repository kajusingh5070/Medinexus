import React, { useState, useEffect } from "react";
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Building2,
  Pill,
  FlaskConical,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { useHospital, DEFAULT_DEMO_USERS } from "../../context/HospitalContext";
import { UserRole, AuthUser } from "../../types";
import { InteractiveHoverButton } from "./InteractiveHoverButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  initialRole = "admin",
}) => {
  const { login, currentRole, setCurrentRole } = useHospital();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<UserRole>(initialRole);
  const [regDepartment, setRegDepartment] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
      setRegRole(initialRole);
      // Pre-fill demo email
      const demo = DEFAULT_DEMO_USERS[initialRole];
      if (demo) {
        setLoginEmail(demo.email);
        setLoginPassword("medinexus2026");
      }
    }
  }, [initialRole]);

  if (!isOpen) return null;

  const handleRoleSelectForLogin = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEFAULT_DEMO_USERS[role];
    if (demo) {
      setLoginEmail(demo.email);
      setLoginPassword("medinexus2026");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }

    // Match with demo accounts or synthesize user
    const matchingDemo = Object.values(DEFAULT_DEMO_USERS).find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    const userToLogin: AuthUser = matchingDemo || {
      id: `usr-${Date.now()}`,
      name: loginEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: loginEmail,
      role: selectedRole,
      department: "Clinical Services",
      phone: "+91 98000 00000",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    login(userToLogin);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim()) {
      setRegError("Please enter your full name.");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setRegError("Please enter a valid hospital email address.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      department: regDepartment.trim() || "General Medicine",
      phone: regPhone.trim() || "+91 98765 00000",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setRegSuccess(true);
    setTimeout(() => {
      login(newUser);
      onClose();
    }, 800);
  };

  const rolePills: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: "admin", label: "Super Admin", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { role: "doctor", label: "Doctor (OPD)", icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { role: "receptionist", label: "Admissions & Beds", icon: <Building2 className="w-3.5 h-3.5" /> },
    { role: "pharmacist", label: "Pharmacist", icon: <Pill className="w-3.5 h-3.5" /> },
    { role: "lab_tech", label: "Pathology Tech", icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { role: "patient", label: "Patient", icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              MN
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {mode === "login" ? "Hospital Portal Sign In" : "Register Staff / Patient Account"}
              </h3>
              <p className="text-[11px] text-slate-500">
                MediNexus Smart Digital Healthcare Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons (Login vs Register) */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "login"
                ? "bg-white text-blue-600 shadow-2xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "register"
                ? "bg-white text-blue-600 shadow-2xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account / Register</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {mode === "login" ? (
            <div className="space-y-5">
              {/* 1-Click Demo Quick Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quick 1-Click Role Profiles
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Instant Demo
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {rolePills.map((p) => {
                    const isSelected = selectedRole === p.role;
                    return (
                      <button
                        key={p.role}
                        type="button"
                        onClick={() => handleRoleSelectForLogin(p.role)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 text-blue-800 shadow-2xs ring-1 ring-blue-500"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className={isSelected ? "text-blue-600" : "text-slate-500"}>
                          {p.icon}
                        </span>
                        <span className="truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address / Employee ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. admin@medinexus.org"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Default: <code className="font-mono text-slate-600">medinexus2026</code>
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Instant 1-Click Login CTA */}
                <div className="pt-2">
                  <InteractiveHoverButton
                    id="btn-modal-submit-login"
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    icon={<LogIn className="w-4 h-4" />}
                  >
                    Enter Hospital Dashboard as {DEFAULT_DEMO_USERS[selectedRole]?.name.split(" ")[0]}
                  </InteractiveHoverButton>
                </div>
              </form>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  New to MediNexus?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Register new account
                  </button>
                </span>
              </div>
            </div>
          ) : (
            /* Register Mode */
            <div className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Registration Successful!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Account created. Redirecting to your {regRole} clinical dashboard...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Dr. Kajal Singh"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@hospital.org"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98200 12345"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assign Hospital Role *
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">Super Administrator (Executive Office)</option>
                      <option value="doctor">Attending Physician / Doctor (OPD & Wards)</option>
                      <option value="receptionist">Admissions & Front Desk Receptionist</option>
                      <option value="pharmacist">Licensed Pharmacist (Dispensary)</option>
                      <option value="lab_tech">Clinical Pathology Laboratory Technician</option>
                      <option value="patient">Registered Patient (Self-Service)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department / Clinical Specialty
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="e.g. Cardiology, Inpatient Ward, Emergency"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <InteractiveHoverButton
                      id="btn-modal-submit-register"
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      icon={<UserPlus className="w-4 h-4" />}
                    >
                      Complete Registration & Open Dashboard
                    </InteractiveHoverButton>
                  </div>
                </form>
              )}

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign In instead
                  </button>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
