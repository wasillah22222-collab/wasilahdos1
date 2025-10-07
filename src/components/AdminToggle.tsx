import React from 'react';
import { CreditCard as Edit3, Eye } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';

const AdminToggle: React.FC = () => {
  const { isAdmin } = useAuth();
  const { isAdminMode, toggleAdminMode } = useAdmin();

  if (!isAdmin) return null;

  return (
    <button
      onClick={toggleAdminMode}
      className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-full shadow-lg font-luxury-semibold transition-all duration-300 hover:scale-110 ${
        isAdminMode
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-gray-700 hover:bg-gray-800 text-white'
      }`}
      title={isAdminMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
    >
      <div className="flex items-center gap-2">
        {isAdminMode ? (
          <>
            <Eye className="w-5 h-5" />
            <span>Editing</span>
          </>
        ) : (
          <>
            <Edit3 className="w-5 h-5" />
            <span>Edit Mode</span>
          </>
        )}
      </div>
    </button>
  );
};

export default AdminToggle;
