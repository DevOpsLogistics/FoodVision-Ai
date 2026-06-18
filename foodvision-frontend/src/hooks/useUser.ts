import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  avatar: string | null;
  banner: string | null;
  email: string;
  hotline: string;
  support: string;
  address: string;
}

const defaultUser: UserProfile = {
  name: "",
  avatar: null,
  banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
  email: "",
  hotline: "",
  support: "",
  address: "",
};

export function useUser() {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user_profile');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    };
    
    loadUser();
    
    window.addEventListener('user_profile_updated', loadUser);
    return () => window.removeEventListener('user_profile_updated', loadUser);
  }, []);

  const updateUser = (newUser: Partial<UserProfile>) => {
    const updated = { ...user, ...newUser };
    localStorage.setItem('user_profile', JSON.stringify(updated));
    window.dispatchEvent(new Event('user_profile_updated'));
    setUser(updated);
  };

  return { user, updateUser };
}
