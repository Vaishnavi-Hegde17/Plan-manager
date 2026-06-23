import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronRight, CreditCard, Shield, User, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333] p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/browse" className="text-[#E50914] text-2xl font-black">PLAN RENEWAL</Link>
        </div>
        
        <h1 className="text-3xl font-normal mb-8 flex items-center gap-4">
          Account
          <span className="text-sm text-gray-500 font-bold bg-white px-2 py-1 border border-gray-300 rounded shadow-sm">
            Member Since {new Date().getFullYear()}
          </span>
        </h1>

        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          {/* Membership & Billing */}
          <div className="flex flex-col md:flex-row p-6 border-b border-gray-200">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wider mb-2">Membership & Billing</h2>
              <button className="bg-gray-200 hover:bg-gray-300 transition text-black px-4 py-2 rounded shadow-sm text-sm font-medium">
                Cancel Membership
              </button>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                  <p className="font-bold">{user?.email}</p>
                  <p className="text-gray-500">Password: ********</p>
                </div>
                <div className="text-blue-500 hover:underline cursor-pointer">Change email</div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-gray-400" />
                  <span className="font-bold">•••• •••• •••• 4242</span>
                </div>
                <Link to="/account/billing" className="text-blue-500 hover:underline flex items-center gap-1">
                  Manage payment info <ChevronRight size={16} />
                </Link>
              </div>
              <div className="flex justify-end border-t border-gray-200 pt-4">
                <Link to="/account/billing" className="text-blue-500 hover:underline flex items-center gap-1">
                  View billing details <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="flex flex-col md:flex-row p-6 border-b border-gray-200">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wider mb-2">Plan Details</h2>
            </div>
            <div className="md:w-2/3 flex justify-between items-center">
              <div className="font-bold flex items-center gap-2">Premium <span className="border border-gray-400 text-xs px-1 rounded">4K</span></div>
              <Link to="/account/billing" className="text-blue-500 hover:underline cursor-pointer">Change plan</Link>
            </div>
          </div>

           {/* Admin */}
           <div className="flex flex-col md:flex-row p-6 border-b border-gray-200 bg-red-50">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wider mb-2">Demo Tools</h2>
            </div>
            <div className="md:w-2/3 flex justify-between items-center">
              <div className="text-gray-700">Simulate Time & Payments</div>
              <Link to="/admin" className="text-blue-500 hover:underline cursor-pointer flex items-center gap-1">
                Open Admin Panel <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <button onClick={logout} className="mt-8 flex items-center gap-2 text-gray-600 hover:text-black transition mx-auto">
          <LogOut size={20} /> Sign out of all devices
        </button>

      </div>
    </div>
  );
}
