import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  selectedUserById,
  updateUserProfile,
  deleteUser,
} from "@/lib/features/dashboard/userSlice";
import { logoutUser } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import avatar from "@/app/public/avatar.jpg";
import ReactCountryFlag from "react-country-flag";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import AddSkillModal from "./AddSkillModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { addSkillToUser } from "@/lib/features/skills/skillsSlice";
import Select from "react-select";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getMissingFields = (profile) => {
  const requiredFields = [
    "name",
    "email",
    "bio",
    "country",
    "Github",
    "LinkedIn",
    "Skills looking for",
    "languages",
    "photo",
    "availability",
  ];
  return requiredFields.filter(
    (field) =>
      !profile[field] ||
      (Array.isArray(profile[field]) && profile[field].length === 0)
  );
};

const ProfileManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  // const skill = useSelector((state: RootState) => state.skills.skill);


  const [profile, setProfile] = useState({
    avatar: avatar,
    name: "",
    email: "",
    bio: "",
    country: "",
    Github: "",
    LinkedIn: "",
    skillsLookingFor: [],
    languages: [],
    availability: [],
  });

  const [editField, setEditField] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableLanguages, setAailableLanguages] = useState([
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Russian", label: "Russian" },
    { value: "Arabic", label: "Arabic" },
    { value: "Hindi", label: "Hindi" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Italian", label: "Italian" },
    { value: "Dutch", label: "Dutch" },
    { value: "Polish", label: "Polish" },
    { value: "Swedish", label: "Swedish" },
    { value: "Turkish", label: "Turkish" },
    { value: "Vietnamese", label: "Vietnamese" },
    { value: "Greek", label: "Greek" },
    { value: "Czech", label: "Czech" },
    { value: "Finnish", label: "Finnish" },
    { value: "Danish", label: "Danish" },
    { value: "Norwegian", label: "Norwegian" },
    { value: "Hungarian", label: "Hungarian" },
    { value: "Romanian", label: "Romanian" },
    { value: "Thai", label: "Thai" },
    { value: "Bulgarian", label: "Bulgarian" },
    { value: "Indonesian", label: "Indonesian" },
    { value: "Malay", label: "Malay" },
    { value: "Ukrainian", label: "Ukrainian" },
    { value: "Slovak", label: "Slovak" },
    { value: "Croatian", label: "Croatian" },
    { value: "Lithuanian", label: "Lithuanian" },
    { value: "Slovenian", label: "Slovenian" },
    { value: "Latvian", label: "Latvian" },
    { value: "Estonian", label: "Estonian" },
    { value: "Serbian", label: "Serbian" },
    { value: "Catalan", label: "Catalan" },
    { value: "Basque", label: "Basque" },
    { value: "Galician", label: "Galician" },
    { value: "Welsh", label: "Welsh" },
  ]);
  const [isVacationMode, setIsVacationMode] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(selectedUserById(user.id))
        .then((response) => {
          if (response.payload) {
            const data = response.payload.data;
            setProfile({
              photo: data.photo || "",
              name: data.name || "",
              email: data.email || "",
              bio: data.bio || "",
              country: data.country || "",
              Github: data.Github || "",
              LinkedIn: data.LinkedIn || "",
              skillsLookingFor: data.skillsLookingFor || [],
              languages: data.languages || [],
              availability: data.availability || [],
            });
            setIsVacationMode(data.isVacationMode || false); // Set vacation mode status

            const userLanguages = data.languages.map((language) => ({
              value: language,
              label: language,
            }));
            setSelectedLanguages(userLanguages);
            setAvailability(data.availability || []);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [dispatch, user]);

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions);
  };
  const handleAddAvailability = () => {
    if (selectedDate && selectedTime) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const newAvailability = { date: dateString, times: [selectedTime] };
      setAvailability([...availability, newAvailability]);
      setSelectedDate(null);
      setSelectedTime("");
    }
  };

  const handleSave = async () => {
    const updatedLanguages = selectedLanguages.map((option) => option.value);
    const updatedProfile = { ...profile, languages: updatedLanguages, availability, isVacationMode };

    try {
      const response = await dispatch(updateUserProfile({ id: user.id, userData: updatedProfile }));
      if (response.payload.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    }
  };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            photo: base64String,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };



  const PROFILE_COMPLETION_COLORS = {
    low: "#FF0000",
    medium: "#dada0d",
    high: "#008000",
  };

  const calculateProfileCompletion = () => {
    const fields = [
      "name",
      "email",
      "bio",
      "country",
      "Github",
      "LinkedIn",
      "skillsLookingFor",
    ];
    const filled = fields.filter(
      (field) => profile[field as keyof typeof profile]
    );
    const percentage = Math.round((filled.length / fields.length) * 100);

    const color =
      percentage < 30
        ? PROFILE_COMPLETION_COLORS.low
        : percentage < 60
          ? PROFILE_COMPLETION_COLORS.medium
          : PROFILE_COMPLETION_COLORS.high;

    return { percentage, color };
  };

  const { percentage, color } = calculateProfileCompletion();

