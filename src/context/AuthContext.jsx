import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Verify if they are in the admins table
          const { data: admin } = await supabase
            .from('admins')
            .select('id, name')
            .eq('id', session.user.id)
            .single();

          if (admin) {
            setUser({ ...session.user, role: 'admin', name: admin.name });
          } else {
            // Not an admin, sign out!
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking auth session', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setLoading(true);
        const { data: admin } = await supabase
          .from('admins')
          .select('id, name')
          .eq('id', session.user.id)
          .single();

        if (admin) {
          setUser({ ...session.user, role: 'admin', name: admin.name });
        } else {
          await supabase.auth.signOut();
          setUser(null);
        }
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if they exist in public.admins
      const { data: admin, error: adminErr } = await supabase
        .from('admins')
        .select('id, name')
        .eq('id', data.user.id)
        .single();

      if (!admin || adminErr) {
        await supabase.auth.signOut();
        return { success: false, error: 'Unauthorized access. Admins only.' };
      }

      setUser({ ...data.user, role: 'admin', name: admin.name });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Something went wrong.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Error logging out', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
