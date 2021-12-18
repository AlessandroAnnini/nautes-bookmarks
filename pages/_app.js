import { useState, useEffect } from 'react';
import { Provider } from 'react-supabase';
import { Header } from '@/components/Header';
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
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
