// import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { GetServerSideProps } from 'next';
import useSWR from 'swr';

import { Post, Sub } from '../types';

import PostCard from '../components/PostCard';

export default function Home() {
  const { data: posts } = useSWR('/posts');
  const { data: topSubs } = useSWR('/misc/top-subs');

  return (
    <>
      <Head>
        <title>Reddit clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pt-4">
        {/* posts feed */}
        <div className="w-160">
          {posts?.map((post: Post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
        {/* sidebar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub: Sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="rounded-full w-6 h-6 overflow-hidden mr-2">
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
