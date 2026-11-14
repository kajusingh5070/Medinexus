import React from "react";
import { LandingHeader } from "./LandingHeader";
import { LandingHome } from "./LandingHome";
import { LandingIntro } from "./LandingIntro";
import { LandingFeatures } from "./LandingFeatures";
import { LandingAbout } from "./LandingAbout";
import { LandingFooter } from "./LandingFooter";
import { AuthModal } from "./AuthModal";
import { useHospital } from "../../context/HospitalContext";
import { UserRole } from "../../types";

export const LandingPage: React.FC = () => {
  const {
    showAuthModal,
    closeAuthModal,
    openAuthModal,
    authModalMode,
    currentRole,
  } = useHospital();

  const handleOpenAuth = (mode: "login" | "register", prefilledRole?: UserRole) => {
    openAuthModal(mode, prefilledRole);
  };

  const scrollToFeatures = () => {
    const el = document.querySelector("#features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Landing Sticky Header */}
      <LandingHeader
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />

      {/* Main Sections */}
      <main>
        {/* Section 1: Home / Hero */}
        <LandingHome
          onOpenAuth={handleOpenAuth}
          onExploreFeatures={scrollToFeatures}
        />

        {/* Section 2: Introduction about the Web Application */}
        <LandingIntro />

        {/* Section 3: Features & Clinical Modules */}
        <LandingFeatures onOpenAuth={handleOpenAuth} />

        {/* Section 4: About Platform & Academic Architecture */}
        <LandingAbout
          onOpenAuth={handleOpenAuth}
        />
      </main>

      {/* Landing Footer */}
      <LandingFooter
        onOpenAuth={handleOpenAuth}
      />

      {/* Authentication Modal (Sign In & Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        initialRole={currentRole}
      />
    </div>
  );
};
