import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import OnboardingModal from './OnboardingModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isGuest, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { userData } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
          <p className="text-2xl font-luxury-heading text-black">Loading Wasilah...</p>
        </div>
      </div>
    );
  }

  // Show onboarding for new users who haven't completed it
  if (currentUser && userData && !userData.isGuest && !userData.preferences?.onboardingCompleted) {
    return (
      <>
        {children}
        <OnboardingModal 
          isOpen={!userData.preferences?.onboardingCompleted} 
          onClose={() => setShowOnboarding(false)} 
        />
      </>
    );
  }

  if (!currentUser && !isGuest) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-logo-navy via-logo-navy-light to-logo-teal flex items-center justify-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="floating-3d-luxury opacity-20"></div>
            <div className="floating-3d-luxury opacity-15"></div>
            <div className="floating-3d-luxury opacity-25"></div>
            <div className="luxury-particle"></div>
            <div className="luxury-particle"></div>
          </div>

          <div className="max-w-md w-full mx-4 relative z-10">
            <div className="luxury-card bg-cream-white p-8 text-center">
              {/* Logo */}
              <div className="w-24 h-24 bg-vibrant-orange rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-luxury-glow animate-luxury-glow">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>

              <h1 className="text-4xl font-luxury-display text-black mb-4">
                <span className="text-lg font-arabic block mb-2">وسیلہ</span>
                Welcome to Wasilah
              </h1>
              
              <p className="text-black font-luxury-body text-lg mb-8 leading-relaxed">
                Empowering communities and building futures through collaborative service and meaningful connections.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full btn-luxury-primary py-4 px-6 text-lg"
                >
                  Get Started
                </button>
                
                <p className="text-black font-luxury-body">
                  Join our mission to create positive change in communities across Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;