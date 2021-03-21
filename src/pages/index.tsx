// import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { GetServerSideProps } from 'next';
import useSWR, { useSWRInfinite } from 'swr';

import { Post, Sub } from '../types';

import PostCard from '../components/PostCard';
import { useAuthState } from '../context/auth';
import { useEffect, useState } from 'react';

const description = 'Description';
const title = 'Reddit clone';

export default function Home() {
  const [observedPost, setObservedPost] = useState('');

  // const { data: posts } = useSWR<Post[]>('/posts');
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

  const { authenticated } = useAuthState();

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (el: HTMLElement) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          setPage(page + 1);
          observer.unobserve(el);
        }
      },
      { threshold: 1 }
    );
    observer.observe(el);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={title} />
      </Head>
      <div className="container flex px-4 pt-4 md:px-0">
        {/* posts feed */}
        <div className="w-full md:w-160">
          {isInitialLoading && (
            <p className="text-lg text-center">Loading...</p>
          )}
          {posts?.map((post) => (
            <PostCard
              key={post.identifier}
              post={post}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading more...</p>
          )}
        </div>
        {/* sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="w-6 h-6 mr-2 overflow-hidden rounded-full">
                    <Link href={`/r/${sub.name}`}>
                      <a>
                        <Image
                          src={sub.imageUrl}
                          alt="Sub"
                          width={(6 * 16) / 4}
                          height={(6 * 16) / 4}
                        />
                      </a>
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-medium">
                    {sub.postCount}
                  </p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// SSR render
// export const getServerSideProps: GetServerSideProps = async (
//   context
// ) => {
//   try {
//     const res = await axios.get('/posts');

//     return { props: { posts: res.data } };
//   } catch (error) {
//     return { props: { error: 'Error' } };
//   }
// };
