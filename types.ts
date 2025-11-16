
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be stored in production, but needed for this simulation
  credits: number;
  role: 'user' | 'admin';
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export interface PaymentDetails {
  methodName: string;
  accountNumber: string;
  qrCodeUrl: string;
}

export interface Settings {
  paymentDetails: PaymentDetails;
  creditPackages: CreditPackage[];
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  packageCredits: number;
  packagePrice: number;
  transactionId: string;
  status: PaymentStatus;
  date: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}
