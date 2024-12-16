// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import supabase from '../../utils/supabase.ts';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch the initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Unsubscribe on cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser }; 
};
