import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Patient,
  Doctor,
  Appointment,
  Prescription,
  LabOrder,
  LabResultItem,
  PharmacyItem,
  Bed,
  Invoice,
  StaffMember,
  HospitalNotification,
  UserRole,
  VitalRecord,
  PaymentMethod,
  AuthUser,
} from "../types";
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_ORDERS,
  INITIAL_PHARMACY_ITEMS,
  INITIAL_BEDS,
  INITIAL_INVOICES,
  INITIAL_STAFF,
  INITIAL_NOTIFICATIONS,
} from "../data/mockHospitalData";

interface HospitalContextType {
  // Authentication & Session
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: "login" | "register";
  setAuthModalMode: (mode: "login" | "register") => void;
  openAuthModal: (mode?: "login" | "register", prefilledRole?: UserRole) => void;
  closeAuthModal: () => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;

  // State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  pharmacyItems: PharmacyItem[];
  beds: Bed[];
  invoices: Invoice[];
  staff: StaffMember[];
  staffList: StaffMember[];
  notifications: HospitalNotification[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // Actions
  addPatient: (patient: Omit<Patient, "id" | "mrn" | "vitals"> & { initialVitals?: Partial<VitalRecord> }) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addPatientVitals: (patientId: string, vitals: Omit<VitalRecord, "id" | "recordedAt">) => void;

  addDoctor: (doctor: Omit<Doctor, "id">) => void;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;

  addAppointment: (apt: Omit<Appointment, "id" | "appointmentNumber" | "createdAt">) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment["status"], diagnosis?: string) => void;

  addPrescription: (rx: Omit<Prescription, "id" | "prescriptionNumber">) => Prescription;

  addLabOrder: (order: Omit<LabOrder, "id" | "orderNumber">) => LabOrder;
  updateLabOrderResults: (id: string, results: LabResultItem[], notes?: string) => void;
  updateLabOrderStatus: (id: string, status: LabOrder["status"], remarks?: string) => void;
  normalizeAllLabParameters: (orderId: string) => void;

  addPharmacyItem: (item: Omit<PharmacyItem, "id">) => void;
  updatePharmacyStock: (id: string, deltaQty: number) => void;
  dispenseMedication: (itemCodeOrName: string, quantity: number) => boolean;
  quickRestockItem: (id: string, qty?: number) => void;

  assignBed: (bedId: string, patientId: string, doctorId?: string) => void;
  assignBedToPatient: (patientId: string, bedId: string, doctorId?: string) => void;
  dischargeBed: (bedId: string) => void;
  sanitizeBed: (bedId: string) => void;
  transferBed: (patientId: string, fromBedId: string, toBedId: string) => void;
  updateBedStatus: (bedId: string, status: Bed["status"]) => void;

  addInvoice: (inv: Omit<Invoice, "id" | "invoiceNumber">) => Invoice;
  markInvoicePaid: (id: string, method: PaymentMethod, ref?: string, amount?: number) => void;
  recordPayment: (id: string, amount: number, method: PaymentMethod) => void;

