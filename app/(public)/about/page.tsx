'use client';

import React, {useState, useEffect} from 'react'
import loading2 from "@/app/public/loading2.gif";
import Image from 'next/image';
import About from "@/app/components/About";
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
    <div className="bg-white"><About/></div>
  )
}

export default page