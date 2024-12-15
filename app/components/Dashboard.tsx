"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  selectedUserById,
  followUser,
  updateUserProfile,
} from "@/lib/features/dashboard/userSlice";
import { addSkillToUser } from "@/lib/features/skills/skillsSlice";
import { fetchSkillById } from "@/lib/features/skills/skillsSlice";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/navigation";
import AddSkillModal from "./AddSkillModal";
import Link from "next/link";
import Image from "next/image";
import LinkedIn from "@/app/public/LinkedIn.png";
import github from "@/app/public/github.jpg";
import avatar from "@/app/public/avatar.jpg";

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [following, setFollowing] = useState(false);

  const router = useRouter();
  const handleClickCard = (id) => {
    router.push(`/skill_card_detail/${id}`);
  };

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    location: "",
    photo: "",
    LinkedIn: "",
    Github: "",
    followers: 0,
    memberSince: "",
    skills: [],
    skillsLookingFor: [],
    bio: "",
    languages: [],
    isVacationMode: false, // Add vacation mode status
  });

  const handleAddSkill = () => {
    setShowAddSkillModal(true);
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(selectedUserById(user.id))
        .unwrap()
        .then((response) => {
          setProfileData({
            name: response.data.name,
            email: response.data.email,
            country: response.data.country,
            photo: response.data.photo,
            followers: response.data.followers,
            languages: response.data.languages || [],
            memberSince: new Date(response.data.createdAt).toLocaleDateString(),
            LinkedIn: response.data.LinkedIn,
            Github: response.data.Github,
            skills: response.data.skills || [],
            skillsLookingFor: response.data.skillsLookingFor || [],
            bio: response.data.bio || "No Bio",
            isVacationMode: response.data.isVacationMode || false, // Set vacation mode status
          });
          setIsVacationMode(response.data.isVacationMode || false); // Set vacation mode status
        });
    }
  }, [dispatch, user]);

  const handleFollow = async () => {
    const action = following ? "unfollow" : "follow";
    try {
      const res = await dispatch(
        followUser({
          userId: user.id,
          currentUserId: "674dfb05a84536e50c1b8f8e",
          action,
        })
      );
      if (res.success) {
        setFollowing(!following);
      } else {
        console.error("Follow action failed:", res);
      }
    } catch (error) {
      console.error("Error during follow action:", error);
    }
  };

  const handleVacationModeToggle = async () => {
    const updatedProfile = { ...profileData, isVacationMode: !isVacationMode };
    try {
      const response = await dispatch(updateUserProfile({ id: user.id, userData: updatedProfile }));
      if (response.payload.success) {
        setIsVacationMode(!isVacationMode);
      } else {
        console.error("Failed to update vacation mode.");
      }
    } catch (error) {
      console.error("Error updating vacation mode:", error);
    }
  };

  const calculateProfileStrength = () => {
    const fields = [
      "name",
      "email",
      "country",
      "photo",
      "skills",
      "skillsLookingFor",
    ];
    const completedFields = fields.filter(
      (field) =>
        profileData[field] &&
        (Array.isArray(profileData[field])
          ? profileData[field].length > 0
          : true)
    );
    return Math.round((completedFields.length / fields.length) * 100);
  };

  return (
    <div className="max-w-7xl w-full bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={profileData.photo || avatar}
                alt="Profile"
                layout="fill"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <h2 className="text-xl text-brown font-semibold">
              {profileData.name}
            </h2>
            {profileData.country && (
              <ReactCountryFlag
                countryCode={profileData.country}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                  marginRight: "0.5rem",
                }}
                title={profileData.country}
              />
            )}
            <p className="text-gray text-sm mt-2">
              Member since {profileData.memberSince}
            </p>
            <div className="mt-4 flex justify-center items-center">
              <div className={"flex items-center px-4 py-2 text-gray"}>
                <span className="mr-2">{profileData.followers.length}</span>
                <span className="mr-2">
                  {profileData.followers.length >= 2 ? "followers" : "follower"}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="mt-6 flex justify-center gap-2">
            {profileData.LinkedIn && (
              <span className="bg-blue p-2 rounded-full">
                <Link href={profileData.LinkedIn} passHref legacyBehavior>
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

            {profileData.LinkedIn && (
              <span className="bg-black p-2 rounded-full">
                <Link href={profileData.Github} passHref legacyBehavior>
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
            <p className="text-gray text-justify text-sm ">{profileData.bio}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Strength */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg text-brown">
                Profile Strength:{" "}
                <span className="text-red-500">
                  {calculateProfileStrength()}%
                </span>
              </h3>
              <Link href="/profile" className="text-blue hover:underline">
                Edit Profile
              </Link>
            </div>
            <div className="w-full bg-gray rounded-full h-2">
              <div
                className="bg-green-600 rounded-full h-2"
                style={{ width: `${calculateProfileStrength()}%` }}
              ></div>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-brown">
                Hey, I'm {profileData.name?.split(" ")[0]}!
              </h2>
              <div className="flex items-center gap-2 text-gray">
                <span>Vacation Mode</span>
                <button
                  onClick={handleVacationModeToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isVacationMode ? "bg-blue" : "bg-gray"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 ml-1 rounded-full bg-white transform transition-transform ${
                      isVacationMode ? "translate-x-6" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          {/* Skills Sections */}
          <div className="space-y-6">
            {/* Looking For */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-brown">Looking for:</h3>
                <Link href="/profile" className="text-blue hover:underline">
                  Edit Interests
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skillsLookingFor.map((skill, index) => (
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
                  {profileData.languages.map((language, index) => (
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
                {profileData.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="relative cursor-pointer bg-white border rounded-lg shadow hover:shadow-lg transition-shadow"
                    onClick={() => handleClickCard(skill._id)}
                  >
                    {/* Skill Image */}
                    <div
                      className="relative h-0 overflow-hidden"
                      style={{ paddingTop: "80%" }}
                    >
                      <img
                        src={skill.photo}
                        alt={skill.title}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg transition-opacity duration-300 hover:opacity-75"
                      />
                      {/* Hover Effect for Description */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 flex items-center justify-center p-4 rounded-t-lg transition-opacity duration-300">
                        <p className="text-center text-sm">
                          {skill.description}
                        </p>
                      </div>
                    </div>

                    {/* User Avatar */}
                    <div className="absolute top-2 left-2">
                      <img
                        src={profileData.photo || "/default-avatar.jpg"}
                        alt={profileData.name || "User"}
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
                    </div>
                  </div>
                ))}

                {/* Add Service Button Styled as a Card */}
                <button
                  onClick={handleAddSkill}
                  className="relative flex flex-col items-center justify-center border-dashed border-blue border rounded-lg p-4 text-blue hover:bg-blue hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 hover:text-white text-blue"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>Add Skills</span>
                </button>
              </div>
            </div>

            {showAddSkillModal && (
              <AddSkillModal
                onClose={() => setShowAddSkillModal(false)}
                userId={user?.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;