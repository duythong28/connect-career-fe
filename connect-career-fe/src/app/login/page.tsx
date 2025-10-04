'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Mock users data for authentication
const users = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'candidate' as const
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'employer' as const
  },
  {
    id: 'user3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const
  }
];

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - find user by email
    const user = users.find(u => u.email === loginForm.email);
    if (user) {
      // In a real app, you would set the user in context/state management
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`
      });
      
      // Navigate to appropriate dashboard based on role
      if (user.role === 'candidate') {
        router.push('/candidate/dashboard');
      } else if (user.role === 'employer') {
        router.push('/employer/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password"
      });
    }
    if (loginForm.email && loginForm.password) {
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      
      // Redirect based on user role (mock logic)
      if (loginForm.email.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (loginForm.email.includes('employer')) {
        router.push('/employer/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please enter both email and password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}