//   const handleSave = async () => {
//     try {
//         const response = await dispatch(updateUserProfile({ id: user.id, userData: profile }));
//         console.log("Response:", response);
//     } catch (error) {
//         console.error("Error updating profile:", error);
//     }
// };
// const handleAddAvailability = (date) => {
//   setAvailability([...availability, { date: date.toISOString().split("T")[0], times: [] }]);
// };

// const handleSave = async () => {
//   const updatedLanguages = selectedLanguages.map((option) => option.value);
//   const updatedProfile = { ...profile, languages: updatedLanguages, availability };

//   try {
//     const response = await dispatch(updateUserProfile({ id: user.id, userData: updatedProfile }));
//     console.log("Response:", response);
//     if (response.payload.success) {
//       toast.success("Profile updated successfully!");
//     } else {
//       toast.error("Failed to update profile.");
//     }
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     toast.error("Error updating profile.");
//   }
// };
  const missingFields = getMissingFields(profile);
  const handleDeleteAccount = async () => {
    if (
      user &&
      user.id &&
      confirm("Are you sure you want to delete your account?")
    ) {
      await dispatch(deleteUser(user.id));
      dispatch(logoutUser());
      router.push("/signin");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg w-full lg:w-2/3">
      {/* Profile Progress */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <div className="w-full">
          <p className="text-brown">Profile Strength</p>
          <div className="flex items-center">
            <progress
              value={percentage}
              max="100"
              className="w-full"
              style={{ color }}
            ></progress>
            <span className="ml-2" style={{ color }}>
              {percentage}%
            </span>
          </div>
          <button
            className="text-brown hover:underline mt-2"
            onClick={() => setShowMissingFields(!showMissingFields)}
          >
            What's Missing?
          </button>
          {showMissingFields && (
            <div className="mt-2 text-sm text-gray-600">
              {missingFields.length > 0 ? (
                <ul>
                  {missingFields.map((field) => (
                    <li key={field}>{field} is missing</li>
                  ))}
                </ul>
              ) : (
                "All fields are complete!"
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row justify-between mb-3">
        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-brown mb-3">
            Welcome, {profile.name || "Guest"}!
          </h2>
          <div className="flex items-start mt-4 lg:mt-16">
            <button
              type="button"
              onClick={() => setShowSkillModal(true)}
              className="text-white bg-blue px-4 py-2 rounded-md"
            >
              Add Skill
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center">
          <img
            src={profile.photo || avatar}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full"
          />
          <div className="ml-0 lg:ml-4 mt-4 lg:mt-0">
            {editField === "name" ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
            ) : (
              <p>{profile.name || "No Name"}</p>
            )}
            {editField === "email" ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="border p-2 w-full"
              />
            ) : (
              <p>{profile.email || "No Email"}</p>
            )}
            {profile.country && (
              <ReactCountryFlag
                countryCode={profile.country}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                  marginRight: "0.5rem",
                }}
                title={profile.country}
              />
            )}
            <button
              onClick={() => setEditField(editField === "name" ? null : "name")}
              className="text-blue hover:underline mt-2"
            >
              Edit Info
            </button>
            <div className="mt-2">
              <label className="block text-sm font-medium text-brown">
                Update Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-6">
        <label className="block font-medium text-brown">Bio:</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="About You"
          className="border bg-white p-2 w-full"
          rows={4}
        ></textarea>
        <p className="text-gray text-sm mt-1">
          The community wants to get to know you! The more you describe
          yourself, the more other members are likely to reach out to you. (
          {profile.bio.length} characters)
        </p>
      </div>

      {/* Country Selection */}
      <div className="mb-6">
        <label className="block font-medium text-brown">Country:</label>
        <select
          value={profile.country}
          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
          className="border bg-white p-2 w-full"
        >
          <option value="">Select Country</option>
          <option value="DE">Germany 🇩🇪</option>
          <option value="CA">Canada 🇨🇦</option>
        </select>
      </div>

      {/* Social Media Links */}
      <div className="mb-6">
        <label className="block font-medium text-brown">Social Media:</label>
        <div className="flex items-center mb-2">
          <FaGithub style={{ color: "black" }} />
          <span className="text-black px-3"> GitHub:</span>{" "}
          <input
            type="url"
            value={profile.Github}
            onChange={(e) => setProfile({ ...profile, Github: e.target.value })}
            placeholder={profile.Github || "GitHub URL"}
            className="border  bg-white p-2 w-full ml-2"
          />
        </div>
        <div className="flex items-center">
          <FaLinkedin style={{ color: "#0077B5" }} />
          <span className="text-blue px-2">LinkedIn:</span>
          <input
            type="url"
            value={profile.LinkedIn}
            onChange={(e) =>
              setProfile({ ...profile, LinkedIn: e.target.value })
            }
            placeholder={profile.LinkedIn || "LinkedIn URL"}
            className="border bg-white p-2 w-full ml-2"
          />
        </div>
      </div>
      {/* Languages */}
      <div className="mt-4 mb-4">
        <h3 className="text-lg text-brown mb-2">Languages:</h3>
        <Select
          isMulti
          value={selectedLanguages}
          onChange={(selectedLanguages) => setSelectedLanguages(selectedLanguages)}
          options={availableLanguages}
          className="basic-multi-select text-gray"
          classNamePrefix="select"
        />
      </div>

            {/* Availability */}
            <div className="mt-4 mb-4">
        <h3 className="text-lg text-brown mb-2">Availability:</h3>
        {isVacationMode ? (
          <p className="text-red-500">Availability is blocked due to vacation mode.</p>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row items-center mb-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select a date"
                className="w-full px-4 py-2 border bg-white rounded-md focus:ring-blue focus:border-blue"
              />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border text-black bg-white rounded-md focus:ring-blue focus:border-blue mt-4 lg:mt-0 lg:ml-4"
              />
              <button
                onClick={handleAddAvailability}
                className="bg-blue text-white px-4 py-2 rounded mt-4 lg:mt-0 lg:ml-4"
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {availability.map((avail, index) => (
                <li key={index} className="mb-2">
                  <strong>{avail.date}</strong>
                  <ul>
                    {avail.times.map((time, idx) => (
                      <li key={idx}>{time}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Skills Section */}
      <div className="mb-6">
        <label className="block bg-white font-medium text-brown">
          Skills Looking For:
        </label>
        {[
          "Machine Learning",
          "Web Development",
          "Mobile Development",
          "Data Science",
          "Cybersecurity",
          "DevOps",
          "AI Development",
          "Graphic Design",
        ].map((skill) => (
          <>
            <label key={skill} className="inline-flex items-center mt-3">
              <input
                type="checkbox"
                checked={profile.skillsLookingFor.includes(skill)}
                onChange={() =>
                  setProfile((prev) => ({
                    ...prev,
                    skillsLookingFor: prev.skillsLookingFor.includes(skill)
                      ? prev.skillsLookingFor.filter((s) => s !== skill)
                      : [...prev.skillsLookingFor, skill],
                  }))
                }
                className="form-checkbox h-5 w-5 text-gray"
              />
              <span className=" flex ml-2 mx-3 justify-center text-gray">
                {skill}
              </span>
            </label>
            {profile.skillsLookingFor.includes(skill) && (
              <input
                type="text"
                placeholder={`Details about ${skill}`}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    skillsLookingForDetails: {
                      ...profile.skillsLookingForDetails,
                      [skill]: e.target.value,
                    },
                  })
                }
                className="border bg-white mx-5 p-2 w-full mb-2 mt-1"
              />
            )}
          </>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between">
        <button
          onClick={handleSave}
          className={`bg-orange text-white px-4 py-2 rounded hover:underline mb-4 lg:mb-0`}
        >
          Save
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-blue text-white px-4 py-2 rounded hover:underline mb-4 lg:mb-0"
        >
          Change Password
        </button>
        <button
          onClick={() => handleDeleteAccount()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:underline"
        >
          Delete Account
        </button>
      </div>

      {/* Modals for Password Change and Delete Account */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          userId={user?.id}
        />
      )}
      {/* Modals */}
      {showSkillModal && (
        <AddSkillModal
          onClose={() => setShowSkillModal(false)}
          userId={user?.id}
          // onAddSkill={onAddSkill}
        />
      )}
    </div>
  );
};

export default ProfileManagement;
