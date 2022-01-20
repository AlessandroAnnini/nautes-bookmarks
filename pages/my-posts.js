import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  async function fetchPosts() {
    const user = supabase.auth.user();

    const { data } = await supabase
      .from('posts')
      .select('*')
      .filter('user_id', 'eq', user.id)
      .order('inserted_at', { ascending: false });

    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function deletePost(id) {
    await supabase.from('posts').delete().match({ id });
    fetchPosts();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        My Posts
      </h1>
      {posts.map((post, index) => (
        <div key={index} className="border-b border-gray-300	mt-8 pb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          {post.type === 'content' && (
            <Link href={`/edit-post/${post.id}`}>
              <a className="text-sm mr-4 text-blue-500">Edit Post</a>
            </Link>
          )}
          <Link
            href={`/${post.type === 'content' ? 'posts' : 'bookmarks'}/${
              post.id
            }`}>
            <a className="text-sm mr-4 text-blue-500">View Post</a>
          </Link>
          <button
            className="text-sm mr-4 text-red-500"
            onClick={() => deletePost(post.id)}>
            Delete Post
          </button>
        </div>
      ))}
    </div>
  );
}
