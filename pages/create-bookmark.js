import { useState } from 'react';
// import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';

function CreatePost() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState(null);

  async function createNewBookmark() {
    if (!metadata) return;

    const user = supabase.auth.user();

    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .filter('id', 'eq', user.id)
      .single();

    // const id = uuid();
    // post.id = id;

    const { title, description: content } = metadata;

    const { data } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          user_id: user.id,
          author_name: profile.name,
          type: 'bookmark',
          metadata,
        },
      ])
      .single();

    router.push(`/bookmarks/${data.id}`);
  }

  const previewData = async () => {
    if (!url) return;

    const metadata = await fetch('/api/getMetadata', {
      method: 'POST',
      body: JSON.stringify({ targetUrl: url }),
    }).then((res) => res.json());

    setMetadata(metadata);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new bookmark
      </h1>
      <input
        onChange={(e) => setUrl(e.target.value)}
        name="url"
        placeholder="Url"
        value={url}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />

      {/* <button
        disabled={!url}
        onClick={previewData}
        className="mr-4 inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none">
        Preview metadata
      </button> */}

      <div className="flex flex-row items-center">
        <button
          disabled={!url}
          onClick={previewData}
          className="mr-4 relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md">
          <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
          <span className="relative px-6 py-3 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
            <span className="relative text-white">Get metadata</span>
          </span>
        </button>
        <button
          disabled={!metadata}
          onClick={createNewBookmark}
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
          <span className="relative">Create bookmark</span>
        </button>
      </div>
      {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
    </div>
  );
}

export default CreatePost;
