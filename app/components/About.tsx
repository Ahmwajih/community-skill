
' use client ';
import React from "react";
import Headers from "./Headers";
import Footer from "./Footer";
import Image from "next/image";
import about from "@/app/public/about.jpg";
import Logo from "../public/Logo.svg";
import headerimage from "../public/headerimage.jpg";
import Link from "next/link";
const About: React.FC = () => {
  return (
    <div className="m-0">
      <div className="bg-light-blue dark:bg-gray-800 text-brown dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:p-0 md:p-0">
          <Link href="/main">
            <Image className="logo hidden md:block" src={Logo} alt="logo" />
          </Link>
          <div className="flex justify-center items-center col-span-1 md:col-span-4">
            <h1 className="text-center font-roboto font-medium text-xl md:text-2xl lg:text-5xl">
              Empowering Connections through Skill Exchange
            </h1>
          </div>
        </div>
      </div>

     
      {/* <div className="flex flex-col md:flex-row items-center justify-center p-6 bg-white text-black">
        <div className="md:w-1/2 p-4">
          <Image src={about} alt="About Us" className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div className="md:w-1/2 p-4">
          <h1 className="text-3xl font-bold mb-4">About Us</h1>
          <p className="text-lg mb-4">
            Welcome to the Community Skill Exchange Platform, where learning and teaching come together in a vibrant, community-driven experience. Our mission is to create a space where individuals can connect, share, and develop valuable skills across a diverse range of interests and fields. Whether you’re here to teach what you know or learn something new, our platform is built to empower every user on their unique journey.
          </p>
          <p className="text-lg">
            In today’s rapidly evolving world, we believe that skill sharing is more than just gaining knowledge—it’s about building connections and unlocking new opportunities. That’s why we’ve designed an inclusive, user-friendly platform that simplifies the process of finding skill exchanges that match your goals. From language learning and tech skills to creative arts and wellness, the Community Skill Exchange Platform has something for everyone.
          </p>
        </div>
      </div> */}
      <section className="flex flex-col self-stretch w-full bg-white max-md:max-w-full">
        <div className="flex overflow-hidden relative flex-col justify-center items-center px-16 py-24 w-full min-h-[796px] max-md:px-5 max-md:max-w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5fd32c8ffeb0b15d2f4ebca8c74ebbd3d507d81eb53433933fcedfaa997276b4?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
            alt="Background pattern"
            className="object-cover absolute inset-0 size-full"
          />
          <div className="relative w-full max-w-7xl max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-2/5 max-md:w-full">
                <div className="flex relative flex-col text-left justify-center my-auto font-medium max-md:mt-10 mx-3">
                  <h2 className="mt-4 text-5xl font-bold tracking-tighter leading-none text-gray max-md:text-4xl">
                    About Us
                  </h2>
                  <p className="self-stretch mt-3.5 text-xl leading-8 text-justify text-gray max-md:max-w-full">
                    "Welcome to the Community Skill Exchange Platform, where
                    learning and teaching come together in a vibrant,
                    community-driven experience. Our mission is to create a
                    space where individuals can connect, share, and develop
                    valuable skills across a diverse range of interests and
                    fields. Whether you’re here to teach what you know or learn
                    something new, our platform is built to empower every user
                    on their unique journey."
                  </p>
                  <div className="gap-2 self-stretch mt-3.5 text-center">

                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/5 max-md:ml-0 max-md:w-full">
                <div className="relative w-fit mx-auto bg-white p-4 shadow-lg">
                  {/* First Decorative Image - Top Left */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e249fb477c5c0cb23f7fe15f97cb847ea3b586a835041d73bdc1d59d84b74d03?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
                    alt="Decorative element"
                    className="absolute top-[-20px] left-[-20px] max-w-[50px] md:max-w-[80px] lg:max-w-[100px]"
                  />

                  {/* Header Image */}
                  <Image
                    src={about}
                    alt="Header Image"
                    className="relative max-w-[300px] sm:max-w-[400px] lg:max-w-[600px] rounded-lg"
                  />

                  {/* Second Decorative Image - Bottom Right */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac09f2fb5ad59e6341f74b127d5d3924fb94360f70e9c34362f8044b403234d3?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
                    alt="Decorative element"
                    className="absolute bottom-[-20px] right-[-20px] max-w-[50px] md:max-w-[80px] lg:max-w-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full ">
        <Image
          src={headerimage}
          alt="header image"
          layout="responsive"
          width={1375}
          height={226}
          className="w-full h-auto"
        />
      </div>
      <Footer />
    </div>
  );
};

export default About;
