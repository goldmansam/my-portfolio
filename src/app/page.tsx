"use client";

import { useState } from "react";
import Scene from "./components/Scene";
import WorkSection from "./components/WorkSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

export default function Page() {
  const [currentSection, setCurrentSection] = useState<'home' | 'work' | 'about' | 'contact'>('home');

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* 3D Scene Background */}
      <Scene onSectionChange={setCurrentSection} />


      {/* Section Overlays */}
      {currentSection === 'work' && <WorkSection />}
      {currentSection === 'about' && <AboutSection />}
      {currentSection === 'contact' && <ContactSection />}

      {/* Close button for sections */}
      {currentSection !== 'home' && (
        <button
          onClick={() => setCurrentSection('home')}
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

    </main>
  );
}