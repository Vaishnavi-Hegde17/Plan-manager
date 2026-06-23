import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col">
        <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/ab180a27-b661-44d7-a6d9-940cb32f2f4a/7fb62e44-31fd-4e1c-bba3-11738d011504/US-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-black/80" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 lg:px-12">
          <h1 className="text-[#E50914] text-4xl font-black tracking-tighter">PLAN RENEWAL</h1>
          <Link 
            to="/login"
            className="bg-[#E50914] hover:bg-[#b00710] text-white px-4 py-1.5 rounded font-medium transition"
          >
            Sign In
          </Link>
        </header>

        {/* Hero Content */}
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-4">Unlimited movies, TV shows, and more</h1>
          <p className="text-xl md:text-2xl font-medium mb-8">Watch anywhere. Cancel anytime.</p>
          <p className="text-lg md:text-xl mb-4">Ready to watch? Enter your email to create or restart your membership.</p>
          
          <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-grow p-4 bg-gray-900/70 border border-gray-600 rounded text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
            />
            <Link 
              to="/signup"
              className="bg-[#E50914] hover:bg-[#b00710] text-white px-8 py-4 rounded font-bold text-xl flex items-center justify-center gap-2 transition"
            >
              Get Started <ChevronRight size={24} />
            </Link>
          </div>
        </main>
      </div>

      <div className="h-2 bg-gray-800 w-full" />
    </div>
  );
}
