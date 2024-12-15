'use client';

import { auth } from "@/lib/firebase";

export default function SignOut() {
  return (
    <button onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
}