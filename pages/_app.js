import { useState, useEffect } from 'react';
import { Provider } from 'react-supabase';
import { Header } from '@/components';
import { supabase } from '@/utils/supabaseClient';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(checkUser);
    checkUser();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
  }

  return (
    <Provider value={supabase}>
      <Header user={user} />
      <div className="container mx-auto px-8 py-4 pb-24">
        <Component {...pageProps} user={user} />
      </div>
    </Provider>
  );
}

export default MyApp;
