"use client";
import './globals.css'; 
import { SessionProvider } from "next-auth/react";
import StoreProvider from '@/app/StoreProvider'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <StoreProvider>
        <SessionProvider>{children}</SessionProvider>
        <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}