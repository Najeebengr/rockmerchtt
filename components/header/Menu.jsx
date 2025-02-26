'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Menu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav>
      {/* Your existing menu items */}
      
      {/* Auth Menu Items */}
      {!user ? (
        <>
          <Link href="/login" className="menu-item">
            Login
          </Link>
          <Link href="/register" className="menu-item">
            Register
          </Link>
        </>
      ) : (
        <div className="user-menu">
          <span className="welcome-text">
            Welcome, {user.email}
          </span>
          {user.role === 'admin' && (
            <Link href="/admin" className="menu-item">
              Admin Dashboard
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="menu-item logout-btn"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
} 