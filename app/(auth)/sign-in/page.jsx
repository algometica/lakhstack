"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Logged in successfully!');
      router.push('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="open-unsplash.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="/">
              <span className="sr-only">Home</span>
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C25.1319 7.88144 23.6941 5.67184 21.6766 4.12418C19.6591 2.57652 17.1651 1.77778 14.575 1.77778C11.9849 1.77778 9.49092 2.57652 7.47342 4.12418C5.45592 5.67184 4.01808 7.88144 3.37 10.3847H0.41ZM14.1195 24H13.2705C10.3562 24 7.47906 23.2745 4.90005 21.8746C2.32104 20.4747 0.1233 18.4408 -1.49144 15.9469C-3.10618 13.453 -3.9989 10.5891 -4.0999 7.64406L-2.99056 7.70256C-2.88556 10.4111 -2.03656 13.0546 -0.547056 15.4166C0.942444 17.7786 2.95044 19.7206 5.35944 21.1236C7.76844 22.5266 10.4864 23.2246 13.2705 23.2246H14.1195C16.9036 23.2246 19.6216 22.5266 22.0306 21.1236C24.4396 19.7206 26.4476 17.7786 27.9451 15.4166C29.4426 13.0546 30.2916 10.4111 30.3966 7.70256L31.506 7.64406C31.405 10.5891 30.5123 13.453 28.8975 15.9469C27.2828 18.4408 25.085 20.4747 22.506 21.8746C19.927 23.2745 17.0498 24 14.1355 24H14.1195Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to BesharamList
            </h2>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="/"
              >
                <span className="sr-only">Home</span>
                <svg
                  className="h-8 sm:h-10"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C25.1319 7.88144 23.6941 5.67184 21.6766 4.12418C19.6591 2.57652 17.1651 1.77778 14.575 1.77778C11.9849 1.77778 9.49092 2.57652 7.47342 4.12418C5.45592 5.67184 4.01808 7.88144 3.37 10.3847H0.41ZM14.1195 24H13.2705C10.3562 24 7.47906 23.2745 4.90005 21.8746C2.32104 20.4747 0.1233 18.4408 -1.49144 15.9469C-3.10618 13.453 -3.9989 10.5891 -4.0999 7.64406L-2.99056 7.70256C-2.88556 10.4111 -2.03656 13.0546 -0.547056 15.4166C0.942444 17.7786 2.95044 19.7206 5.35944 21.1236C7.76844 22.5266 10.4864 23.2246 13.2705 23.2246H14.1195C16.9036 23.2246 19.6216 22.5266 22.0306 21.1236C24.4396 19.7206 26.4476 17.7786 27.9451 15.4166C29.4426 13.0546 30.2916 10.4111 30.3966 7.70256L31.506 7.64406C31.405 10.5891 30.5123 13.453 28.8975 15.9469C27.2828 18.4408 25.085 20.4747 22.506 21.8746C19.927 23.2745 17.0498 24 14.1355 24H14.1195Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to BesharamList 🦑
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
} 