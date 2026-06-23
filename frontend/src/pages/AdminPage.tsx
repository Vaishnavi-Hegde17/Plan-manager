import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { FastForward, CreditCard, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [sub, setSub] = useState<any>(null);
  const [simulatedDate, setSimulatedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [subRes, timeRes] = await Promise.all([
        axios.get(`http://127.0.0.1:5000/subscription?userId=${user?.id}`),
        axios.get(`http://127.0.0.1:5000/admin/time`)
      ]);
      setSub(subRes.data);
      setSimulatedDate(new Date(timeRes.data.simulatedCurrentDate).toLocaleString());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const simulateSuccess = async () => {
    setLoading(true);
    await axios.post('http://127.0.0.1:5000/admin/simulate-success', { subscriptionId: sub.id });
    await fetchData();
    setLoading(false);
  };

  const simulateFailure = async () => {
    setLoading(true);
    await axios.post('http://127.0.0.1:5000/admin/simulate-failure', { subscriptionId: sub.id });
    await fetchData();
    setLoading(false);
  };

  const advanceTime = async (days: number) => {
    setLoading(true);
    await axios.post('http://127.0.0.1:5000/admin/advance-time', { days });
    await fetchData();
    setLoading(false);
  };

  const resetTime = async () => {
    setLoading(true);
    await axios.post('http://127.0.0.1:5000/admin/reset');
    await fetchData();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-red-500 flex items-center gap-3 mb-8">
          <ShieldAlert /> Demo Admin Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Panel */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Current State</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Simulated Time:</span>
                <span className="text-blue-400 font-bold">{simulatedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Subscription Status:</span>
                <span className={`font-bold ${sub?.status === 'ACTIVE' ? 'text-green-500' : sub?.status === 'GRACE_PERIOD' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {sub?.status || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Period End:</span>
                <span>{sub ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Grace Period End:</span>
                <span className="text-yellow-500">{sub?.gracePeriodEnd ? new Date(sub.gracePeriodEnd).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Simulation Controls</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={simulateSuccess} 
                  disabled={loading}
                  className="bg-green-600/20 hover:bg-green-600/40 text-green-500 border border-green-600/50 p-3 rounded font-bold transition flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 size={24} /> Force Success
                </button>
                <button 
                  onClick={simulateFailure} 
                  disabled={loading}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/50 p-3 rounded font-bold transition flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard size={24} /> Force Failure
                </button>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-400 mb-3">Time Travel (Cron Test)</p>
                <div className="flex gap-2">
                  <button onClick={() => advanceTime(1)} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded font-medium flex items-center justify-center gap-2 transition disabled:opacity-50">
                    <FastForward size={16} /> +1 Day
                  </button>
                  <button onClick={() => advanceTime(3)} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded font-medium flex items-center justify-center gap-2 transition disabled:opacity-50">
                    <FastForward size={16} /> +3 Days
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <button onClick={resetTime} disabled={loading} className="w-full bg-gray-700 hover:bg-gray-600 text-white p-2 rounded font-medium flex items-center justify-center gap-2 transition disabled:opacity-50">
                  <RotateCcw size={16} /> Reset Time to Now
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
