import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/auth/signup', { email, name, password });
      setSuccess(res.data.message);
      // Don't navigate, show the success message so they know to check email
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/80 flex items-center justify-center bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/ab180a27-b661-44d7-a6d9-940cb32f2f4a/7fb62e44-31fd-4e1c-bba3-11738d011504/US-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center bg-blend-overlay relative">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      <div className="bg-black/75 p-12 rounded-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Sign Up</h1>
        
        {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-500/20 text-green-500 p-3 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-4 bg-gray-800/80 rounded border border-gray-600 focus:outline-none focus:border-white text-white placeholder-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign In now.
          </Link>
        </p>
      </div>
    </div>
  );
}
