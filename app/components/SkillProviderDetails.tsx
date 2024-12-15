"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { selectedUserById, followUser } from "@/lib/features/dashboard/userSlice";
import avatar from "@/app/public/avatar.jpg";
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";
import AddSkillModal from "./AddSkillModal";
import ModalConversation from "@/app/components/ModalConversation";
import LinkedIn from "@/app/public/LinkedIn.png";
import github from "@/app/public/github.jpg";

interface Provider {
  _id: string;
  name: string;
  email: string;
  country: string;
  bio?: string;
  photo?: string;
  languages: string[];
  LinkedIn?: string;
  Github?: string;
  skillsLookingFor: string[];
  skills: {
    _id: string;
    title: string;
    description: string;
    category: string;
    photo: string;
    reviews: {
      user: string;
      rating: number;
      comment: string;
    }[];
  }[];
  followers: string[];
}

const SkillProviderDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(selectedUserById(id))
        .unwrap()
        .then((response) => {
          if (response.success) {
            setProvider(response.data);
            setFollowing(response.data.followers?.includes(currentUser.id) || false);
          } else {
            console.error("Failed to fetch provider:", response.error.message);
          }
          setLoading(false);
        });
    }
  }, [dispatch, id, currentUser.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return <div>Provider not found</div>;
  }

  const handleAddSkill = () => {
    setShowAddSkillModal(true);
  };

  const handleStartConversation = () => {
    setShowConversationModal(true);
  };

  const handleCancelConversation = () => {
    setShowConversationModal(false);
  };

  const handleFollow = async () => {
    const action = following ? "unfollow" : "follow";
    try {
      const res = await dispatch(
        followUser({
          userId: provider._id,
          currentUserId: currentUser.id,
          action,
        })
      );
      if (res.payload.success) {
        setFollowing(!following);
      } else {
        console.error("Follow action failed:", res.payload.error);
      }
    } catch (error) {
      console.error("Error during follow action:", error);
    }
  };

  return (
    <div className="max-w-7xl w-2/3 bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={provider.photo || avatar}
                alt="Profile"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl text-brown font-semibold">
              {provider.name}
            </h2>
            {provider.country && (
              <ReactCountryFlag
                countryCode={provider.country}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                  marginRight: "0.5rem",
                }}
                title={provider.country}
              />
            )}
            <p className="text-gray text-sm mt-2">
              Member since {new Date(provider.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Verification Badges */}
          <div className="mt-6 flex justify-center gap-2">
            {provider.LinkedIn && (
              <span className="bg-blue p-2 rounded-full">
                <Link href={provider.LinkedIn} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer">
                    <Image
                      src={LinkedIn}
                      width={20}
                      height={20}
                      alt="LinkedIn Verified"
                      className="hover:opacity-80 transition-opacity"
                    />
                  </a>
                </Link>
              </span>
            )}

            {provider.Github && (
              <span className="bg-black p-2 rounded-full">
                <Link href={provider.Github} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer">
                    <Image
                      src={github}
                      width={20}
                      height={20}
                      alt="Github Verified"
                      className="hover:opacity-80 transition-opacity"
                    />
                  </a>
                </Link>
              </span>
            )}
          </div>
          <div className="mt-6">
            <p className="text-gray text-justify text-sm ">{provider.bio}</p>
          </div>

          {/* Follow/Unfollow Button */}
          <div className="mt-4 flex justify-center items-center">
            <button
              onClick={handleFollow}
              className={`flex items-center px-4 py-2 rounded-full text-white ${
                following
                  ? "bg-orange hover:bg-orange hover:opacity-80"
                  : "bg-blue hover:bg-blue"
              } transition-colors duration-300`}
            >
              {following ? "Unfollow" : "Follow"}
              {/* {provider.followers.length} */}
            </button>
          </div>

          {/* Start Conversation Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartConversation}
              className="bg-blue text-white py-2 px-4 rounded-md hover:bg-blue hover:opacity-80 transition-colors duration-300"
            >
              Start a Conversation
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Sections */}
          <div className="space-y-6">
            {/* Looking For */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-brown">Looking for:</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {provider.skillsLookingFor.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {/* Languages */}
              <div className="mt-4 mb-4">
                <h3 className="text-lg text-brown mb-2">Languages:</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-orange text-white px-3 py-1 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Offered Services */}
            <div className="bg-white rounded-lg shadow p-6 sm:p-1">
              <h3 className="text-lg text-brown mb-4">Offered Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {provider.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="relative cursor-pointer bg-white border rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    {/* Skill Image */}
                    <div
                      className="relative h-0 overflow-hidden"
                      style={{ paddingTop: "80%" }}
                    >
                      <img
                        src={skill.photo}
                        alt={skill.title}
                        className="absolute text-sm top-0 left-0 w-full h-full object-cover rounded-t-lg transition-opacity duration-300 hover:opacity-75"
                      />
                      {/* Hover Effect for Description */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 flex items-center justify-center p-4 rounded-t-lg transition-opacity duration-300">
                        <p className="text-center text-xs">
                          {skill.description}
                        </p>
                      </div>
                    </div>

                    {/* User Avatar */}
                    <div className="absolute top-2 left-2">
                      <img
                        src={provider.photo || "/default-avatar.jpg"}
                        alt={provider.name || "User"}
                        className="w-10 h-10 rounded-full border-2 border-white shadow"
                      />
                    </div>

                    {/* Title and Category */}
                    <div className="p-4 bg-beige h-24 rounded-b-lg">
                      <h4 className="text-lg font-semibold text-brown transition-opacity duration-300 hover:opacity-70">
                        {skill.title}
                      </h4>
                      <h6 className="text-sm text-gray transition-opacity duration-300 hover:opacity-50">
                        {skill.category}
                      </h6>
                      {/* Reviews */}
                      {/* <div className="mt-2">
                        {skill.reviews.map((review, index) => (
                          <div key={index} className="text-sm text-gray">
                            <strong>{review.user}</strong>: {review.comment} (
                            {review.rating}/5)
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

  
          </div>
        </div>
      </div>

      {showConversationModal && (
        <ModalConversation
          providerId={provider._id}
          closeModal={handleCancelConversation}
        />
      )}
    </div>
  );
};

export default SkillProviderDetails;



// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { selectedUserById } from '@/lib/features/dashboard/userSlice';
// import avatar from '@/app/public/avatar.jpg';
// import Image from 'next/image';
// import { FaLinkedin, FaGithub } from 'react-icons/fa';
// import ModalConversation from '@/app/components/ModalConversation';

// interface Provider {
//   _id: string;
//   name: string;
//   email: string;
//   country: string;
//   bio?: string;
//   photo?: string;
//   languages: string[];
//   LinkedIn?: string;
//   Github?: string;
//   skillsLookingFor: string[];
//   skills: string[];
// }

// const SkillProviderDetails: React.FC = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [provider, setProvider] = useState<Provider | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

  
//     useEffect(() => {
//       if (id) {
//         dispatch(selectedUserById(id))
//           .unwrap()
//           .then((response) => {
//             if (response.success) {
//               setProvider(response.data);
//             } else {
//               console.error('Failed to fetch provider:', response.message);
//             }
//           })
//           .catch((error) => {
//             console.error('Failed to fetch provider:', error);
//             alert('An error occurred while fetching provider details.');
//           });
//       }
//     }, [dispatch, id]);
  
//     const handleStartConversation = () => {
//       setShowModal(true);
//       console.log('Start a conversation');
//     };
  
//     const handleCancelConversation = () => {
//       setShowModal(false);
//       console.log('Cancel conversation'); 
//     };


//   if (!provider) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-xl text-gray-600">Provider not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto max-w-full max-h-full p-6 bg-white rounded-lg shadow-lg">
//       {/* Header Section */}
//       <div className="flex items-center gap-6 mt-3 mb-8 max-w-6xl">
//         <img
//           src={provider.photo}
//           alt={provider.name}
//           width={120}
//           height={120}
//           className="rounded-full border border-gray object-cover"
//         />
//         <div>
//           <h1 className="text-3xl  font-bold text-brown">{provider.name}</h1>
//           <p className="text-gray pt-3 text-justify text-wrap ">{provider.bio || 'No bio available'}</p>
//         </div>
//       </div>

//       {/* Information Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div>
//           <h2 className="text-lg font-semibold text-brown">Location</h2>
//           <p className="text-gray">{provider.country || 'Not specified'}</p>
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold text-brown">Languages</h2>
//           <p className="text-gray">
//             {provider.languages.length > 0
//               ? provider.languages.join(', ')
//               : 'No languages specified'}
//           </p>
//         </div>
//       </div>

//       {/* Social Links */}
//       <div className="flex gap-6 mb-8">
//         {provider.LinkedIn && (
//           <a
//             href={provider.LinkedIn}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-blue hover:text-blue transition"
//           >
//             <FaLinkedin size={24} />
//             <span>LinkedIn</span>
//           </a>
//         )}
//         {provider.Github && (
//           <a
//             href={provider.Github}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-black hover:text-gray-600 transition"
//           >
//             <FaGithub size={24} />
//             <span>GitHub</span>
//           </a>
//         )}
//       </div>

//       {/* Skills Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div>
//           <h2 className="text-xl font-semibold text-brown mb-4">Skills Offered</h2>
//           {provider.skills.length > 0 ? (
//             <ul className="list-disc list-inside text-gray">
//               {provider.skills.map((skill, index) => (
//                 <li key={index}>{skill.title}</li> 
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray">No skills offered</p>
//           )}
//         </div>
//         <div>
//           <h2 className="text-xl font-semibold text-brown mb-4">Skills Needed</h2>
//           {provider.skillsLookingFor.length > 0 ? (
//             <ul className="list-disc list-inside text-gray">
//               {provider.skillsLookingFor.map((skill, index) => (
//                 <li key={index}>{skill.title}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray">No skills needed</p>
//           )}
//         </div>
//       </div>

//       {/* CTA Button */}
//       <div className="text-center">
//         <button
//           onClick= { handleStartConversation } 
//           className="bg-blue text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition">
//           Start a Conversation
//         </button>
//         {showModal && (<ModalConversation providerId={id} closeModal={handleCancelConversation} />)}
          
//       </div>
     

//     </div>
//   );
// };

// export default SkillProviderDetails;

