import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const signinWithGoogle = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  return (
    <div>
      <button onClick={signinWithGoogle}>Login</button>
    </div>
  );
};

export default LoginPage;
