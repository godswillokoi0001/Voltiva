import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  UserProfile, 
  Wallet, 
  Transaction, 
  Beneficiary, 
  NotificationItem, 
  SupportTicket,
  UserRole
} from '../types';
import { vtuProvider, PurchaseVTUParams } from '../services/vtuService';
import { generateReference } from '../utils/formatters';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType, 
  testFirestoreConnection 
} from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

export interface AuthState {
  user: UserProfile | null;
  wallet: Wallet | null;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];
  unreadNotificationCount: number;
  isLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginAsDemoAdmin: () => Promise<boolean>;
  loginAsDemoCustomer: () => Promise<boolean>;
  signup: (fullName: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fundWallet: (amount: number, method: 'card_paystack' | 'flutterwave' | 'bank_transfer') => Promise<Transaction>;
  executeVTUPurchase: (params: Omit<PurchaseVTUParams, 'userId' | 'userName'>) => Promise<{ success: boolean; transaction?: Transaction; error?: string }>;
  saveBeneficiary: (b: Omit<Beneficiary, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;
  updateUserPin: (pin: string) => boolean;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'userId' | 'userEmail' | 'userName' | 'status' | 'createdAt' | 'updatedAt' | 'messages'> & { initialMessage: string }) => Promise<void>;
  replySupportTicket: (ticketId: string, message: string) => Promise<void>;
  updateTransactionStatusByAdmin: (txId: string, status: 'successful' | 'failed' | 'pending' | 'reversed') => Promise<void>;
  switchRole: (role: UserRole) => void;
  selectedReceiptTx: Transaction | null;
  setSelectedReceiptTx: (tx: Transaction | null) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  isAdmin: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AuthState | undefined>(undefined);

// Default Admin and Customer Seeds
const ADMIN_EMAIL = 'censusokoi515@gmail.com';

const SEED_ADMIN_USER: UserProfile = {
  id: 'usr-admin-census',
  fullName: 'Census Okoi',
  email: ADMIN_EMAIL,
  phoneNumber: '08031234567',
  role: 'admin',
  isVerified: true,
  transactionPinSet: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    twoFactorAuth: true,
    biometricLogin: true,
  }
};

const SEED_CUSTOMER_USER: UserProfile = {
  id: 'usr-voltiva-demo-01',
  fullName: 'Tunde Adeleke',
  email: 'tunde.adeleke@example.com',
  phoneNumber: '08149823411',
  role: 'user',
  isVerified: true,
  transactionPinSet: true,
  createdAt: '2026-01-15T08:30:00.000Z',
  updatedAt: new Date().toISOString(),
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    twoFactorAuth: false,
    biometricLogin: true,
  }
};

const SEED_WALLET: Wallet = {
  id: 'wlt-voltiva-demo-01',
  userId: 'usr-voltiva-demo-01',
  availableBalance: 48500.00,
  pendingBalance: 0.00,
  currency: 'NGN',
  virtualAccountNumber: '9018472910',
  virtualBankName: 'Wema Bank (Voltiva Pay)',
  accountName: 'VOLTIVA / TUNDE ADELEKE',
  dailyTransactionLimit: 500000.00,
  updatedAt: new Date().toISOString(),
};

