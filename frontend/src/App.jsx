import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';

import HomePage from './pages/HomePage';
import AIStudioPage from './pages/AIStudioPage';
import ClassesPage from './pages/ClassesPage';
import TrainersPage from './pages/TrainersPage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';

function GymApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [selectedScheduleForBooking, setSelectedScheduleForBooking] = useState(null);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  const handleSelectScheduleForBooking = (schedule) => {
    setSelectedScheduleForBooking(schedule);
  };

  const handleCloseBooking = () => {
    setSelectedScheduleForBooking(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            onOpenAuth={handleOpenAuth}
            onBookClass={handleSelectScheduleForBooking}
          />
        )}
        {currentPage === 'ai-studio' && (
          <AIStudioPage />
        )}
        {currentPage === 'classes' && (
          <ClassesPage
            onSelectScheduleForBooking={handleSelectScheduleForBooking}
          />
        )}
        {currentPage === 'trainers' && (
          <TrainersPage
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'pricing' && (
          <PricingPage
            onOpenAuth={handleOpenAuth}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={setCurrentPage}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={handleCloseAuth}
      />

      <BookingModal
        schedule={selectedScheduleForBooking}
        onClose={handleCloseBooking}
        onBookingSuccess={() => {
          // If on classes page, it updates
        }}
      />

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <GymApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
