import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/browse');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/80 flex items-center justify-center bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/ab180a27-b661-44d7-a6d9-940cb32f2f4a/7fb62e44-31fd-4e1c-bba3-11738d011504/US-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center bg-blend-overlay relative">
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="bg-black/75 p-12 rounded-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Sign In</h1>
        
        {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-4 bg-gray-800/80 rounded border border-gray-600 focus:outline-none focus:border-white text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-gray-800/80 rounded border border-gray-600 focus:outline-none focus:border-white text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white p-4 rounded font-bold mt-6 hover:bg-[#b00710] transition-colors disabled:opacity-50 flex justify-center items-center"
          >
             {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-400 mt-8">
          New to PlanRenewal?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up now.
          </Link>
        </p>
      </div>
    </div>
  );
}
