export type UserRole =
  | "admin"
  | "doctor"
  | "receptionist"
  | "pharmacist"
  | "lab_tech"
  | "patient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  joinedAt: string;
}

export type AdmissionStatus = "OPD" | "Inpatient" | "Emergency" | "Discharged";

export interface VitalRecord {
  id: string;
  bp: string; // e.g. "120/80"
  pulse: number; // bpm
  spO2: number; // %
  temperature: number; // °F
  respiratoryRate: number; // bpm
  weight: number; // kg
  height?: number; // cm
  recordedAt: string;
  recordedBy: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number e.g. "MN-2026-104"
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  admissionStatus: AdmissionStatus;
  assignedDoctorId?: string;
  assignedBedId?: string;
  admissionDate: string;
  dischargeDate?: string;
  allergies: string[];
  chronicConditions: string[];
  medicalHistory: string[];
  vitals: VitalRecord[];
  notes: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  phone: string;
  email: string;
  availableDays: string[];
  availableHours: string;
  status: "Available" | "In Consultation" | "On Leave" | "Emergency Duty";
  roomNumber: string;
  rating: number;
  avatarUrl?: string;
}

export type AppointmentStatus =
  | "Scheduled"
  | "In-Progress"
  | "Completed"
  | "Cancelled"
  | "No-Show";

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  type: "OPD Consultation" | "Follow-up" | "Emergency" | "Routine Checkup" | "Telehealth";
  status: AppointmentStatus;
  symptoms: string;
  diagnosis?: string;
  fee: number;
  notes?: string;
  createdAt: string;
}

export interface PrescribedMedicine {
  id?: string;
  medicineId?: string;
  name: string;
  dosage: string; // e.g. "500 mg"
  frequency:
    | "Once Daily (1-0-0)"
    | "Twice Daily (1-0-1)"
    | "Thrice Daily (1-1-1)"
    | "Four Times (1-1-1-1)"
    | "As Needed (SOS)"
    | "Once at Bedtime (0-0-1)"
    | string;
  duration: string; // e.g. "5 Days"
  timing: "Before Meals" | "After Meals" | "With Meals" | "Empty Stomach" | string;
  instructions: string;
}

export type PrescribedMedication = PrescribedMedicine;

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnoses: string[];
  symptomsRecorded: string;
  medications: PrescribedMedicine[];
  labTestsRecommended: string[];
  dietAdvice: string;
  followUpDays: number;
  attendingDoctorNotes: string;
}

export type LabOrderStatus =
  | "Sample Pending"
  | "Sample Collected"
  | "Processing"
  | "In-Analysis"
  | "Completed"
  | "Delivered"
  | "Ordered";

export interface LabResultItem {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabParameterResult {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "Normal" | "High" | "Low" | "Critical";
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  doctorId: string;
  testName: string;
  category: string;
  sampleType: string;
  orderDate: string;
  sampleCollectedAt?: string;
  completedAt?: string;
  status: string;
  cost: number;
  results: LabResultItem[];
  notes?: string;
}

export type LabTestOrder = LabOrder;

export interface PharmacyItem {
  id: string;
  code: string; // e.g. "MED-101"
  name: string;
  genericName: string;
  category:
    | "Antibiotics"
    | "Analgesics & Pain"
    | "Cardiovascular"
    | "Antidiabetic"
    | "Respiratory"
    | "Gastrointestinal"
    | "Vitamins & Minerals"
    | "IV Fluids & Injectables"
    | string;
  dosageForm:
    | "Tablet"
    | "Syrup"
    | "Capsule"
    | "Injection"
    | "Ointment"
    | "Inhaler"
    | "IV Bottle"
    | string;
  stockQuantity: number;
  minStockLevel: number;
  unitPrice: number;
  costPrice: number;
  batchNumber: string;
  expiryDate: string;
  manufacturer: string;
  rackLocation: string;
}

export type WardType =
  | "Intensive Care Unit (ICU)"
  | "General Ward (Male)"
  | "General Ward (Female)"
  | "Emergency Triage"
  | "Deluxe Private Suite"
  | "Post-Op Recovery"
  | "ICU"
  | "Semi-Private"
  | "Deluxe Suite"
  | "Emergency / Trauma"
  | string;

export interface Bed {
  id: string;
  bedNumber: string; // e.g. "ICU-04", "GW-M-12"
  wardType: WardType;
  floor: string;
  status: "Available" | "Occupied" | "Under Maintenance" | "Cleaning / Sanitizing" | "Cleaning" | "Reserved";
  dailyRate: number;
  currentPatientId?: string;
  assignedDoctorId?: string;
  admissionDate?: string;
  admittedAt?: string;
  features: string[];
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: "Consultation" | "Pharmacy" | "Laboratory" | "Bed Charges" | "Nursing & Procedures" | "Surgery / OT" | "Nursing / Emergency" | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type PaymentMethod =
  | "Cash"
  | "Credit Card"
  | "Debit Card"
  | "UPI"
  | "TPA Insurance"
  | "Insurance TPA"
  | "Net Banking";

export type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Partially Paid"
  | "Insurance Claim";

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-809"
  patientId: string;
  appointmentId?: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  paidAmount: number;
  insuranceClaimId?: string;
}

export interface StaffMember {
  id: string;
  employeeCode: string;
  name: string;
  role:
    | "Doctor"
    | "Nurse"
    | "Head Nurse"
    | "Receptionist"
    | "Pharmacist"
    | "Lab Technician"
    | "Administrator"
    | "Ward Attendant";
  department: string;
  shift:
    | "Morning (07:00 AM - 03:00 PM)"
    | "Evening (03:00 PM - 11:00 PM)"
    | "Night (11:00 PM - 07:00 AM)"
    | "General (09:00 AM - 05:00 PM)"
    | string;
  phone: string;
  email: string;
  joiningDate: string;
  isActive: boolean;
}

export type Staff = StaffMember;

export interface HospitalNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "emergency";
  read: boolean;
}
