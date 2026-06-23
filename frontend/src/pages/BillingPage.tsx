import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronLeft, AlertTriangle, CreditCard, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export default function BillingPage() {
  const { user } = useAuthStore();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSub = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/subscription?userId=${user?.id}`);
      setSub(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSub();
  }, [user]);

  const recoverPayment = async () => {
    if (!sub) return;
    try {
      await axios.post('http://127.0.0.1:5000/subscription/update-payment', { subscriptionId: sub.id });
      fetchSub();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f3f3f3] flex justify-center pt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333] p-4 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/account" className="flex items-center gap-1 text-blue-500 hover:underline mb-8 font-medium">
          <ChevronLeft size={20} /> Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-8">Billing Details</h1>

        {/* Status Banner */}
        <div className={clsx("p-4 rounded-t-lg border-b-0 border border-gray-300 flex items-center gap-4", {
          'bg-green-100 text-green-800 border-green-200': sub?.status === 'ACTIVE',
          'bg-yellow-100 text-yellow-800 border-yellow-300': sub?.status === 'GRACE_PERIOD',
          'bg-red-100 text-red-800 border-red-200': sub?.status === 'FREE',
        })}>
          {sub?.status === 'GRACE_PERIOD' && <AlertTriangle />}
          <div>
            <h2 className="font-bold text-lg">
              {sub?.status === 'ACTIVE' && 'Your membership is active'}
              {sub?.status === 'GRACE_PERIOD' && 'Payment failed. Update your payment method.'}
              {sub?.status === 'FREE' && 'Your premium membership has ended.'}
            </h2>
            {sub?.status === 'GRACE_PERIOD' && (
              <p className="text-sm mt-1">Please update your payment method within 3 days or you will lose premium access.</p>
            )}
          </div>
        </div>

        {/* Main Details Card */}
        <div className="bg-white border border-gray-300 rounded-b-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Current Plan</p>
              <p className="text-xl font-bold">{sub?.planName || 'Free'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Next Billing Date</p>
              <p className="text-lg">
                {sub?.status === 'FREE' ? '-' : new Date(sub?.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>

            {sub?.gracePeriodEnd && (
              <div className="md:col-span-2 bg-yellow-50 p-4 rounded border border-yellow-200 flex justify-between items-center">
                <div>
                  <p className="text-sm text-yellow-800 font-bold uppercase mb-1">Grace Period Expires On</p>
                  <p className="text-lg font-medium text-yellow-900">{new Date(sub.gracePeriodEnd).toLocaleDateString()}</p>
                </div>
                {sub?.status === 'GRACE_PERIOD' && (
                  <button onClick={recoverPayment} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition">
                    <CreditCard size={18} /> Update Payment Method
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Visualization (Demo) */}
        <h2 className="text-xl font-bold mb-4">Renewal Timeline</h2>
        <div className="bg-white border border-gray-300 rounded-lg p-8 relative flex items-center justify-between">
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div className={clsx("absolute top-1/2 left-8 h-1 -translate-y-1/2 z-0 transition-all duration-500", {
            'bg-green-500 w-[0%]': sub?.status === 'ACTIVE' && !sub.gracePeriodEnd,
            'bg-yellow-500 w-[50%]': sub?.status === 'GRACE_PERIOD',
            'bg-red-500 w-[100%]': sub?.status === 'FREE',
            'bg-green-500 w-[100%]': sub?.status === 'ACTIVE' && sub.gracePeriodEnd, // Recovered
          })}></div>
          
          <TimelineNode label="Active" active={true} color="bg-green-500" />
          <TimelineNode label="Payment Failed" active={sub?.status !== 'ACTIVE' || sub?.gracePeriodEnd} color="bg-yellow-500" />
          {sub?.status === 'ACTIVE' && sub?.gracePeriodEnd ? (
             <TimelineNode label="Recovered" active={true} color="bg-green-500" />
          ) : (
             <TimelineNode label="Free Plan" active={sub?.status === 'FREE'} color="bg-red-500" />
          )}
        </div>

      </div>
    </div>
  );
}

function TimelineNode({ label, active, color }: { label: string, active: boolean, color: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-3 bg-white px-2">
      <div className={clsx("w-6 h-6 rounded-full border-4 transition-colors duration-500", active ? color : "bg-gray-200 border-gray-300", active ? "border-white shadow-md ring-2 ring-gray-200" : "")}></div>
      <span className={clsx("text-sm font-bold", active ? "text-gray-800" : "text-gray-400")}>{label}</span>
    </div>
  );
}
