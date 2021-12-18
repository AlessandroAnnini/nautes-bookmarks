import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/router';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const nextUser = await supabase.auth.user();
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`name`)
        .eq('id', nextUser.id)
        .single();

      setUser(nextUser);
      setProfile(data);

      // console.log('profileData: ', profileData);
      // if (!profileData) {
      //   router.push('/sign-in');
      // } else {
      //   setProfile(profileData);
      // }
    };

    fetchProfile();
  }, []);

  async function update() {
    try {
      setLoading(true);
      // const user = supabase.auth.user();

      const updates = {
        id: user.id,
        name,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className=" max-w-lg ">
      <h2>Hello, {user.email}</h2>
      <p>User ID: {user.id}</p>
      <div className="flex gap-4">
        <input
          className="bg-slate-300  px-6 py-4 font-bold placeholder-gray-900 border border-gray-50 rounded-full focus:outline-none"
          placeholder={profile ? profile.name : ''}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button
          className="inline-block py-4 px-6 text-white text-center font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200"
          onClick={update}
          disabled={loading}>
          set name
        </button>
      </div>
      <button
        className="inline-block py-4 px-6 text-white text-center font-bold bg-red-500 hover:bg-red-600 rounded-full transition duration-200"
        onClick={signOut}>
        sign out
      </button>
    </div>
  );
};

export default Profile;
