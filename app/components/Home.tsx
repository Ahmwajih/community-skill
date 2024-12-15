'use client'
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/app/components/Login";
import Headers from "@/app/components/Headers";
import Faq from "@/app/components/Faq";
import SkillList from "@/app/components/SkillList";
import Footer from "@/app/components/Footer";
const Home: React.FC = () => {
  return (
    <div>
      <Headers />
      <Login />
      <Faq />
      <SkillList />
      <Footer />{" "}
    </div>
  );
};

export default Home;
