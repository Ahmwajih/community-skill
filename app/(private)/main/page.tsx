"use client";
import React, {useState, useEffect} from 'react'
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/Navbar";
import Protect from "@/app/components/Protect";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import loading2 from "@/app/public/loading2.gif";
import Image from 'next/image';

import {
  searchSkills,
  setSearchResults,
} from "@/lib/features/skills/skillsSlice";

import FiltredCountry from "@/app/components/FiltredCountry";
import Footer from "@/app/components/Footer";

function Pages() {
  const searchResults = useSelector(
    (state: RootState) => state.skills.searchResults
  );


  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); 
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
      <FiltredCountry searchResults={searchResults} />
      <Footer />
    </Protect>
  );
}

export default Pages;