  addStaff: (stf: Omit<StaffMember, "id" | "employeeCode">) => void;
  updateStaffStatus: (id: string, isActive: boolean) => void;

  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToSampleData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const DEFAULT_DEMO_USERS: Record<UserRole, AuthUser> = {
  admin: {
    id: "usr-admin-01",
    name: "Dr. Alistair Vance",
    email: "admin@medinexus.org",
    role: "admin",
    department: "Executive Medical Administration",
    phone: "+91 98201 44552",
    joinedAt: "2024-01-15",
  },
  doctor: {
    id: "usr-doc-01",
    name: "Dr. Sarah Jenkins, MD",
    email: "dr.jenkins@medinexus.org",
    role: "doctor",
    department: "Cardiology & Intensive Care",
    phone: "+91 98334 11223",
    joinedAt: "2024-03-10",
  },
  receptionist: {
    id: "usr-rec-01",
    name: "Emily Watson",
    email: "admissions@medinexus.org",
    role: "receptionist",
    department: "Front Desk & Bed Triage",
    phone: "+91 98450 88776",
    joinedAt: "2024-05-01",
  },
  pharmacist: {
    id: "usr-phm-01",
    name: "David Chen, R.Ph.",
    email: "pharmacy@medinexus.org",
    role: "pharmacist",
    department: "Central Formulary & Dispensary",
    phone: "+91 98221 33445",
    joinedAt: "2024-02-20",
  },
  lab_tech: {
    id: "usr-lab-01",
    name: "Dr. Marcus Thorne, Ph.D.",
    email: "pathology@medinexus.org",
    role: "lab_tech",
    department: "NABL Clinical Pathology Lab",
    phone: "+91 98112 55667",
    joinedAt: "2024-04-12",
  },
  patient: {
    id: "usr-pat-01",
    name: "Eleanor Vance",
    email: "patient.vance@medinexus.org",
    role: "patient",
    department: "Outpatient Services",
    phone: "+91 98765 43210",
    joinedAt: "2025-01-08",
  },
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state initialized from localStorage
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("medinexus_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedAuth = localStorage.getItem("medinexus_auth_user");
    if (savedAuth) {
      try {
        const u = JSON.parse(savedAuth);
        if (u?.role) return u.role as UserRole;
      } catch (e) {
        // ignore
      }
    }
    return (localStorage.getItem("medinexus_role") as UserRole) || "admin";
  });

  const isAuthenticated = !!authUser;

  const login = (user: AuthUser) => {
    setAuthUser(user);
    setCurrentRole(user.role);
    setShowLandingPage(false);
    setShowAuthModal(false);
    localStorage.setItem("medinexus_auth_user", JSON.stringify(user));
    localStorage.setItem("medinexus_role", user.role);
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem("medinexus_auth_user");
    setShowLandingPage(true);
    setActiveView("dashboard");
  };

