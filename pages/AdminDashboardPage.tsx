
import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { UsersIcon, DollarSignIcon, BarChartIcon } from '../components/icons/Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-brand-600 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { users, payments, currentUser } = useGlobalState();

    const totalUsers = users.length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const totalRevenue = payments
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.packagePrice, 0);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <h2 className="text-xl text-gray-300 mb-8">Welcome back, {currentUser?.name}!</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    icon={<UsersIcon className="w-6 h-6 text-white" />} 
                />
                <StatCard 
                    title="Pending Payments" 
                    value={pendingPayments} 
                    icon={<DollarSignIcon className="w-6 h-6 text-white" />} 
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`৳${totalRevenue.toLocaleString()}`} 
                    icon={<BarChartIcon className="w-6 h-6 text-white" />} 
                />
            </div>

            <div className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Quick Overview</h3>
                <p className="text-gray-400">
                    This is your control center. You can manage users, approve payment requests, and configure application settings from the sidebar.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
