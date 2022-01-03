import { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonBlack, ButtonPurple } from '@/components/atoms';
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

      <div className="flex flex-row items-center">
        <ButtonBlack onClick={previewData} disabled={!url}>
          <span className="relative text-white">Get metadata</span>
        </ButtonBlack>
        <ButtonPurple onClick={createNewBookmark} disabled={!metadata}>
          <span className="relative">Create bookmark</span>
        </ButtonPurple>
      </div>
      {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
    </div>
  );
}

export default CreatePost;
