import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import InputGroup from '../components/InputGroup';

import { useAuthState } from '../context/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const { authenticated } = useAuthState();

  if (authenticated) {
    router.push('/');
  }

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    if (!agreement) {
      setErrors({ ...errors, agreement: 'You must agree to T&Cs' });
      return;
    }

    try {
      await axios.post('/auth/register', {
        email,
        password,
        username,
      });
      router.push('/login');
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: `url('/images/bricks.jpg')` }}
      />

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy
            Policy.
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label
                htmlFor="agreement"
                className="text-xs cursor-pointer"
              >
                I agree to get emails about cool stuff on Reddit
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              type="email"
              error={errors.email}
              className="mb-2"
              value={email}
              setValue={setEmail}
              placeholder="Email"
            />
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
              sign up
            </button>
          </form>
          <small>
            Already a have account?{' '}
            <Link href="/login">
              <a className="ml-1 font-bold text-blue-500 uppercase">
                log in
              </a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
