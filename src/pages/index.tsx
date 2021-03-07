import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
// import { GetServerSideProps } from 'next';
import useSWR from 'swr';

import { Post } from '../types';

import PostCard from '../components/PostCard';

export default function Home() {
  const { data: posts } = useSWR('/posts');

  return (
    <div className="pt-12">
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
      </div>
    </div>
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
