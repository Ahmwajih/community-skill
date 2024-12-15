'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface FAQItemProps {
  question: string;
  answer?: string;
}

const Faq: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false); 

  const toggleAccordion = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <div className="flex flex-col p-10 mt-4 ml-6 max-w-full bg-white rounded-md shadow-sm w-[750px] max-md:px-5">
      <div className="flex flex-wrap gap-5 justify-between text-xl font-bold text-gray max-md:max-w-full cursor-pointer" onClick={toggleAccordion}>
        <div className="max-md:max-w-full">{question}</div>
        
      
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8c9dcd100b527918a5c8b042fd2ca2e78e8000347118126fb6bbe5896b7b5ed?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
          alt=""
          className={`object-contain shrink-0 my-auto h-auto w-6 aspect-square max-md:hidden transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </div>
      

      {isOpen && answer && (
        <div className="self-start mt-4 text-base font-medium text-slate-500 max-md:max-w-full">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQSection: React.FC = () => {
  const faqs: FAQItemProps[] = [
    {
      question: "What is the Community Skills Exchange?",
      answer: "The Community Skills Exchange is a platform where individuals can share and receive various skills to help others."
    },
    { 
      question: "How Can I Participate in Skill Exchanges?", 
      answer: "You can participate by signing up on the platform and offering your skills or requesting others' expertise." 
    },
    { 
      question: "What Types of Skills Can I Offer or Request?", 
      answer: "You can offer or request a wide variety of skills including coding, writing, design, and more." 
    },
    { 
      question: "How Does the Rating System Work?", 
      answer: "The rating system allows users to rate their exchange partners based on the quality of the exchange." 
    },
    { 
      question: "What Should I Do if I Encounter Issues During an Exchange?", 
      answer: "If you encounter issues, contact us through our platform's contact page." 
    }
  ];

  return (
    <section className="flex flex-col self-stretch w-full bg-white max-md:max-w-full">
      <div className="flex overflow-hidden relative flex-col justify-center items-center px-20 py-20 w-full min-h-[1132px] max-md:px-5 max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d1b858c231d9ee5a91227d372091f23be7aa75a96207b2b3f8946e3bd325246?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
          alt="FAQ background"
          className="object-cover absolute inset-0 size-full"
        />
        <div className="flex relative flex-col justify-center max-w-full sm:mx-3 w-[897px]">
          <button className="bg-orange text-white overflow-hidden gap-0.5 self-stretch px-2 py-0.5 ml-11 text-xs font-medium text-center whitespace-nowrap  min-h-[22px] rounded-[36px] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] w-[75px]">
            FAQ
          </button>
          <h2 className="mt-4 text-5xl font-bold tracking-tighter leading-none text-center text-gray-800 max-md:max-w-full max-md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="self-stretch mt-4 text-xl font-medium leading-8 text-center text-slate-500 max-md:max-w-full">
            Skill Trade is the only community skills exchange platform that allows you to connect and collaborate on one platform
          </p>
          <div className="w-full mt-8 pr-8">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <Faq {...faq} />
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
