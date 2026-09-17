export type UserRole = 'user' | 'staff' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isVerified: boolean;
  transactionPinSet: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    twoFactorAuth: boolean;
    biometricLogin: boolean;
  };
}

export interface Wallet {
  id: string;
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: 'NGN';
  virtualAccountNumber?: string;
  virtualBankName?: string;
  accountName?: string;
  dailyTransactionLimit: number;
  updatedAt: string;
}

export type VTUServiceType = 'airtime' | 'data' | 'electricity' | 'cable';

export type NetworkProvider = 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';
export type ElectricityProvider = 'EKEDC' | 'IKEDC' | 'AEDC' | 'PHED' | 'IBEDC' | 'KEDCO' | 'EEDC';
export type CableProvider = 'DSTV' | 'GOTV' | 'STARTIMES';

export type TransactionStatus = 'successful' | 'pending' | 'failed' | 'reversed';

export interface Transaction {
  id: string;
  reference: string;
  userId: string;
  userName?: string;
  serviceType: VTUServiceType | 'wallet_funding' | 'wallet_transfer';
  provider: string; // e.g. "MTN", "IKEDC", "DSTV", "PAYSTACK"
  recipient: string; // Phone number, Meter number, Smartcard number, or user email
  amount: number;
  fee: number;
  discount: number;
  totalPaid: number;
  status: TransactionStatus;
  paymentMethod: 'wallet' | 'card_paystack' | 'bank_transfer' | 'flutterwave';
  createdAt: string;
  updatedAt: string;
  description: string;
  providerReference?: string;
  token?: string; // Token for prepaid electricity meter
  units?: string; // Units for electricity
  customerName?: string; // Customer name verified for meter or IUC
  metadata?: Record<string, unknown>;
  failureReason?: string;
}

export type BeneficiaryType = 'phone' | 'meter' | 'smartcard';

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  type: BeneficiaryType;
  provider: string; // e.g., "MTN", "EKEDC", "DSTV"
  accountIdentifier: string; // phone number, meter number, or smartcard number
  metadata?: {
    meterType?: 'prepaid' | 'postpaid';
    lastPackage?: string;
  };
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'transaction' | 'wallet' | 'security' | 'promo' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'airtime_failed' | 'data_delay' | 'electricity_token' | 'cable_renewal' | 'wallet_funding' | 'other';
  relatedTransactionRef?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: Array<{
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DataBundlePlan {
  id: string;
  network: NetworkProvider;
  name: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  validity: string;
  dataAllowance: string;
  price: number;
  cashback: number;
}

export type ActiveView = 
  | 'landing'
  | 'dashboard'
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'wallet'
  | 'transactions'
  | 'beneficiaries'
  | 'notifications'
  | 'support'
  | 'settings'
  | 'admin';

export interface CablePackage {
  id: string;
  provider: CableProvider;
  name: string;
  price: number;
  channels: number;
  description: string;
}
