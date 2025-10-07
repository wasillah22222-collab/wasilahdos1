import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, LogIn, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../hooks/useContent';
import AdminPanel from './AdminPanel';
import ContentEditor from './ContentEditor';
import EditButton from './EditButton';
import AuthModal from './AuthModal';

const EditableHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { currentUser, userData, isGuest, isAdmin, logout } = useAuth();

  const { data: headerData, upsertContent: saveHeader } = useContent('header_content', 'main');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultHeader = {
    arabicName: 'وسیلہ',
    englishName: 'Wasilah',
    logoUrl: '/logo.jpeg'
  };

  const header = headerData || defaultHeader;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About Us', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Events', href: '/events' },
    { name: 'Join Us', href: '/volunteer' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'luxury-glass-dark shadow-luxury-lg backdrop-blur-luxury'
          : 'bg-transparent'
      }`}>
        {isAdmin && (
          <EditButton onClick={() => setEditingSection('header')} />
        )}

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link to="/" className="flex items-center space-x-6 group">
              <div className="transform transition-transform duration-500 group-hover:scale-110">
                <img
                  src={header.logoUrl}
                  alt="Wasilah Logo"
                  className="w-16 h-16 object-cover rounded-2xl shadow-luxury-glow"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-arabic text-cream-elegant leading-tight">
                  {header.arabicName}
                </span>
                <span className="text-2xl font-luxury-heading text-cream-elegant group-hover:text-vibrant-orange-light transition-colors duration-300">
                  {header.englishName}
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => (
                (item.name === 'Dashboard' && (isGuest || !currentUser)) ? null : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-pill ${
                      location.pathname === item.href ? 'active' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            <div className="hidden lg:block relative">
              {currentUser && !isGuest ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-3 rounded-luxury hover:bg-logo-navy-light/60 transition-colors"
                  >
                    {userData?.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-vibrant-orange"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-vibrant-orange rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-cream-elegant font-luxury-semibold text-sm">
                        {userData?.displayName || 'User'}
                      </p>
                      {isAdmin && (
                        <p className="text-vibrant-orange-light text-xs">Admin</p>
                      )}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 luxury-glass-dark rounded-luxury-lg border-2 border-vibrant-orange/30 py-2">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowAdminPanel(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cream-elegant hover:bg-vibrant-orange/20 transition-colors flex items-center"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Admin Panel
                        </button>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 text-cream-elegant hover:bg-vibrant-orange/20 transition-colors flex items-center"
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-cream-elegant hover:bg-vibrant-orange/20 transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : isGuest ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-light transition-colors font-luxury-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              ) : null}
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-4 rounded-luxury text-cream-elegant hover:bg-logo-navy-light/60 transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-6 pt-6 pb-8 space-y-3 luxury-glass-dark rounded-luxury-lg mt-6 border-2 border-vibrant-orange/30">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-6 py-4 rounded-luxury text-base font-luxury-semibold transition-all duration-400 ${
                      location.pathname === item.href
                        ? 'text-logo-navy bg-cream-elegant'
                        : 'text-cream-elegant hover:text-vibrant-orange-light hover:bg-logo-navy-light/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      </header>

      <ContentEditor
        isOpen={editingSection === 'header'}
        onClose={() => setEditingSection(null)}
        title="Edit Header"
        fields={[
          { name: 'arabicName', label: 'Arabic Name', type: 'text', required: true },
          { name: 'englishName', label: 'English Name', type: 'text', required: true },
          { name: 'logoUrl', label: 'Logo Image URL', type: 'text', required: true }
        ]}
        initialData={header}
        onSave={(data) => saveHeader('main', data)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default EditableHeader;
