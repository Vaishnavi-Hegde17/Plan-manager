import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.post('http://127.0.0.1:5000/auth/verify-email', { token });
        setStatus('success');
        setMessage(res.data.message);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full text-center border border-gray-800 shadow-2xl">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#E50914] animate-spin mb-4" />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link 
              to="/login" 
              className="bg-[#E50914] text-white px-8 py-3 rounded font-semibold hover:bg-[#b00710] transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link 
              to="/signup" 
              className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition"
            >
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
