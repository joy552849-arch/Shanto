
import React, { useState, useEffect } from 'react';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalStateContext';
import { Settings, CreditPackage } from '../types';
import { TrashIcon, EditIcon } from '../components/icons/Icons';

const AdminSettingsPage: React.FC = () => {
  const { settings } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, [name]: value }
    }));
  };

  const handlePackageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPackages = [...localSettings.creditPackages];
    const key = name as keyof CreditPackage;
    if (key === 'price' || key === 'credits') {
        updatedPackages[index] = { ...updatedPackages[index], [key]: parseInt(value) || 0 };
    } else {
        updatedPackages[index] = { ...updatedPackages[index], [key]: value };
    }
    setLocalSettings(prev => ({ ...prev, creditPackages: updatedPackages }));
  };

  const addPackage = () => {
    const newPackage: CreditPackage = { id: `pkg${Date.now()}`, name: 'New Pack', credits: 0, price: 0 };
    setLocalSettings(prev => ({ ...prev, creditPackages: [...prev.creditPackages, newPackage] }));
  };

  const removePackage = (index: number) => {
    const updatedPackages = localSettings.creditPackages.filter((_, i) => i !== index);
    setLocalSettings(prev => ({ ...prev, creditPackages: updatedPackages }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_SETTINGS', payload: localSettings });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Application Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Payment Settings */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Method Name</label>
              <input type="text" name="methodName" value={localSettings.paymentDetails.methodName} onChange={handlePaymentDetailsChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Number</label>
              <input type="text" name="accountNumber" value={localSettings.paymentDetails.accountNumber} onChange={handlePaymentDetailsChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">QR Code Image URL</label>
              <input type="text" name="qrCodeUrl" value={localSettings.paymentDetails.qrCodeUrl} onChange={handlePaymentDetailsChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2" />
            </div>
          </div>
        </div>

        {/* Credit Packages Settings */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Credit Packages</h2>
          <div className="space-y-4">
            {localSettings.creditPackages.map((pkg, index) => (
              <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <input type="text" name="name" placeholder="Package Name" value={pkg.name} onChange={(e) => handlePackageChange(index, e)} className="md:col-span-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2" />
                <input type="number" name="credits" placeholder="Credits" value={pkg.credits} onChange={(e) => handlePackageChange(index, e)} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2" />
                <div className="flex items-center space-x-2">
                    <input type="number" name="price" placeholder="Price (৳)" value={pkg.price} onChange={(e) => handlePackageChange(index, e)} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2" />
                    <button type="button" onClick={() => removePackage(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addPackage} className="mt-4 text-brand-400 hover:text-brand-300 font-medium">
            + Add Package
          </button>
        </div>

        <div className="flex justify-end items-center">
            {showSuccess && <p className="text-green-400 mr-4">Settings saved successfully!</p>}
            <button type="submit" className="bg-brand-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-700 transition">
                Save Changes
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
