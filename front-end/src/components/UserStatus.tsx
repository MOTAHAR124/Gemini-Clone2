"use client";
import { useUser } from '@clerk/nextjs';

export default function UserStatus() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return <div className="text-green-600">Welcome, {user?.firstName || 'User'}!</div>;
  }
  return <div className="text-red-600">Please sign in.</div>;
} 