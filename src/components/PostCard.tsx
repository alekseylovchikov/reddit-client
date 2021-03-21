import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';

import { Post } from '../types';
import axios from 'axios';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  revalidate?: Function;
}

import ActionButton from './ActionButton';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';

export default function PostCard({
  post,
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();
  const isInSubPage = router.pathname === '/r/[sub]';

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login');

    if (value === post.userVote) value = 0;

    try {
      await axios.post('/misc/vote', {
        identifier: post.identifier,
        slug: post.slug,
        value,
      });

      if (revalidate) revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex mb-4 bg-white rounder" id={post.identifier}>
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          onClick={() => vote(1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <i
            className={classNames('icon-arrow-up', {
              'text-red-500': post.userVote === 1,
            })}
          />
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        <div
          onClick={() => vote(-1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
        >
          <i
            className={classNames('icon-arrow-down', {
              'text-blue-600': post.userVote === -1,
            })}
          />
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <>
              <Link href={`/r/${post.subName}`}>
                <img
                  alt=""
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                  src={post.sub.imageUrl}
                />
              </Link>
              <Link href={`/r/${post.subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/{post.subName}
                </a>
              </Link>
              <span className="mx-1 text-gray-500">•</span>
            </>
          )}
          <p className="text-xs text-gray-500">
            Posted by{' '}
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">
                /u/{post.username}
              </a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm">{post.body}</p>}
        <div className="flex">
          <Link href={post.url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs" />
                <span className="font-bold">
                  {post.commentCount} Comments
                </span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs" />
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs" />
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
