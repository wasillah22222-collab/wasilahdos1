import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, facebookProvider, db } from '../config/firebase';
import { initializeUserProfile, logActivity as logUserActivity } from '../utils/firebaseInit';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  isAdmin: boolean;
  isGuest: boolean;
  createdAt: any;
  lastLogin: any;
  activityLog: ActivityLog[];
  preferences?: {
    theme?: string;
    interests?: string[];
    onboardingCompleted?: boolean;
    completedAt?: any;
    lastUpdated?: any;
  };
}

interface ActivityLog {
  id: string;
  action: string;
  page: string;
  timestamp: any;
  details?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isGuest: boolean;
  isAdmin: boolean;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  logActivity: (action: string, page: string, details?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin credentials
  const ADMIN_EMAIL = 'admin@wasilah.org';
  const ADMIN_PASSWORD = 'WasilahAdmin2024!';

  const createUserDocument = async (user: User, additionalData: any = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const isAdminUser = email === ADMIN_EMAIL;
      
      const userData: UserData = {
        uid: user.uid,
        displayName,
        email,
        photoURL,
        phoneNumber: additionalData.phoneNumber || null,
        isAdmin: isAdminUser,
        isGuest: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        activityLog: [],
        ...additionalData
      };

      await setDoc(userRef, userData);
      return userData;
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      return userSnap.data() as UserData;
    }
  };

  const signup = async (email: string, password: string, displayName: string, phone?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user);

    await createUserDocument(user, { phoneNumber: phone });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await createUserDocument(user);
  };

  const loginWithFacebook = async () => {
    const { user } = await signInWithPopup(auth, facebookProvider);
    await createUserDocument(user);
  };

  const logout = async () => {
    setIsGuest(false);
    setIsAdmin(false);
    setUserData(null);
    await signOut(auth);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setLoading(false);
  };

  const logActivity = async (action: string, page: string, details?: any) => {
    if (currentUser && userData && !userData.isGuest) {
      const activityLog: ActivityLog = {
        id: Date.now().toString(),
        action,
        page,
        timestamp: serverTimestamp(),
        details
      };

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentData = userSnap.data() as UserData;
        const updatedActivityLog = [...(currentData.activityLog || []), activityLog];

        await updateDoc(userRef, {
          activityLog: updatedActivityLog
        });

        setUserData(prev => prev ? { ...prev, activityLog: updatedActivityLog } : null);
      }
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updatePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    await firebaseUpdatePassword(currentUser, newPassword);
  };

  const resendEmailVerification = async () => {
    if (!currentUser) throw new Error('No user logged in');
    await sendEmailVerification(currentUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await createUserDocument(user);
        setCurrentUser(user);
        setUserData(userData);
        setIsAdmin(userData.isAdmin);
        setIsGuest(false);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setIsAdmin(false);
        if (!isGuest) {
          setLoading(false);
        }
      }
      
      if (!isGuest) {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [isGuest]);

  const value: AuthContextType = {
    currentUser,
    userData,
    isGuest,
    isAdmin,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    continueAsGuest,
    logActivity,
    resetPassword,
    updatePassword,
    resendEmailVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};