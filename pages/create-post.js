import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { Select } from '@/components/index';
import { supabase } from '@/utils/supabaseClient';
import { tags } from '@/utils/tags';
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const initialState = { title: '', content: '', tag: '' };

function CreatePost() {
  const router = useRouter();
  const [post, setPost] = useState(initialState);
  const { title, content, tag } = post;

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function createNewPost() {
    if (!title || !content) return;

    const user = supabase.auth.user();

    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .filter('id', 'eq', user.id)
      .single();

    const { data } = await supabase
      .from('posts')
      .insert([
        {
          title,
          tag,
          content,
          user_id: user.id,
          author_name: profile.name,
          type: 'content',
        },
      ])
      .single();

    router.push(`/posts/${data.id}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <Select
        className="max-w-sm py-6"
        name="tag"
        options={tags}
        selected={post.tag}
        setSelected={onChange}
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <button
        disabled={!title || !content}
        onClick={createNewPost}
        className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <span className="relative">Create post</span>
      </button>
    </div>
  );
}

export default CreatePost;
