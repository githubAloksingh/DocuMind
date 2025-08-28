import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@/components/Auth';
import { MainApp } from '@/components/MainApp';
import type { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = () => {
    // This will trigger the auth state change listener
  };

  const handleSignOut = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthChange={handleAuthChange} />;
  }

  return (
    <MainApp 
      userEmail={user.email || ''} 
      onSignOut={handleSignOut}
    />
  );
}

export default App;