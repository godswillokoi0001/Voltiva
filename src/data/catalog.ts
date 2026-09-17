import { DataBundlePlan, CablePackage } from '../types';

export const DATA_PLANS: DataBundlePlan[] = [
  // MTN
  { id: 'mtn-1', network: 'MTN', name: '1GB Daily', category: 'daily', validity: '1 Day', dataAllowance: '1GB', price: 350, cashback: 7 },
  { id: 'mtn-2', network: 'MTN', name: '2.5GB 2-Days', category: 'daily', validity: '2 Days', dataAllowance: '2.5GB', price: 600, cashback: 12 },
  { id: 'mtn-3', network: 'MTN', name: '3GB Weekly', category: 'weekly', validity: '7 Days', dataAllowance: '3GB', price: 1000, cashback: 20 },
  { id: 'mtn-4', network: 'MTN', name: '6GB Weekly', category: 'weekly', validity: '7 Days', dataAllowance: '6GB', price: 1500, cashback: 30 },
  { id: 'mtn-5', network: 'MTN', name: '10GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '10GB', price: 3000, cashback: 60 },
  { id: 'mtn-6', network: 'MTN', name: '20GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '20GB', price: 5500, cashback: 110 },
  { id: 'mtn-7', network: 'MTN', name: '40GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '40GB', price: 10000, cashback: 200 },
  { id: 'mtn-8', network: 'MTN', name: 'SME 5GB Fast', category: 'special', validity: '30 Days', dataAllowance: '5GB', price: 1350, cashback: 27 },
  
  // AIRTEL
  { id: 'airtel-1', network: 'AIRTEL', name: '1GB Daily', category: 'daily', validity: '1 Day', dataAllowance: '1GB', price: 350, cashback: 7 },
  { id: 'airtel-2', network: 'AIRTEL', name: '2GB 2-Days', category: 'daily', validity: '2 Days', dataAllowance: '2GB', price: 500, cashback: 10 },
  { id: 'airtel-3', network: 'AIRTEL', name: '3GB Weekly', category: 'weekly', validity: '7 Days', dataAllowance: '3GB', price: 1000, cashback: 20 },
  { id: 'airtel-4', network: 'AIRTEL', name: '8GB Binge Weekly', category: 'weekly', validity: '7 Days', dataAllowance: '8GB', price: 1500, cashback: 30 },
  { id: 'airtel-5', network: 'AIRTEL', name: '12GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '12GB', price: 3000, cashback: 60 },
  { id: 'airtel-6', network: 'AIRTEL', name: '25GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '25GB', price: 6000, cashback: 120 },
  { id: 'airtel-7', network: 'AIRTEL', name: 'Night Owl 1GB', category: 'special', validity: '1 Night (12am-5am)', dataAllowance: '1GB', price: 200, cashback: 4 },

  // GLO
  { id: 'glo-1', network: 'GLO', name: '1.25GB Daily', category: 'daily', validity: '1 Day', dataAllowance: '1.25GB', price: 300, cashback: 6 },
  { id: 'glo-2', network: 'GLO', name: '2.5GB 2-Days', category: 'daily', validity: '2 Days', dataAllowance: '2.5GB', price: 500, cashback: 10 },
  { id: 'glo-3', network: 'GLO', name: '3.9GB Weekly', category: 'weekly', validity: '7 Days', dataAllowance: '3.9GB', price: 1000, cashback: 20 },
  { id: 'glo-4', network: 'GLO', name: '10.5GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '10.5GB', price: 2500, cashback: 50 },
  { id: 'glo-5', network: 'GLO', name: '18GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '18GB', price: 4000, cashback: 80 },
  { id: 'glo-6', network: 'GLO', name: 'Special Weekend 3GB', category: 'special', validity: 'Weekend Only', dataAllowance: '3GB', price: 500, cashback: 10 },

  // 9MOBILE
  { id: '9mob-1', network: '9MOBILE', name: '1GB Daily', category: 'daily', validity: '1 Day', dataAllowance: '1GB', price: 350, cashback: 7 },
  { id: '9mob-2', network: '9MOBILE', name: '2.5GB Weekly', category: 'weekly', validity: '7 Days', dataAllowance: '2.5GB', price: 1000, cashback: 20 },
  { id: '9mob-3', network: '9MOBILE', name: '9.5GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '9.5GB', price: 2500, cashback: 50 },
  { id: '9mob-4', network: '9MOBILE', name: '15GB Monthly', category: 'monthly', validity: '30 Days', dataAllowance: '15GB', price: 4000, cashback: 80 },
];

export const CABLE_PACKAGES: CablePackage[] = [
  // DSTV
  { id: 'dstv-padi', provider: 'DSTV', name: 'DStv Padi', price: 3600, channels: 45, description: 'Family essentials and local channels' },
  { id: 'dstv-yanga', provider: 'DSTV', name: 'DStv Yanga', price: 5100, channels: 85, description: 'Nollywood movies, drama & kids shows' },
  { id: 'dstv-confam', provider: 'DSTV', name: 'DStv Confam', price: 9300, channels: 120, description: 'Action movies, football & lifestyle' },
  { id: 'dstv-compact', provider: 'DSTV', name: 'DStv Compact', price: 15700, channels: 145, description: 'Premier League live & global blockbusters' },
  { id: 'dstv-compact-plus', provider: 'DSTV', name: 'DStv Compact Plus', price: 25000, channels: 165, description: 'Champions League, UFC & European soccer' },
  { id: 'dstv-premium', provider: 'DSTV', name: 'DStv Premium', price: 37000, channels: 180, description: 'Full live sports, documentaries & cinema' },

  // GOTV
  { id: 'gotv-smallie', provider: 'GOTV', name: 'GOtv Smallie', price: 1575, channels: 35, description: 'Basic news and local entertainment' },
  { id: 'gotv-jinja', provider: 'GOTV', name: 'GOtv Jinja', price: 3300, channels: 47, description: 'Popular family favorites & music' },
  { id: 'gotv-jolli', provider: 'GOTV', name: 'GOtv Jolli', price: 4850, channels: 68, description: 'More drama, kids channels & movies' },
  { id: 'gotv-max', provider: 'GOTV', name: 'GOtv Max', price: 7200, channels: 75, description: 'La Liga, Serie A, WWE & movies' },
  { id: 'gotv-supa', provider: 'GOTV', name: 'GOtv Supa', price: 9600, channels: 80, description: 'All sports and entertainment' },

  // STARTIMES
  { id: 'star-nova', provider: 'STARTIMES', name: 'Nova Bouquet', price: 1700, channels: 38, description: 'Budget friendly everyday viewing' },
  { id: 'star-basic', provider: 'STARTIMES', name: 'Basic Bouquet', price: 3300, channels: 55, description: 'Quality sports, news and music' },
  { id: 'star-smart', provider: 'STARTIMES', name: 'Smart Bouquet', price: 4200, channels: 70, description: 'Family variety entertainment' },
  { id: 'star-classic', provider: 'STARTIMES', name: 'Classic Bouquet', price: 5000, channels: 90, description: 'Best of Startimes TV programming' },
];

export const ELECTRICITY_PROVIDERS_LIST = [
  { code: 'IKEDC', name: 'Ikeja Electric (IKEDC)', coverage: 'Lagos Mainland, Ikeja & Environs' },
  { code: 'EKEDC', name: 'Eko Electricity (EKEDC)', coverage: 'Lagos Island, Lekki, Victoria Island' },
  { code: 'AEDC', name: 'Abuja Electricity (AEDC)', coverage: 'FCT Abuja, Kogi, Nasarawa, Niger' },
  { code: 'IBEDC', name: 'Ibadan Electricity (IBEDC)', coverage: 'Oyo, Ogun, Osun, Kwara' },
  { code: 'PHED', name: 'Port Harcourt Electric (PHED)', coverage: 'Rivers, Bayelsa, Cross River, Akwa Ibom' },
  { code: 'EEDC', name: 'Enugu Electricity (EEDC)', coverage: 'Enugu, Abia, Imo, Anambra, Ebonyi' },
  { code: 'KEDCO', name: 'Kano Electricity (KEDCO)', coverage: 'Kano, Katsina, Jigawa' },
];
