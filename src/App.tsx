import React from "react";
import { HospitalProvider, useHospital } from "./context/HospitalContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { PatientsView } from "./components/PatientsView";
import { DoctorsView } from "./components/DoctorsView";
import { AppointmentsView } from "./components/AppointmentsView";
import { PrescriptionsView } from "./components/PrescriptionsView";
import { PharmacyView } from "./components/PharmacyView";
import { LaboratoryView } from "./components/LaboratoryView";
import { BedsView } from "./components/BedsView";
import { BillingView } from "./components/BillingView";
import { StaffView } from "./components/StaffView";
import { AiAssistantView } from "./components/AiAssistantView";
import { DocumentationView } from "./components/DocumentationView";
import { LandingPage } from "./components/LandingPage/LandingPage";

const AppContainer: React.FC = () => {
  const { isAuthenticated, showLandingPage, activeView } = useHospital();

  // If user is not authenticated or explicitly viewing public landing page, show LandingPage
  if (!isAuthenticated || showLandingPage) {
    return <LandingPage />;
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "patients":
        return <PatientsView />;
      case "doctors":
        return <DoctorsView />;
      case "appointments":
        return <AppointmentsView />;
      case "prescriptions":
        return <PrescriptionsView />;
      case "pharmacy":
        return <PharmacyView />;
      case "laboratory":
        return <LaboratoryView />;
      case "beds":
        return <BedsView />;
      case "billing":
        return <BillingView />;
      case "staff":
        return <StaffView />;
      case "ai_assistant":
        return <AiAssistantView />;
      case "documentation":
        return <DocumentationView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-900 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <AppContainer />
    </HospitalProvider>
  );
}

