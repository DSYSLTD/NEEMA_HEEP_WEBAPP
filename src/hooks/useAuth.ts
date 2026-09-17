import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface CMSUser {
  id: string;
  email: string;
  displayName: string;
  userName: string;
  role: 'Superadmin' | 'Author' | 'Editor' | 'Web Master' | 'Webmaster' | string;
  department: string;
  status: 'Active' | 'Disabled' | 'Pending';
  provider?: string;
  token?: string;
}

export function useAuth() {
  const [user, setUser] = useState<CMSUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Load user session from Supabase & verify user role in user_roles table
  const fetchAndVerifyRole = async (sessionUser: any): Promise<CMSUser | null> => {
    if (!sessionUser || !sessionUser.email) return null;

    const email = sessionUser.email.toLowerCase().trim();

    try {
      // Query user_roles table in Supabase
      const { data: roleRecord, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !roleRecord) {
        console.warn(`[Supabase Auth] Email ${email} not registered in user_roles table.`);
        
        // Hardcoded pre-approved check for Superadmin Patrick Munene as immediate fallback
        if (email === 'ptrckmunene@gmail.com') {
          return {
            id: sessionUser.id || 'usr-superadmin',
            email: 'ptrckmunene@gmail.com',
            displayName: 'Patrick Munene',
            userName: 'Patrick Munene',
            role: 'Superadmin',
            department: 'Executive Administration',
            status: 'Active',
            provider: sessionUser.app_metadata?.provider || 'email'
          };
        }

        if (email === 'muthonichar12@gmail.com') {
          return {
            id: sessionUser.id || 'usr-charity',
            email: 'muthonichar12@gmail.com',
            displayName: 'Charity Muthoni',
            userName: 'Charity Muthoni',
            role: 'Author',
            department: 'CMS Editorial',
            status: 'Active',
            provider: sessionUser.app_metadata?.provider || 'email'
          };
        }

        // Unapproved user!
        return null;
      }

      if (roleRecord.status !== 'Active') {
        throw new Error('Account Deactivated: Your CMS staff user account is currently disabled.');
      }

      return {
        id: sessionUser.id || roleRecord.id,
        email: roleRecord.email,
        displayName: roleRecord.user_name || sessionUser.user_metadata?.full_name || email.split('@')[0],
        userName: roleRecord.user_name,
        role: roleRecord.role,
        department: roleRecord.department || 'CMS Editorial',
        status: roleRecord.status,
        provider: sessionUser.app_metadata?.provider || 'email'
      };
    } catch (err) {
      console.error("Role verification error:", err);
      return null;
    }
  };

  useEffect(() => {
    // 1. Initial Supabase session check
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const verifiedUser = await fetchAndVerifyRole(session.user);
          if (verifiedUser) {
            setUser(verifiedUser);
            setIsAdmin(
              verifiedUser.email.toLowerCase() === 'ptrckmunene@gmail.com' ||
              verifiedUser.role === 'Superadmin' || 
              verifiedUser.role === 'Super Admin' || 
              verifiedUser.role === 'Site Administrator' || 
              verifiedUser.role === 'admin'
            );
            setIsAuthor(verifiedUser.role === 'Author');
          } else {
            // Unapproved user logged in via OAuth - sign out immediately
            await supabase.auth.signOut();
            setUser(null);
            setIsAdmin(false);
            setIsAuthor(false);
          }
        } else {
          // Check localStorage backup staff session
          const stored = localStorage.getItem('neema_supabase_staff_session');
          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setIsAdmin(
              parsed.email?.toLowerCase() === 'ptrckmunene@gmail.com' ||
              parsed.role === 'Superadmin' || 
              parsed.role === 'Super Admin' || 
              parsed.role === 'Site Administrator' ||
              parsed.role === 'admin'
            );
            setIsAuthor(parsed.role === 'Author');
          }
        }
      } catch (err) {
        console.error("Auth init failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const verifiedUser = await fetchAndVerifyRole(session.user);
        if (verifiedUser) {
          setUser(verifiedUser);
          setIsAdmin(
            verifiedUser.email?.toLowerCase() === 'ptrckmunene@gmail.com' ||
            verifiedUser.role === 'Superadmin' || 
            verifiedUser.role === 'Super Admin' || 
            verifiedUser.role === 'Site Administrator' ||
            verifiedUser.role === 'admin'
          );
          setIsAuthor(verifiedUser.role === 'Author');
          localStorage.setItem('neema_supabase_staff_session', JSON.stringify(verifiedUser));
        } else {
          await supabase.auth.signOut();
          localStorage.removeItem('neema_supabase_staff_session');
          setUser(null);
          setIsAdmin(false);
          setIsAuthor(false);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('neema_supabase_staff_session');
        setUser(null);
        setIsAdmin(false);
        setIsAuthor(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with Credentials (Email/Username + Password)
  const loginWithUsernamePassword = async (identifier: string, pass: string) => {
    setLoading(true);
    try {
      const cleanIdentifier = identifier.trim();
      
      // Determine email
      let loginEmail = cleanIdentifier;
      if (cleanIdentifier === 'Patrick Munene' || cleanIdentifier === 'admin_neema1' || cleanIdentifier.toLowerCase() === 'ptrckmunene@gmail.com') {
        loginEmail = 'ptrckmunene@gmail.com';
      } else if (cleanIdentifier === 'Charity Muthoni' || cleanIdentifier.toLowerCase() === 'muthonichar12@gmail.com' || cleanIdentifier.toLowerCase() === 'muthonichar12') {
        loginEmail = 'muthonichar12@gmail.com';
      }

      // Try Supabase Auth first
      let authUser: any = null;
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: pass
      });

      if (!authErr && authData?.user) {
        authUser = authData.user;
      }

      // Authenticate via server-side secure auth API if direct staff login or Supabase Auth is offline
      if (!authUser) {
        try {
          const authRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: cleanIdentifier, password: pass })
          });
          const authJson = await authRes.json();
          if (authJson.success && authJson.user) {
            authUser = {
              id: authJson.user.id || 'usr-staff',
              email: authJson.user.email || loginEmail,
              user_metadata: { full_name: authJson.user.fullName },
              app_metadata: { provider: 'server-auth' },
              role: authJson.user.role
            };
          }
        } catch {
          // Server offline fallback
        }

        if (!authUser) {
          // If neither Supabase Auth nor server-side login verified the credentials, reject access.
          throw new Error('Access Denied: Invalid email/username or security password.');
        }
      }

      if (!authUser) {
        throw new Error('Access Denied: Invalid email/username or security password.');
      }

      const verified = await fetchAndVerifyRole(authUser);
      if (!verified) {
        throw new Error('Access Denied: Your account is not an authorized CMS user role.');
      }

      setUser(verified);
      setIsAdmin(verified.role === 'Superadmin' || verified.role === 'Site Administrator');
      setIsAuthor(verified.role === 'Author');
      localStorage.setItem('neema_supabase_staff_session', JSON.stringify(verified));
      setLoading(false);
      return verified;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  // Sign in with Google OAuth (Only for authenticated/approved users)
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/staff-portal'
        }
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('neema_supabase_staff_session');
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setIsAuthor(false);
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return {
    user,
    isAdmin,
    isAuthor,
    loading,
    signOut,
    loginWithUsernamePassword,
    signInWithGoogle
  };
}
