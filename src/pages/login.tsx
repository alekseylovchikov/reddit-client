import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import InputGroup from '../components/InputGroup';
import { useAuthDispatch, useAuthState } from '../context/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  if (authenticated) {
    router.push('/');
  }

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/login', {
        password,
        username,
      });

      dispatch('LOGIN', res.data);

      // router.push('/');
      router.back();
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: `url('/images/bricks.jpg')` }}
      />

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <form onSubmit={submitForm}>
            <InputGroup
              type="text"
              error={errors.username}
              className="mb-2"
              value={username}
              setValue={setUsername}
              placeholder="Username"
            />
            <InputGroup
              type="password"
              error={errors.password}
              className="mb-4"
              value={password}
              setValue={setPassword}
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
            >
              login
            </button>
          </form>
          <small>
            New to Reddit?{' '}
            <Link href="/register">
              <a className="ml-1 font-bold text-blue-500 uppercase">
                sign up
              </a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
