import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (email) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black ">
      <div className="text-center">
        <label className="text-white text-4xl" htmlFor="">
          Sign in via magic link with your email below
        </label>
        <div className="mb-6" className="flex flex-row gap-x-4 p-4">
          <input
            className="block w-full bg-white px-6 py-4 font-bold placeholder-gray-900 border border-gray-50 rounded-full focus:outline-none"
            type="text"
            name="field-name"
            placeholder="your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="inline-block py-4 px-12 text-white text-center font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200"
            onClick={() => handleLogin(email)}
            disabled={loading}>
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  {
    /* return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
            className="button block"
            disabled={loading}>
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>
        </div>
      </div>
    </div>
  ); */
  }
}
