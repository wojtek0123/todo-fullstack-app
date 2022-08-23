import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();

  const signinWithGoogle = async () => {
    signIn('google', {
      callbackUrl: window.location.href,
      redirect: false,
    });
  };

  useEffect(() => {
    if (data) {
      router.push('/');
    }
  }, [data, router]);

  return (
    <div className='absolute bg-black/90 inset-0'>
      <div className='absolute inset-0 bg-blue-600 flex flex-col items-center justify-center px-2 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4 max-w-[600px] sm:rounded-2xl'>
        <h1 className='text-center text-white text-4xl mb-20'>
          Log into a Fullstack ToDo App!
        </h1>
        <button
          onClick={signinWithGoogle}
          className='bg-white px-8 py-2 rounded cursor-pointer text-lg hover:bg-white/70 transition ease-in'
        >
          Login via Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
