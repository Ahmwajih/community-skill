import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { setFormData, submitContactForm } from '@/lib/features/contact/contactSlice';
import Logo from "@/app/public/Logo.svg";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-toastify';


export const CONTACT_EMAIL = "communityskilltrade@yandex.com";
export const LOCATIONS = "Canada, Germany";

export interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

const CombinedComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.contact.formData);
  const status = useSelector((state: RootState) => state.contact.status);
  const error = useSelector((state: RootState) => state.contact.error);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitContactForm(formData));
    toast.success('Message sent successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4 bg-light-blue">
      {/* Header Section */}
      <header className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Link href="/">
          <Image src={Logo} alt="Logo" width={150} height={150} />
          </Link>
        </div>
      </header>

      <div className="flex flex-col md:flex-row py-6">
        <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
          <Image src="https://cdn.builder.io/api/v1/image/assets/b728ceb3dbd545adac55a3a07f0354a7/9248075a5c6bf3d9bfb9facd0eb7715a42d57ae51947ff5400166e350da2a6ed?apiKey=b728ceb3dbd545adac55a3a07f0354a7&" alt="Header" width={400} height={200} className="rounded-lg" />
        </div>
        <div className="md:w-1/2">
          {/* Social Icons */}
          <section className="text-center mb-8 text-brown">
            <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
            <div className="flex justify-center space-x-4">
              <Link href="/main">
                <FaFacebook size={40} />
              </Link>
              <Link href="/main">
                <FaTwitter size={40} />
              </Link>
              <Link href="/main">
                <FaInstagram size={40} />
              </Link>
              <Link href="/main">
                <FaLinkedin size={40} />
              </Link>
              <Link href="/main">
                <FaYoutube size={40} />
              </Link>
            </div>
          </section>

          {/* Contact Information */}
          <section className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brown mb-2">Contact Us</h2>
            <p className="text-brown">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue">{CONTACT_EMAIL}</a></p>
            <p className="text-brown">Locations: {LOCATIONS}</p>
          </section>

          {/* Contact Form */}
          <section className="py-4">
            <h2 className="text-2xl font-bold text-brown text-center mb-4">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="mb-4">
                <label htmlFor="fullName" className="block mb-2 font-medium text-brown">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-brown font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-brown mb-2 font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="flex justify-center ">
                <button
                  type="submit"
                  className="px-4 py-2 w-52 text-white bg-orange rounded-lg hover:bg-orange"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Submitting...' : 'Contact Us'}
                </button>
              </div>
              {status === 'failed' && <p className="text-red-500 text-center mt-4">{error}</p>}
              {status === 'succeeded' && <p className="text-green-500 text-center mt-4">Message sent successfully!</p>}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CombinedComponent;
