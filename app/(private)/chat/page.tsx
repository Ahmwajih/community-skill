'use client';
import React, { useState, useEffect } from 'react';
import loading2 from "@/app/public/loading2.gif";
import Image from 'next/image';
import ChatWindow from "@/app/components/ChatWindow";
import Protect from "@/app/components/Protect";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

function page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center bg-white items-center h-screen">
        <Image src={loading2} alt="Loading..." width={250} height={250} />
      </div>
    );
  }
  return (
    <Protect>
      <Navbar />
      <ChatWindow />
      <Footer />
    </Protect>
  )
}

export default page;