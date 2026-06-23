import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Play, Info, Settings, LogOut } from 'lucide-react';

const MOVIES = [
  { id: 1, title: 'Inception', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80' },
  { id: 2, title: 'Interstellar', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80' },
  { id: 3, title: 'The Matrix', img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80' },
  { id: 4, title: 'Dune', img: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&q=80' },
  { id: 5, title: 'Blade Runner', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80' },
];

export default function BrowsePage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between p-6 transition-all duration-300">
        <div className="flex items-center gap-8">
          <h1 className="text-[#E50914] text-2xl font-black tracking-tighter">PLAN RENEWAL</h1>
          <ul className="hidden md:flex gap-4 text-sm font-medium">
            <li className="cursor-pointer font-bold">Home</li>
            <li className="cursor-pointer text-gray-300 hover:text-white transition">TV Shows</li>
            <li className="cursor-pointer text-gray-300 hover:text-white transition">Movies</li>
          </ul>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/account" className="flex items-center gap-2 hover:text-gray-300 transition">
            <Settings size={20} />
            <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
          </Link>
          <button onClick={logout} className="hover:text-gray-300 transition" title="Log Out">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Hero Movie */}
      <div className="relative h-[80vh] w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent" />
        </div>
        <div className="absolute bottom-[20%] left-12 max-w-xl z-10 space-y-4">
          <h1 className="text-6xl font-black mb-4 drop-shadow-lg">THE ALGORITHM</h1>
          <p className="text-lg text-gray-200 drop-shadow-md text-shadow">
            In a world where artificial intelligence dictates your subscription renewals, one developer must brave the 3-day grace period to save his premium access.
          </p>
          <div className="flex gap-3 mt-4">
            <button className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-bold hover:bg-white/80 transition">
              <Play fill="black" size={20} /> Play
            </button>
            <button className="bg-gray-500/70 text-white px-6 py-2 rounded flex items-center gap-2 font-bold hover:bg-gray-500/50 transition">
              <Info size={20} /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="px-12 pb-20 -mt-20 relative z-20">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {MOVIES.map(movie => (
            <div key={movie.id} className="min-w-[250px] aspect-video relative group cursor-pointer rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-30">
              <img src={movie.img} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="font-bold">{movie.title}</span>
              </div>
            </div>
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-4 mt-8 text-gray-200">Continue Watching for {user?.name}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
           {MOVIES.slice().reverse().map(movie => (
            <div key={`cw-${movie.id}`} className="min-w-[250px] aspect-video relative group cursor-pointer rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-30">
              <img src={movie.img} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="font-bold">{movie.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
