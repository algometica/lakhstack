'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, Mail } from 'lucide-react';
import Link from 'next/link';

const errorMessages = {
  Configuration: 'There was a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this application.',
  Verification: 'The verification link has expired or is invalid.',
  Default: 'An error occurred during authentication.'
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const errorMessage = errorMessages[error] || errorMessages.Default;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            {errorMessage}
          </p>
        </div>
        
        <div className="space-y-4">
          {error === 'AccessDenied' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Access Restricted</p>
                  <p className="mt-1">
                    This application is only available to authorized administrators. 
                    Please contact your system administrator if you believe you should have access.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/" className="flex items-center justify-center">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signin" className="flex items-center justify-center">
                Try Again
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}