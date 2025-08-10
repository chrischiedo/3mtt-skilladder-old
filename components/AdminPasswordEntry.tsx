'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface AdminPasswordEntryProps {
  onCorrectPassword: () => void;
}

export default function AdminPasswordEntry({
  onCorrectPassword,
}: AdminPasswordEntryProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '3MTT__admin@') {
      onCorrectPassword();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-blue-50 p-3 rounded-full">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-gray-600">
              Please enter the admin password to continue
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-500">
                  Incorrect password
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