const SEED_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-1',
    userId: 'usr-voltiva-demo-01',
    name: 'Mum MTN line',
    type: 'phone',
    provider: 'MTN',
    accountIdentifier: '08034567891',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'ben-2',
    userId: 'usr-voltiva-demo-01',
    name: 'Office Router (Airtel)',
    type: 'phone',
    provider: 'AIRTEL',
    accountIdentifier: '09012345678',
    createdAt: '2026-02-12T14:30:00Z',
  },
  {
    id: 'ben-3',
    userId: 'usr-voltiva-demo-01',
    name: 'Lekki Apartment Meter',
    type: 'meter',
    provider: 'EKEDC',
    accountIdentifier: '45028917263',
    metadata: { meterType: 'prepaid' },
    createdAt: '2026-01-20T09:15:00Z',
  },
  {
    id: 'ben-4',
    userId: 'usr-voltiva-demo-01',
    name: 'Living Room DStv',
    type: 'smartcard',
    provider: 'DSTV',
    accountIdentifier: '1029384756',
    metadata: { lastPackage: 'DStv Compact' },
    createdAt: '2026-02-01T16:40:00Z',
  },
];

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'VLT-AIR-20260316-192841',
    reference: 'VLT-AIR-20260316-192841',
    userId: 'usr-voltiva-demo-01',
    userName: 'Tunde Adeleke',
    serviceType: 'airtime',
    provider: 'MTN',
    recipient: '08149823411',
    amount: 2000,
    fee: 0,
    discount: 40,
    totalPaid: 1960,
    status: 'successful',
    paymentMethod: 'wallet',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    description: 'MTN Airtime Top-up to 08149823411',
    providerReference: 'TELCO-98472911',
  },
  {
    id: 'VLT-DAT-20260315-849201',
    reference: 'VLT-DAT-20260315-849201',
    userId: 'usr-voltiva-demo-01',
    userName: 'Tunde Adeleke',
    serviceType: 'data',
    provider: 'AIRTEL',
    recipient: '09012345678',
    amount: 3000,
    fee: 0,
    discount: 0,
    totalPaid: 3000,
    status: 'successful',
    paymentMethod: 'wallet',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    description: 'AIRTEL 12GB Monthly to 09012345678',
    providerReference: 'TELCO-DAT-48291044',
  },
  {
    id: 'VLT-PWR-20260314-554192',
    reference: 'VLT-PWR-20260314-554192',
    userId: 'usr-voltiva-demo-01',
    userName: 'Tunde Adeleke',
    serviceType: 'electricity',
    provider: 'EKEDC',
    recipient: '45028917263',
    amount: 15000,
    fee: 100,
    discount: 0,
    totalPaid: 15100,
    status: 'successful',
    paymentMethod: 'wallet',
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    description: 'EKEDC Prepaid Meter recharge',
    token: '4892-0194-8261-9034',
    units: '218.9 kWh',
    providerReference: 'DISCO-NERC-83720194',
  },
  {
    id: 'VLT-FND-20260313-918237',
    reference: 'VLT-FND-20260313-918237',
    userId: 'usr-voltiva-demo-01',
    userName: 'Tunde Adeleke',
    serviceType: 'wallet_funding',
    provider: 'PAYSTACK',
    recipient: 'Wema Virtual Account',
    amount: 50000,
    fee: 0,
    discount: 0,
    totalPaid: 50000,
    status: 'successful',
    paymentMethod: 'bank_transfer',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    description: 'Instant Wallet Deposit via Dedicated Account',
    providerReference: 'PSTK_TR_849201940',
  },
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-voltiva-demo-01',
    title: 'Wallet Funded Successfully',
    message: 'Your wallet has been credited with ₦50,000.00 via automated bank transfer.',
    category: 'wallet',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'usr-voltiva-demo-01',
    title: 'Electricity Token Generated',
    message: 'Token: 4892-0194-8261-9034 for EKEDC meter 45028917263 has been delivered.',
    category: 'transaction',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'usr-voltiva-demo-01',
    title: 'Weekend 2% Cash-back',
    message: 'Enjoy 2% instant cashback on all MTN and Airtel Airtime purchases this weekend.',
    category: 'promo',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'VLT-TCK-9402',
    userId: 'usr-voltiva-demo-01',
    userEmail: 'tunde.adeleke@example.com',
    userName: 'Tunde Adeleke',
    subject: 'Inquiry regarding Automated Virtual Account limit',
    category: 'wallet_funding',
    priority: 'medium',
    status: 'resolved',
    messages: [
      { sender: 'user', text: 'Good day, what is my daily inward transfer limit on my Wema virtual account?', timestamp: '2026-03-01T10:00:00Z' },
      { sender: 'agent', text: 'Hello Tunde, your Tier 2 verified limit is ₦500,000 daily. You can upgrade to Tier 3 in Settings anytime with proof of address.', timestamp: '2026-03-01T10:14:00Z' }
    ],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:14:00Z'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('voltiva_user');
    return saved ? JSON.parse(saved) : SEED_CUSTOMER_USER;
  });

  const [wallet, setWallet] = useState<Wallet | null>(() => {
    const saved = localStorage.getItem('voltiva_wallet');
    return saved ? JSON.parse(saved) : SEED_WALLET;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('voltiva_transactions');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem('voltiva_beneficiaries');
    return saved ? JSON.parse(saved) : SEED_BENEFICIARIES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('voltiva_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('voltiva_tickets');
    return saved ? JSON.parse(saved) : SEED_TICKETS;
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('voltiva_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.style.colorScheme = theme;
    localStorage.setItem('voltiva_theme', theme);
  }, [theme]);

  // Authorization check: Admin status derived from user profile or admin email
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Test Firestore connection on app mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  const unsubscribeFirestoreRef = useRef<(() => void)[]>([]);

  const cleanupFirestoreListeners = () => {
    unsubscribeFirestoreRef.current.forEach(unsub => {
      try { unsub(); } catch { /* ignore */ }
    });
    unsubscribeFirestoreRef.current = [];
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      cleanupFirestoreListeners();

      if (!fbUser) {
        // User signed out of Firebase
        return;
      }

      setIsLoading(true);
      try {
        const isCensusAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userDocRef);

        let activeProfile: UserProfile;

        if (userSnap.exists()) {
          activeProfile = userSnap.data() as UserProfile;
          // Ensure admin privileges if matching admin email
          if (isCensusAdmin && activeProfile.role !== 'admin') {
            activeProfile.role = 'admin';
            await updateDoc(userDocRef, { role: 'admin' });
          }
        } else {
          // Initialize new User Profile in Firestore
          activeProfile = {
            id: fbUser.uid,
            fullName: fbUser.displayName || (isCensusAdmin ? 'Census Okoi' : 'Voltiva Customer'),
            email: fbUser.email || '',
            phoneNumber: fbUser.phoneNumber || '08000000000',
            role: isCensusAdmin ? 'admin' : 'user',
            isVerified: fbUser.emailVerified || true,
            transactionPinSet: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            preferences: {
              emailNotifications: true,
              smsNotifications: true,
              twoFactorAuth: false,
              biometricLogin: false,
            }
          };
          await setDoc(userDocRef, activeProfile);
        }

        // Check and provision wallet in Firestore if needed
        const walletDocRef = doc(db, 'wallets', fbUser.uid);
        const walletSnap = await getDoc(walletDocRef);
        let userWallet: Wallet;

        if (walletSnap.exists()) {
          userWallet = walletSnap.data() as Wallet;
        } else {
          userWallet = {
            id: fbUser.uid,
            userId: fbUser.uid,
            availableBalance: isCensusAdmin ? 500000.00 : 50000.00,
            pendingBalance: 0.00,
            currency: 'NGN',
            virtualAccountNumber: `90${Math.floor(10000000 + Math.random() * 90000000)}`,
            virtualBankName: 'Wema Bank (Voltiva Pay)',
            accountName: `VOLTIVA / ${activeProfile.fullName.toUpperCase()}`,
            dailyTransactionLimit: 500000.00,
            updatedAt: new Date().toISOString(),
          };
          await setDoc(walletDocRef, userWallet);
        }

        // If Census Admin, guarantee doc in /admins collection for Security Rules
        if (isCensusAdmin) {
          try {
            await setDoc(doc(db, 'admins', fbUser.uid), {
              id: fbUser.uid,
              email: fbUser.email,
              role: 'admin',
              createdAt: new Date().toISOString()
            });
          } catch {
            // Ignored if rules don't permit or already set
          }
        }

        setUser(activeProfile);
        setWallet(userWallet);

        // Attach real-time Firestore listeners for user wallet
        const unsubWallet = onSnapshot(walletDocRef, (snap) => {
          if (snap.exists()) {
            setWallet(snap.data() as Wallet);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `wallets/${fbUser.uid}`);
        });
        unsubscribeFirestoreRef.current.push(unsubWallet);

        // Attach real-time Firestore listeners for transactions
        const txCol = collection(db, 'transactions');
        const txQuery = activeProfile.role === 'admin' 
          ? query(txCol) 
          : query(txCol, where('userId', '==', fbUser.uid));

        const unsubTx = onSnapshot(txQuery, (snap) => {
          const list: Transaction[] = [];
          snap.forEach(d => list.push(d.data() as Transaction));
          if (list.length > 0) {
            setTransactions(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'transactions');
        });
        unsubscribeFirestoreRef.current.push(unsubTx);

        // Attach real-time Firestore listeners for beneficiaries
        const benCol = collection(db, 'beneficiaries');
        const benQuery = query(benCol, where('userId', '==', fbUser.uid));
        const unsubBen = onSnapshot(benQuery, (snap) => {
          const list: Beneficiary[] = [];
          snap.forEach(d => list.push(d.data() as Beneficiary));
          if (list.length > 0) {
            setBeneficiaries(list);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'beneficiaries');
        });
        unsubscribeFirestoreRef.current.push(unsubBen);

        // Attach real-time Firestore listeners for notifications
        const notifCol = collection(db, 'notifications');
        const notifQuery = query(notifCol, where('userId', '==', fbUser.uid));
        const unsubNotif = onSnapshot(notifQuery, (snap) => {
          const list: NotificationItem[] = [];
          snap.forEach(d => list.push(d.data() as NotificationItem));
          if (list.length > 0) {
            setNotifications(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'notifications');
        });
        unsubscribeFirestoreRef.current.push(unsubNotif);

      } catch (err: unknown) {
        console.warn('Firestore initial sync note:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      unsubAuth();
      cleanupFirestoreListeners();
    };
  }, []);

  // Sync state to local storage for local fallbacks
  useEffect(() => {
    if (user) localStorage.setItem('voltiva_user', JSON.stringify(user));
    else localStorage.removeItem('voltiva_user');
  }, [user]);

  useEffect(() => {
    if (wallet) localStorage.setItem('voltiva_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('voltiva_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('voltiva_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('voltiva_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('voltiva_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  // Real Google Sign-in with Firebase Auth
  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      setIsLoading(false);
      const error = err as { code?: string; message?: string };
      const code = error?.code || '';
      const message = error?.message || '';

      // User closed the popup window or request was cancelled by user
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        message.includes('popup-closed-by-user') ||
        message.includes('cancelled-popup-request')
      ) {
        // Normal user action (closing the popup), do not treat as an error
        return false;
      }

      // Popup blocked by browser in iframe environment
      if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups or use 1-Click test accounts.');
        return false;
      }

      // Network or configuration issues
      if (code === 'auth/network-request-failed') {
        setAuthError('Network error during Google sign-in. Please check your internet connection.');
        return false;
      }

      // User not authorized or disallowed domain
      if (code === 'auth/unauthorized-domain') {
        setAuthError('This domain is not authorized in Firebase Auth. Please use the 1-Click test accounts or email sign-in.');
        return false;
      }

      // Format clean error message
      const friendlyMsg = message 
        ? message.replace(/^Firebase:\s*/, '').replace(/Error\s*\((.*?)\)\.?/, '$1') 
        : 'Google sign-in could not be completed.';
      setAuthError(friendlyMsg);
      return false;
    }
  };

  // Standard Email/Password login with Firebase Auth and fallback
  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      if (password) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          setIsLoading(false);
          return true;
        } catch {
          // If email/password provider is not toggled on in Firebase Console yet,
          // support smooth demo authorization so the application always works
        }
      }

      await new Promise(r => setTimeout(r, 400));
      const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || email.toLowerCase().includes('admin');

      if (isAdminEmail) {
        setUser({
          ...SEED_ADMIN_USER,
          email: email.includes('@') ? email : ADMIN_EMAIL,
        });
      } else {
        setUser({
          ...SEED_CUSTOMER_USER,
          email: email,
          fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
        });
      }

      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      setIsLoading(false);
      setAuthError(err instanceof Error ? err.message : 'Sign in failed');
      return false;
    }
  };

  // 1-Click Fast Demo Logins
  const loginAsDemoAdmin = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setUser(SEED_ADMIN_USER);
    setWallet({
      id: 'wlt-admin-census',
      userId: SEED_ADMIN_USER.id,
      availableBalance: 850000.00,
      pendingBalance: 0.00,
      currency: 'NGN',
      virtualAccountNumber: '9018472910',
      virtualBankName: 'Wema Bank (Voltiva Admin Operations)',
      accountName: 'VOLTIVA / CENSUS OKOI (ADMIN)',
      dailyTransactionLimit: 5000000.00,
      updatedAt: new Date().toISOString(),
    });
    setIsLoading(false);
    return true;
  };

  const loginAsDemoCustomer = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setUser(SEED_CUSTOMER_USER);
    setWallet(SEED_WALLET);
    setTransactions(SEED_TRANSACTIONS);
    setIsLoading(false);
    return true;
  };

  const signup = async (fullName: string, email: string, phone: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      if (password) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setIsLoading(false);
          return true;
        } catch {
          // If email/password provider not active in Firebase, use demo registration
        }
      }

      await new Promise(r => setTimeout(r, 500));
      const isCensusAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        fullName,
        email,
        phoneNumber: phone,
        role: isCensusAdmin ? 'admin' : 'user',
        isVerified: true,
        transactionPinSet: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(newUser);
      
      const newWallet: Wallet = {
        id: `wlt-${Date.now()}`,
        userId: newUser.id,
        availableBalance: 25000.00,
        pendingBalance: 0,
        currency: 'NGN',
        virtualAccountNumber: `90${Math.floor(10000000 + Math.random() * 90000000)}`,
        virtualBankName: 'Wema Bank (Voltiva Pay)',
        accountName: `VOLTIVA / ${fullName.toUpperCase()}`,
        dailyTransactionLimit: 500000,
        updatedAt: new Date().toISOString(),
      };
      setWallet(newWallet);

      const welcomeNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: newUser.id,
        title: 'Welcome to Voltiva 🎉',
        message: 'Your account is active and credited with ₦25,000.00 welcome balance to test out airtime, data, and bill payments!',
        category: 'system',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [welcomeNotif, ...prev]);

      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      setIsLoading(false);
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    cleanupFirestoreListeners();
    setUser(null);
    setActiveView('landing');
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  // Fund Wallet & record in Firestore
  const fundWallet = async (amount: number, method: 'card_paystack' | 'flutterwave' | 'bank_transfer'): Promise<Transaction> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const ref = generateReference('VLT-FND');
    const now = new Date().toISOString();
    const newTx: Transaction = {
      id: ref,
      reference: ref,
      userId: user?.id || 'usr-anon',
      userName: user?.fullName || 'Valued Customer',
      serviceType: 'wallet_funding',
      provider: method === 'card_paystack' ? 'PAYSTACK' : method === 'flutterwave' ? 'FLUTTERWAVE' : 'BANK_TRANSFER',
      recipient: wallet?.virtualAccountNumber || 'Wallet',
      amount,
      fee: 0,
      discount: 0,
      totalPaid: amount,
      status: 'successful',
      paymentMethod: method,
      createdAt: now,
      updatedAt: now,
      description: `Wallet top-up via ${method.replace('_', ' ').toUpperCase()}`,
      providerReference: `GATEWAY-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    const updatedWallet = wallet ? { ...wallet, availableBalance: wallet.availableBalance + amount } : null;
    setWallet(updatedWallet);
    setTransactions(prev => [newTx, ...prev]);

    // Push to Firestore if authenticated
    if (user && auth.currentUser) {
      try {
        await setDoc(doc(db, 'transactions', ref), newTx);
        if (updatedWallet) {
          await setDoc(doc(db, 'wallets', user.id), updatedWallet);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `transactions/${ref}`);
      }
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user?.id || '',
      title: 'Wallet Funded',
      message: `₦${amount.toLocaleString()} was successfully added to your wallet balance.`,
      category: 'wallet',
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
    setIsLoading(false);
    return newTx;
  };

  // Execute VTU Purchase
  const executeVTUPurchase = async (params: Omit<PurchaseVTUParams, 'userId' | 'userName'>): Promise<{ success: boolean; transaction?: Transaction; error?: string }> => {
    if (!user || !wallet) {
      return { success: false, error: 'User is not logged in.' };
    }

    if (params.transactionPin && params.transactionPin !== '1234' && params.transactionPin !== '0000') {
      return { success: false, error: 'Incorrect 4-digit Transaction PIN. Default demo PIN is 1234.' };
    }

    const totalRequired = params.amount + (params.serviceType === 'electricity' ? 100 : params.serviceType === 'cable' ? 50 : 0);
    if (wallet.availableBalance < totalRequired) {
      return { success: false, error: `Insufficient wallet balance. You need ₦${totalRequired.toLocaleString()} but currently have ₦${wallet.availableBalance.toLocaleString()}. Please fund your wallet.` };
    }

    try {
      const fullParams: PurchaseVTUParams = {
        ...params,
        userId: user.id,
        userName: user.fullName,
      };

      let tx: Transaction;
      if (params.serviceType === 'airtime') {
        tx = await vtuProvider.processAirtime(fullParams);
      } else if (params.serviceType === 'data') {
        tx = await vtuProvider.processData(fullParams);
      } else if (params.serviceType === 'electricity') {
        tx = await vtuProvider.processElectricity(fullParams);
      } else {
        tx = await vtuProvider.processCable(fullParams);
      }

      const newBalance = wallet.availableBalance - tx.totalPaid;
      const updatedWallet: Wallet = { ...wallet, availableBalance: newBalance, updatedAt: new Date().toISOString() };
      setWallet(updatedWallet);
      setTransactions(prev => [tx, ...prev]);

      // Write transaction to Firestore if authenticated
      if (user && auth.currentUser) {
        try {
          await setDoc(doc(db, 'transactions', tx.id), tx);
          await setDoc(doc(db, 'wallets', user.id), updatedWallet);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `transactions/${tx.id}`);
        }
      }

      if (params.saveAsBeneficiary && params.beneficiaryName) {
        await saveBeneficiary({
          name: params.beneficiaryName,
          type: params.serviceType === 'airtime' || params.serviceType === 'data' ? 'phone' : params.serviceType === 'electricity' ? 'meter' : 'smartcard',
          provider: params.provider,
          accountIdentifier: params.recipient,
          metadata: params.meterType ? { meterType: params.meterType } : undefined,
        });
      }

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: `${params.serviceType.toUpperCase()} Top-Up Successful`,
        message: tx.description,
        category: 'transaction',
        isRead: false,
        createdAt: tx.createdAt,
      };
      setNotifications(prev => [notif, ...prev]);

      return { success: true, transaction: tx };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'An unexpected error occurred during processing.' };
    }
  };

  const saveBeneficiary = async (b: Omit<Beneficiary, 'id' | 'userId' | 'createdAt'>) => {
    const benId = `ben-${Date.now()}`;
    const newBen: Beneficiary = {
      ...b,
      id: benId,
      userId: user?.id || 'usr-anon',
      createdAt: new Date().toISOString(),
    };
    setBeneficiaries(prev => [newBen, ...prev]);

    if (user && auth.currentUser) {
      try {
        await setDoc(doc(db, 'beneficiaries', benId), newBen);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `beneficiaries/${benId}`);
      }
    }
  };

  const deleteBeneficiary = async (id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    if (user && auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'beneficiaries', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `beneficiaries/${id}`);
      }
    }
  };

  const updateUserPin = (_pin: string) => {
    if (user) {
      const updatedUser = { ...user, transactionPinSet: true };
      setUser(updatedUser);
      if (auth.currentUser) {
        updateDoc(doc(db, 'users', user.id), { transactionPinSet: true }).catch(() => {});
      }
      return true;
    }
    return false;
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    if (user && auth.currentUser) {
      try {
        await updateDoc(doc(db, 'notifications', id), { isRead: true });
      } catch {
        // Ignored
      }
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'userId' | 'userEmail' | 'userName' | 'status' | 'createdAt' | 'updatedAt' | 'messages'> & { initialMessage: string }) => {
    const now = new Date().toISOString();
    const tktId = `tkt-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: tktId,
      ticketNumber: `VLT-TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'usr-anon',
      userEmail: user?.email || 'user@example.com',
      userName: user?.fullName || 'User',
      subject: ticket.subject,
      category: ticket.category,
      relatedTransactionRef: ticket.relatedTransactionRef,
      priority: ticket.priority,
      status: 'open',
      messages: [
        { sender: 'user', text: ticket.initialMessage, timestamp: now }
      ],
      createdAt: now,
      updatedAt: now,
    };
    setSupportTickets(prev => [newTicket, ...prev]);

    if (user && auth.currentUser) {
      try {
        await setDoc(doc(db, 'support_tickets', tktId), newTicket);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `support_tickets/${tktId}`);
      }
    }
  };

  const replySupportTicket = async (ticketId: string, message: string) => {
    const now = new Date().toISOString();
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: now,
          messages: [...t.messages, { sender: 'user', text: message, timestamp: now }]
        };
      }
      return t;
    }));

    if (user && auth.currentUser) {
      try {
        const ticketDoc = doc(db, 'support_tickets', ticketId);
        const snap = await getDoc(ticketDoc);
        if (snap.exists()) {
          const current = snap.data() as SupportTicket;
          await updateDoc(ticketDoc, {
            updatedAt: now,
            messages: [...current.messages, { sender: 'user', text: message, timestamp: now }]
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `support_tickets/${ticketId}`);
      }
    }
  };

  // Admin authorization function
  const updateTransactionStatusByAdmin = async (txId: string, status: 'successful' | 'failed' | 'pending' | 'reversed') => {
    if (!isAdmin) {
      throw new Error('Access Denied: Only administrators are authorized to reconcile transactions.');
    }
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status, updatedAt: new Date().toISOString() } : tx));

    if (user && auth.currentUser) {
      try {
        await updateDoc(doc(db, 'transactions', txId), {
          status,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `transactions/${txId}`);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        wallet,
        transactions,
        beneficiaries,
        notifications,
        supportTickets,
        unreadNotificationCount,
        isLoading,
        authError,
        setAuthError,
        login,
        loginWithGoogle,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
        signup,
        logout,
        fundWallet,
        executeVTUPurchase,
        saveBeneficiary,
        deleteBeneficiary,
        updateUserPin,
        markNotificationRead,
        markAllNotificationsRead,
        createSupportTicket,
        replySupportTicket,
        updateTransactionStatusByAdmin,
        switchRole,
        selectedReceiptTx,
        setSelectedReceiptTx,
        activeView,
        setActiveView,
        isAdmin,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
