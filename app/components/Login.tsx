'use client';

import { useAuth } from "@/hooks/useAuth";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default function Login() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {!user && <SignIn />}
    </div>
  );
}