  const openAuthModal = (mode: "login" | "register" = "login", prefilledRole?: UserRole) => {
    setAuthModalMode(mode);
    if (prefilledRole) {
      setCurrentRole(prefilledRole);
    }
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const [activeView, setActiveView] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Core records initialized from localStorage or mock
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem("medinexus_patients");
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem("medinexus_doctors");
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("medinexus_appointments");
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem("medinexus_prescriptions");
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem("medinexus_lab_orders");
    return saved ? JSON.parse(saved) : INITIAL_LAB_ORDERS;
  });

  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>(() => {
    const saved = localStorage.getItem("medinexus_pharmacy");
    return saved ? JSON.parse(saved) : INITIAL_PHARMACY_ITEMS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem("medinexus_beds");
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem("medinexus_invoices");
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem("medinexus_staff");
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [notifications, setNotifications] = useState<HospitalNotification[]>(() => {
    const saved = localStorage.getItem("medinexus_notifs");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("medinexus_role", currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem("medinexus_patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("medinexus_doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("medinexus_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("medinexus_prescriptions", JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem("medinexus_lab_orders", JSON.stringify(labOrders));
  }, [labOrders]);

  useEffect(() => {
    localStorage.setItem("medinexus_pharmacy", JSON.stringify(pharmacyItems));
  }, [pharmacyItems]);

  useEffect(() => {
    localStorage.setItem("medinexus_beds", JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem("medinexus_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("medinexus_staff", JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem("medinexus_notifs", JSON.stringify(notifications));
  }, [notifications]);

  // Helper push notification
  const notify = (title: string, message: string, type: HospitalNotification["type"] = "info") => {
    const newNotif: HospitalNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: "Just now",
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Patients Actions
  const addPatient = (
    data: Omit<Patient, "id" | "mrn" | "vitals"> & { initialVitals?: Partial<VitalRecord> }
  ): Patient => {
    const nextSeq = patients.length + 1001;
    const mrn = `MN-${new Date().getFullYear()}-${nextSeq}`;
    const id = `pt-${Date.now()}`;

    const vitalsList: VitalRecord[] = [];
    if (data.initialVitals?.bp) {
      vitalsList.push({
        id: `vit-${Date.now()}`,
        bp: data.initialVitals.bp || "120/80",
        pulse: data.initialVitals.pulse || 72,
        spO2: data.initialVitals.spO2 || 99,
        temperature: data.initialVitals.temperature || 98.4,
        respiratoryRate: data.initialVitals.respiratoryRate || 16,
        weight: data.initialVitals.weight || 65,
        height: data.initialVitals.height || 168,
        recordedAt: new Date().toLocaleString(),
        recordedBy: "Registration Desk",
      });
    }

    const newPatient: Patient = {
      ...data,
      id,
      mrn,
      vitals: vitalsList,
    };

    setPatients((prev) => [newPatient, ...prev]);
    notify("Patient Registered", `${newPatient.name} registered successfully with MRN ${mrn}.`, "success");
    return newPatient;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    notify("Patient Updated", "Patient record updated successfully.", "info");
  };

  const deletePatient = (id: string) => {
    // Free any beds occupied by this patient
    setBeds((prev) =>
      prev.map((b) =>
        b.currentPatientId === id
          ? {
              ...b,
              status: "Available",
              currentPatientId: undefined,
              assignedDoctorId: undefined,
              admissionDate: undefined,
              admittedAt: undefined,
            }
          : b
      )
    );
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (selectedPatientId === id) {
      setSelectedPatientId(null);
    }
    notify("Patient Record Deleted", "Patient record has been safely removed.", "warning");
  };

  const addPatientVitals = (patientId: string, vitalsData: Omit<VitalRecord, "id" | "recordedAt">) => {
    const newRecord: VitalRecord = {
      ...vitalsData,
      id: `vit-${Date.now()}`,
      recordedAt: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            vitals: [newRecord, ...p.vitals],
          };
        }
        return p;
      })
    );
    notify("Vitals Recorded", "New vital signs successfully added to clinical chart.", "info");
  };

  // Doctors Actions
  const addDoctor = (doc: Omit<Doctor, "id">) => {
    const newDoc: Doctor = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setDoctors((prev) => [...prev, newDoc]);
    notify("Doctor Added", `${newDoc.name} joined ${newDoc.department}.`, "success");
  };

  const updateDoctor = (id: string, data: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  };

  // Appointments Actions
  const addAppointment = (aptData: Omit<Appointment, "id" | "appointmentNumber" | "createdAt">): Appointment => {
    const aptNumber = `APT-${new Date().getFullYear()}-${appointments.length + 401}`;
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
      createdAt: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
    };
    setAppointments((prev) => [newApt, ...prev]);
    notify("Appointment Booked", `Appointment ${aptNumber} scheduled for ${newApt.date}.`, "success");
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"], diagnosis?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status, ...(diagnosis ? { diagnosis } : {}) } : apt
      )
    );
    notify("Appointment Updated", `Status updated to ${status}.`, "info");
  };

  // Prescriptions Actions
  const addPrescription = (rxData: Omit<Prescription, "id" | "prescriptionNumber">): Prescription => {
    const rxNumber = `RX-${new Date().getFullYear()}-${prescriptions.length + 701}`;
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
    };
    setPrescriptions((prev) => [newRx, ...prev]);

    // Also deduct pharmacy stock if matched
    rxData.medications.forEach((med) => {
      dispenseMedication(med.name, 1);
    });

    notify("Prescription Generated", `Prescription ${rxNumber} generated & sent to pharmacy.`, "success");
    return newRx;
  };

  // Lab Orders
  const addLabOrder = (orderData: Omit<LabOrder, "id" | "orderNumber">): LabOrder => {
    const orderNumber = `LAB-${new Date().getFullYear()}-${labOrders.length + 501}`;
    const newOrder: LabOrder = {
      ...orderData,
      id: `lab-${Date.now()}`,
      orderNumber,
    };
    setLabOrders((prev) => [newOrder, ...prev]);
    notify("Lab Test Ordered", `${newOrder.testName} booked for processing.`, "info");
    return newOrder;
  };

  const updateLabOrderResults = (id: string, results: LabResultItem[], notes?: string) => {
    setLabOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              results,
              status: "Completed",
              completedAt: new Date().toLocaleString(),
              ...(notes ? { notes } : {}),
            }
          : order
      )
    );
    notify("Lab Results Verified", "Diagnostic investigation report is now completed and available.", "success");
  };

  const updateLabOrderStatus = (
    id: string,
    status: LabOrder["status"],
    remarks?: string
  ) => {
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            status,
            ...(remarks ? { notes: remarks } : {}),
            ...(status === "Sample Collected" && !order.sampleCollectedAt
              ? { sampleCollectedAt: new Date().toLocaleString() }
              : {}),
            ...(status === "Completed" && !order.completedAt
              ? { completedAt: new Date().toLocaleString() }
              : {}),
          };
        }
        return order;
      })
    );
    notify("Lab Status Updated", `Diagnostic Order marked as ${status}.`, "success");
  };

  const normalizeAllLabParameters = (orderId: string) => {
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            results: order.results.map((r) => ({
              ...r,
              isAbnormal: false,
            })),
            notes: (order.notes || "") + "\nAll clinical parameters verified within normal physiological thresholds.",
          };
        }
        return order;
      })
    );
    notify("Parameters Normalized", "All diagnostic values set to optimal normal reference range.", "success");
  };

  // Pharmacy Actions
  const addPharmacyItem = (item: Omit<PharmacyItem, "id">) => {
    const newItem: PharmacyItem = {
      ...item,
      id: `med-${Date.now()}`,
    };
    setPharmacyItems((prev) => [...prev, newItem]);
    notify("Medicine Added", `${newItem.name} added to pharmacy inventory.`, "success");
  };

  const updatePharmacyStock = (id: string, deltaQty: number) => {
    setPharmacyItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.stockQuantity + deltaQty);
          return { ...item, stockQuantity: newQty };
        }
        return item;
      })
    );
  };

  const quickRestockItem = (id: string, qty: number = 100) => {
    setPharmacyItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, stockQuantity: item.stockQuantity + qty };
        }
        return item;
      })
    );
    notify("Stock Replenished", `Added +${qty} units to inventory stock.`, "success");
  };

  const dispenseMedication = (itemCodeOrName: string, quantity: number): boolean => {
    let found = false;
    setPharmacyItems((prev) =>
      prev.map((item) => {
        if (
          item.code.toLowerCase() === itemCodeOrName.toLowerCase() ||
          item.name.toLowerCase().includes(itemCodeOrName.toLowerCase()) ||
          itemCodeOrName.toLowerCase().includes(item.name.toLowerCase())
        ) {
          found = true;
          return {
            ...item,
            stockQuantity: Math.max(0, item.stockQuantity - quantity),
          };
        }
        return item;
      })
    );
    return found;
  };

  // Beds Actions
  const assignBed = (bedId: string, patientId: string, doctorId?: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: "Occupied",
              currentPatientId: patientId,
              assignedDoctorId: doctorId,
              admissionDate: new Date().toISOString().split("T")[0],
              admittedAt: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
            }
          : b
      )
    );

    // Update patient status to Inpatient
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, admissionStatus: "Inpatient", assignedBedId: bedId, assignedDoctorId: doctorId || p.assignedDoctorId }
          : p
      )
    );

    notify("Bed Allocated", "Patient assigned to bed successfully.", "success");
  };

  const assignBedToPatient = (patientId: string, bedId: string, doctorId?: string) => {
    assignBed(bedId, patientId, doctorId);
  };

  const dischargeBed = (bedId: string) => {
    const targetBed = beds.find((b) => b.id === bedId);
    if (targetBed?.currentPatientId) {
      const pId = targetBed.currentPatientId;
      setPatients((prev) =>
        prev.map((p) =>
          p.id === pId
            ? { ...p, admissionStatus: "Discharged", dischargeDate: new Date().toISOString().split("T")[0], assignedBedId: undefined }
            : p
        )
      );
    }

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: "Cleaning",
              currentPatientId: undefined,
              assignedDoctorId: undefined,
              admissionDate: undefined,
              admittedAt: undefined,
            }
          : b
      )
    );

    notify("Bed Discharged", "Bed marked for cleaning/sanitization.", "info");
  };

  const sanitizeBed = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: "Available",
              currentPatientId: undefined,
              assignedDoctorId: undefined,
              admissionDate: undefined,
              admittedAt: undefined,
            }
          : b
      )
    );
    notify("Bed Sanitized", "Bed is now Available for patient admission.", "success");
  };

  const transferBed = (patientId: string, fromBedId: string, toBedId: string) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === fromBedId) {
          return {
            ...b,
            status: "Cleaning",
            currentPatientId: undefined,
            assignedDoctorId: undefined,
            admissionDate: undefined,
            admittedAt: undefined,
          };
        }
        if (b.id === toBedId) {
          return {
            ...b,
            status: "Occupied",
            currentPatientId: patientId,
            admissionDate: new Date().toISOString().split("T")[0],
            admittedAt: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
          };
        }
        return b;
      })
    );

    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, assignedBedId: toBedId } : p))
    );

    notify("Bed Transferred", "Patient relocated to new ward bed.", "info");
  };

  const updateBedStatus = (bedId: string, status: Bed["status"]) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status } : b))
    );
  };

  // Invoices Actions
  const addInvoice = (invData: Omit<Invoice, "id" | "invoiceNumber">): Invoice => {
    const invNumber = `INV-${new Date().getFullYear()}-${invoices.length + 801}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
    };
    setInvoices((prev) => [newInv, ...prev]);
    notify("Invoice Created", `Invoice ${invNumber} generated for patient.`, "success");
    return newInv;
  };

  const markInvoicePaid = (
    id: string,
    method: PaymentMethod = "UPI",
    ref?: string,
    amount?: number
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const finalPaid = amount !== undefined ? amount : inv.grandTotal;
          const status = finalPaid >= inv.grandTotal ? "Paid" : "Partially Paid";
          return {
            ...inv,
            paymentStatus: status,
            paymentMethod: method,
            transactionRef: ref || `TXN-${Date.now().toString().slice(-6)}`,
            paidAmount: finalPaid,
          };
        }
        return inv;
      })
    );
    notify("Payment Recorded", `Invoice payment recorded successfully.`, "success");
  };

  const recordPayment = (id: string, amount: number, method: PaymentMethod) => {
    markInvoicePaid(id, method, undefined, amount);
  };

  // Staff Actions
  const addStaff = (stf: Omit<StaffMember, "id" | "employeeCode">) => {
    const newStaff: StaffMember = {
      ...stf,
      id: `stf-${Date.now()}`,
      employeeCode: `MN-STF-0${staffList.length + 1}`,
    };
    setStaffList((prev) => [...prev, newStaff]);
    notify("Staff Enrolled", `${newStaff.name} registered to ${newStaff.department}.`, "success");
  };

  const updateStaffStatus = (id: string, isActive: boolean) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive } : s))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToSampleData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setLabOrders(INITIAL_LAB_ORDERS);
    setPharmacyItems(INITIAL_PHARMACY_ITEMS);
    setBeds(INITIAL_BEDS);
    setInvoices(INITIAL_INVOICES);
    setStaffList(INITIAL_STAFF);
    setNotifications(INITIAL_NOTIFICATIONS);
    notify("System Reset", "Demo data restored to pristine state.", "info");
  };

  return (
    <HospitalContext.Provider
      value={{
        authUser,
        isAuthenticated,
        login,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        showLandingPage,
        setShowLandingPage,

        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        patients,
        doctors,
        appointments,
        prescriptions,
        labOrders,
        pharmacyItems,
        beds,
        invoices,
        staff: staffList,
        staffList,
        notifications,
        searchTerm,
        setSearchTerm,
        selectedPatientId,
        setSelectedPatientId,

        addPatient,
        updatePatient,
        deletePatient,
        addPatientVitals,

        addDoctor,
        updateDoctor,

        addAppointment,
        updateAppointmentStatus,

        addPrescription,

        addLabOrder,
        updateLabOrderResults,
        updateLabOrderStatus,
        normalizeAllLabParameters,

        addPharmacyItem,
        updatePharmacyStock,
        dispenseMedication,
        quickRestockItem,

        assignBed,
        assignBedToPatient,
        dischargeBed,
        sanitizeBed,
        transferBed,
        updateBedStatus,

        addInvoice,
        markInvoicePaid,
        recordPayment,

        addStaff,
        updateStaffStatus,

        markNotificationRead,
        clearAllNotifications,
        resetToSampleData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
