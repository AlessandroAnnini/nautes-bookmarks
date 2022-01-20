import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { Select, ButtonPurple } from '@/components';
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
    if (!title || !content || !tag) return;

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
      <ButtonPurple disabled={!title || !content} onClick={createNewPost}>
        <span className="relative">Create post</span>
      </ButtonPurple>
    </div>
  );
}

export default CreatePost;
