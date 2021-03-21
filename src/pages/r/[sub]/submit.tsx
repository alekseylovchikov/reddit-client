import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import axios from 'axios';

import Sidebar from '../../../components/Sidebar';
import { Post, Sub } from '../../../types';
import { FormEvent, useState } from 'react';
import { GetServerSideProps } from 'next';

export default function submit() {
  const router = useRouter();
  const { sub: subName } = router.query;
  const { data: sub, error } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (error) router.push('/');

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: sub.name,
      });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Reddit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">
            Submit a post to /r/{subName}
          </h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                className="w-full py-2 pl-3 pr-16 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                type="text"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              value={body}
              rows={4}
              placeholder="Text (optional)"
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
            />
            <div className="flex justify-end">
              <button
                disabled={!title.trim()}
                className="px-3 py-1 blue button"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) {
      throw new Error('Missing auth token cookie');
    }

    await axios.get('/auth/me', { headers: { cookie } });

    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: '/login' }).end();
  }
};
