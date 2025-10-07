import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import EditableHeader from './components/EditableHeader';
import EditableFooter from './components/EditableFooter';
import HomeEditable from './pages/HomeEditable';
import AboutEditable from './pages/AboutEditable';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import CreateSubmission from './pages/CreateSubmission';
import ChatWidget from './components/ChatWidget';
import DonationWidget from './components/DonationWidget';
import AdminToggle from './components/AdminToggle';
import { useActivityLogger } from './hooks/useActivityLogger';

const AppContent = () => {
  useActivityLogger();

  return (
    <div className="min-h-screen bg-gray-50">
      <EditableHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomeEditable />} />
          <Route path="/about" element={<AboutEditable />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-submission" element={<CreateSubmission />} />
        </Routes>
      </main>
      <EditableFooter />
      <ChatWidget />
      <DonationWidget />
      <AdminToggle />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ThemeProvider>
          <Router>
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          </Router>
        </ThemeProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;