import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-700/80 bg-slate-950/80 shadow-[0_10px_30px_rgba(2,6,23,0.7)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-violet-400 drop-shadow-[0_0_18px_rgba(167,139,250,0.45)]">
          AnAlgo
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <Link to="/" className="text-sm font-medium text-slate-300 transition hover:text-violet-400">
                Questions
              </Link>
              <Link to="/bookmarks" className="text-sm font-medium text-slate-300 transition hover:text-violet-400">
                Bookmarks
              </Link>
              <Link to="/progress" className="text-sm font-medium text-slate-300 transition hover:text-violet-400">
                Progress
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-slate-300 transition hover:text-violet-400">
                  Admin
                </Link>
              )}
              <span className="hidden text-sm font-medium text-slate-400 sm:inline">Hi, {user.name?.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 transition hover:text-violet-400">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
