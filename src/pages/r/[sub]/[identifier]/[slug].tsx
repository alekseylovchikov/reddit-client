import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import classNames from 'classnames';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { useAuthState } from '../../../../context/auth';
import { Post, Comment } from '../../../../types';
import Sidebar from '../../../../components/Sidebar';
import ActionButton from '../../../../components/ActionButton';
import { FormEvent, useEffect, useState } from 'react';

export default function PostPage() {
  const [newComment, setNewComment] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated, user } = useAuthState();

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug
      ? `/posts/${identifier}/${slug}/comments`
      : null
  );

  if (error) router.push('/');

  useEffect(() => {
    if (!post) return;

    let desc = post.body || post.title;
    desc = desc.substring(0, 158).concat('..');
    setDescription(desc);
  }, [post]);

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) await router.push('/login');

    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      await axios.post('/misc/vote', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `/posts/${post.identifier}/${post.slug}/comments`,
        {
          body: newComment,
        }
      );

      revalidate();

      setNewComment('');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={post?.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={post?.title} />
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">
                /r/{sub}
              </p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
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
                    <p className="text-xs font-bold">
                      {post.voteScore}
                    </p>
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
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
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
                    <h1 className="my-1 text-xl font-medium">
                      {post.title}
                    </h1>
                    <p className="my-3 text-sm">{post.body}</p>
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
                {/*comment input area*/}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{' '}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          value={newComment}
                          onChange={(e) =>
                            setNewComment(e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                        />
                        <div className="flex justify-end">
                          <button
                            disabled={!newComment.trim()}
                            className="px-3 py-1 blue button"
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-300 rounded">
                      <p className="text-gray-700">
                        Log in or sign in up to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-2 hollow blue button">
                            Login
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">
                            Sign Up
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {/*comments*/}
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    {/*votes*/}
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                      <div
                        onClick={() => vote(1, comment)}
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      >
                        <i
                          className={classNames('icon-arrow-up', {
                            'text-red-500': comment.userVote === 1,
                          })}
                        />
                      </div>
                      <p className="text-xs font-bold">
                        {comment.voteScore}
                      </p>
                      <div
                        onClick={() => vote(-1, comment)}
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      >
                        <i
                          className={classNames('icon-arrow-down', {
                            'text-blue-600': comment.userVote === -1,
                          })}
                        />
                      </div>
                    </div>
                    {/*votes end*/}
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
