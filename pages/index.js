import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Select } from '@/components/index';
import { supabase } from '@/utils/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { tags } from '@/utils/tags';

const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;

const myTags = [{ value: '', label: 'all' }, ...tags];

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = tag
        ? await supabase.from('posts').select().eq('tag', tag)
        : await supabase.from('posts').select();
      setPosts(data.reverse());
      setLoading(false);
    }

    fetchPosts();
  }, [tag]);

  if (loading) return <p className="text-2xl">Loading ...</p>;

  return (
    <div>
      <Head>
        <title>{websiteName}</title>
      </Head>

      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      {user && (
        <Link href="/my-posts" passHref>
          <a className="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group">
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
              <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
            </span>
            <span className="relative text-white">
              <FontAwesomeIcon icon={faListUl} />
            </span>
          </a>
        </Link>
      )}
      <Select
        className="max-w-sm py-6"
        name="tag"
        options={myTags}
        selected={tag}
        setSelected={(e) => setTag(e.target.value)}
      />
      {posts.length ? (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.type === 'content' ? 'posts' : 'bookmarks'}/${
              post.id
            }`}>
            <a className="block border-b border-gray-300	mt-8 pb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 mt-2">Author: {post.author_name}</p>
            </a>
          </Link>
        ))
      ) : (
        <p className="text-2xl">No posts.</p>
      )}
    </div>
  );
}
