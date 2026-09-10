import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages & Components
import { HeroSection } from './components/Home/HeroSection';
import { CategoryGrid } from './components/Home/CategoryGrid';
import { HowItWorks } from './components/Home/HowItWorks';
import { RecentResolved } from './components/Home/RecentResolved';
import { ReportIssuePage } from './components/Report/ReportIssuePage';
import { TrackComplaintPage } from './components/Track/TrackComplaintPage';
import { LiveCivicMapPage } from './components/Map/LiveCivicMapPage';
import { NearbyIssuesPage } from './components/Nearby/NearbyIssuesPage';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ReportsAnalyticsPage } from './components/Analytics/ReportsAnalyticsPage';
import { EmergencyHelpPage } from './components/Emergency/EmergencyHelpPage';
import { AboutPage } from './components/About/AboutPage';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [preselectedCategory, setPreselectedCategory] = useState(null);
  const [trackTargetId, setTrackTargetId] = useState(null);

  // Navigate with optional parameters
  const handleNavigate = (tab, param = null) => {
    if (tab === 'report') {
      setPreselectedCategory(param); // can be category string or null
    }
    if (tab === 'track') {
      setTrackTargetId(param); // can be complaint ID or null
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (categoryId) => {
    handleNavigate('report', categoryId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onSelectCategory={handleSelectCategoryFromHome}
              onNavigate={handleNavigate}
            />
            <CategoryGrid onSelectCategory={handleSelectCategoryFromHome} />
            <HowItWorks />
            <RecentResolved onNavigate={handleNavigate} />
          </>
        )}

        {activeTab === 'report' && (
          <ReportIssuePage
            preselectedCategory={preselectedCategory}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'track' && (
          <TrackComplaintPage
            initialId={trackTargetId}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'map' && (
          <LiveCivicMapPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'nearby' && (
          <NearbyIssuesPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'dashboard' && (
          <CitizenDashboard onNavigate={handleNavigate} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {activeTab === 'analytics' && (
          <ReportsAnalyticsPage />
        )}

        {activeTab === 'emergency' && (
          <EmergencyHelpPage />
        )}

        {activeTab === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Civic Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ComplaintProvider>
          <AppContent />
        </ComplaintProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
