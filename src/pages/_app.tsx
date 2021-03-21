import { AppProps } from 'next/app';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import '../styles/tailwind.css';
import '../styles/icons.css';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/auth';

axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
