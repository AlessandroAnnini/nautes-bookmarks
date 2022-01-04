import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

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
      <p className="text-sm font-light mt-4">
        written by {post.metadata.author || 'unknown'}
      </p>
      {post.metadata.date && (
        <p className="text-sm font-light">
          on {dayjs(post.metadata.date).format('LL')}
        </p>
      )}
      <p className="text-sm font-light my-4">
        bookmarked by {post.author_name}
      </p>
      <a href={post.metadata.url} target="_blank" rel="noreferrer">
        <div
          className="container mx-auto max-w-sm py-12"
          style={{ position: 'relative' }}>
          <Image
            layout="responsive"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(700, 475)
            )}`}
            width={700}
            height={475}
            src={`/api/imgproxy?url=${post.metadata.image}`}
            alt={post.title}
          />
        </div>
      </a>
      <article className="prose lg:prose-xl pb-6">
        <p>{post.metadata.description}</p>
      </article>
      <audio controls style={{ width: '100%' }}>
        <source src={post.metadata.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="container mx-auto text-right my-8">
        <a
          href={post.metadata.url}
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group">
          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
          <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
          <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
          <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
            Open link
          </span>
        </a>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { data, error } = await supabase.from('posts').select('id');

  const paths = data.map((post) => ({
    params: { id: JSON.stringify(post.id) },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  const { data } = await supabase
    .from('posts')
    .select()
    .filter('id', 'eq', id)
    .single();

  return {
    props: {
      post: data,
    },
  };
}
