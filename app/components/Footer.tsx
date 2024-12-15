"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { subscribeNewsletter } from '@/lib/features/newsletter/newsletterSlice';
import { createNewsletter } from '@/lib/features/newsletter/newsletterSlice';
import { toast } from 'react-toastify';

interface FooterProps {
  companyName: string;
  year: number;
}

const Footer: React.FC<FooterProps> = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // try {
    //   console.log('Email:', email);
    //   dispatch(subscribeNewsletter(email));
    //   setEmail('');
    // } catch (error) {
    //   toast.error('Failed to subscribe. Please try again later.');
    // }
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.status === 201) {
      toast.success(data.message);
      setEmail('');
    } else {
      toast.error(data.error);
    }

  };

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { name: "Facebook", url: "https://facebook.com" },
    { name: "Github", url: "https://github.com" },
    { name: "Instagram", url: "https://instagram.com" },
    { name: "Linkedin", url: "https://linkedin.com" },
  ];

  return (
    <footer className="flex flex-col bg-blue">
      <div className="flex flex-col items-center px-8 pt-10 pb-8 bg-blue-400 max-md:px-4 max-md:py-6">
        <div className="w-full max-w-[1366px]">
          <div className="flex md:gap-32  max-md:flex-col">
            <div className="flex flex-col w-[50%] max-md:w-full">
              <div className="flex flex-wrap gap-6 justify-between items-start text-white max-md:mt-5">
                <div className="flex flex-col font-bold">
                  <h2 className="self-start text-2xl font-poppins">
                    Community Skill Trade{" "}
                  </h2>
                  <p className="mt-4 text-xs max-md:text-sm font-poppins">
                    The experience with Skill Trade has been outstanding. Every
                    interaction within our community has been met with prompt
                    support and meaningful connections.
                  </p>
                </div>
                <nav className="flex flex-col items-start mt-2.5 text-xs font-bold">
                  <h3 className="ml-3 text-base text-white max-md:ml-2.5 font-poppins">Quick links</h3>
                  <ul>
                    {quickLinks.map((link) => (
                      <li
                        key={link.name}
                        className="gap-2.5 font-poppins self-stretch hover:opacity-80 hover:text-white text-white px-2.5 py-3 mt-4 min-h-[35px]"
                      >
                        <Link href={link.href}  style={{ textDecoration:"none", cursor: "pointer", color:"#ffffff" }}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="flex flex-col mt-2.5">
                  <nav className="flex flex-col items-start self-start ml-3 text-xs font-bold max-md:ml-2.5 font-poppins">
                    <h3 className="self-stretch text-base font-poppins">Social media</h3>
                    <ul className="mt-5 text-white">
                      {socialLinks.map((link, index) => (
                        <li key={link.name} className={index > 0 ? "mt-3 text-white" : ""}>
                          <Link
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                             className="text-white font-poppins hover:opacity-80 hover:text-white"
                             style={{ textDecoration:"none", cursor: "pointer" }}
                          >
                            {link.name}
                           
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[30%] max-md:w-full ">
              <div className="flex flex-col items-start mt-2.5 w-full max-md:mt-5">
                <h3 className="text-base font-bold text-white font-poppins">Newsletter</h3>
                <p className="mt-4 text-xs font-bold text-white font-poppins">
                  Subscribe to our newsletter to stay updated on the latest
                  skill exchange opportunities, community events, and exclusive
                  member perks.
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="flex gap-12 justify-evenly self-stretch max-w-52 pr-1 pl-5 mt-5 bg-white rounded-md"
                >
                  <label htmlFor="email" className="sr-only font-poppins">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="my-auto sm:max-w-26 text-xs font-medium text-black text-opacity-50 bg-transparent border-none outline-none"
                    aria-label="Enter your email"
                    required
                  />
                  <button
                    type="submit"
                    className="px-2 pt-3 pb-3 text-sm font-semibold font-poppins text-white whitespace-nowrap bg-blue-400 rounded max-md:px-4"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="flex justify-start">
        <p className="mt-10 text-base text-white font-poppins font-semibold max-md:mt-6">
          {" "}
          Community Skill Trade 2024 ©
        </p>
      </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
