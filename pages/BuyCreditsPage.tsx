
import React, { useState } from 'react';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalStateContext';
import { CreditPackage, PaymentRequest } from '../types';

const PaymentModal: React.FC<{
  selectedPackage: CreditPackage;
  onClose: () => void;
}> = ({ selectedPackage, onClose }) => {
  const { settings, currentUser } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('Transaction ID is required.');
      return;
    }
    setError('');

    if (!currentUser) {
        setError('User not found. Please log in again.');
        return;
    }

    const newPaymentRequest: PaymentRequest = {
        id: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packageCredits: selectedPackage.credits,
        packagePrice: selectedPackage.price,
        transactionId: transactionId,
        status: 'pending',
        date: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_PAYMENT_REQUEST', payload: newPaymentRequest });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center border border-gray-700">
                <h2 className="text-2xl font-bold text-green-400 mb-4">Request Submitted!</h2>
                <p className="text-gray-300 mb-6">Your payment request has been received. Please allow some time for verification. Your credits will be added upon approval.</p>
                <button onClick={onClose} className="w-full bg-brand-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-700 transition">
                    Close
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 sm:p-8 max-w-lg w-full border border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-2">Complete Your Purchase</h2>
        <p className="text-gray-400 mb-6">You are purchasing the <span className="font-bold text-brand-400">{selectedPackage.name}</span> for <span className="font-bold text-brand-400">৳{selectedPackage.price}</span>.</p>
        
        <div className="bg-gray-700 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-white">Payment Method: {settings.paymentDetails.methodName}</h3>
            <p className="text-gray-300">Account Number: <span className="font-mono text-lg text-yellow-300">{settings.paymentDetails.accountNumber}</span></p>
            <img src={settings.paymentDetails.qrCodeUrl} alt="QR Code" className="mx-auto mt-4 w-40 h-40 rounded-lg border-4 border-gray-600"/>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300 mb-2">Transaction ID</label>
            <input 
              id="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              placeholder="Enter the transaction ID from your payment"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 transition">
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
};

const CreditPackageCard: React.FC<{
  pkg: CreditPackage;
  onBuy: (pkg: CreditPackage) => void;
}> = ({ pkg, onBuy }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-brand-500/20">
    <h3 className="text-2xl font-bold text-brand-400">{pkg.name}</h3>
    <p className="text-5xl font-extrabold text-white my-4">{pkg.credits}</p>
    <p className="text-gray-400 mb-6">Credits</p>
    <div className="bg-gray-700 text-white font-bold py-2 px-6 rounded-full text-xl mb-6">
      ৳{pkg.price}
    </div>
    <button onClick={() => onBuy(pkg)} className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 transition">
      Buy Now
    </button>
  </div>
);


const BuyCreditsPage: React.FC = () => {
  const { settings } = useGlobalState();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">Buy Credits</h1>
        <p className="text-lg text-gray-400 mt-2">Choose a package that suits your needs and continue creating.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {settings.creditPackages.map(pkg => (
          <CreditPackageCard key={pkg.id} pkg={pkg} onBuy={setSelectedPackage} />
        ))}
      </div>
      {selectedPackage && <PaymentModal selectedPackage={selectedPackage} onClose={() => setSelectedPackage(null)} />}
    </div>
  );
};

export default BuyCreditsPage;
