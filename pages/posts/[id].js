/* eslint-disable react/no-children-prop */
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/utils/supabaseClient';

export default function Post({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">
        {post.title}
      </h1>
      <p className="text-sm font-light my-4">by {post.author_name}</p>
      <div className="mt-8">
        <ReactMarkdown className="prose" children={post.content} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .eq('type', 'content');

  const paths = data.map((id) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  const { data: post } = await supabase
    .from('posts')
    .select()
    .filter('id', 'eq', id)
    .single();

  return {
    props: { post },
  };
}
