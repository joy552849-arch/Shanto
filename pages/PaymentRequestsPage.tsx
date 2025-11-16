
import React from 'react';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalStateContext';
import { PaymentRequest } from '../types';
import { CheckCircleIcon, XCircleIcon } from '../components/icons/Icons';

const PaymentRequestsPage: React.FC = () => {
    const { payments } = useGlobalState();
    const dispatch = useGlobalDispatch();

    const handleApprove = (paymentId: string) => {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { paymentId, status: 'approved' } });
    };

    const handleReject = (paymentId: string) => {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { paymentId, status: 'rejected' } });
    };

    const getStatusChip = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-900 text-yellow-300">Pending</span>;
            case 'approved': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900 text-green-300">Approved</span>;
            case 'rejected': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-900 text-red-300">Rejected</span>;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Payment Requests</h1>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Package</th>
                            <th scope="col" className="px-6 py-3">Transaction ID</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...payments].reverse().map((req: PaymentRequest) => (
                            <tr key={req.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                    <div>{req.userName}</div>
                                    <div className="text-xs text-gray-400">{req.userEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>{req.packageName} ({req.packageCredits} credits)</div>
                                    <div className="text-xs text-brand-400 font-bold">৳{req.packagePrice}</div>
                                </td>
                                <td className="px-6 py-4 font-mono">{req.transactionId}</td>
                                <td className="px-6 py-4">{new Date(req.date).toLocaleString()}</td>
                                <td className="px-6 py-4">{getStatusChip(req.status)}</td>
                                <td className="px-6 py-4">
                                    {req.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleApprove(req.id)} className="p-2 text-green-400 hover:bg-green-500/10 rounded-full transition">
                                                <CheckCircleIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleReject(req.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition">
                                                <XCircleIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {payments.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No payment requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentRequestsPage;
