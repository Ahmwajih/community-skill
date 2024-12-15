"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkillById } from "@/lib/features/skills/skillsSlice";
import {
  getReviewsBySkillId,
  createReview,
} from "@/lib/features/reviews/reviewSlice";
import { RootState } from "@/lib/store";
import avatar from "@/app/public/avatar.jpg";
import Image from "next/image";
import ModalConversation from "@/app/components/ModalConversation";

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
  user: {
    name?: string;
    email?: string;
    country: string;
    bio?: string;
    photo?: string;
  };
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

interface Review {
  rating: number;
  comment: string;
  user: {
    name: string;
  };
  reviewedBy: string;
}

const baseUrl = NEXT_PUBLIC_BASE_URL;


const SkillCardDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
 

  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchSkillById(id))
        .then((response) => {
          if (response.payload) {
            setSkill(response.payload);
          } else {
            console.error("Failed to fetch skill:", response.error.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch skill:", error);
          alert("An error occurred while fetching skill details.");
          setLoading(false);
        });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(getReviewsBySkillId(id))
        .then((response) => {
          setReviews(response.payload);
        })
        .catch((error) => {
          console.error("Failed to fetch reviews:", error);
          alert("An error occurred while fetching reviews details.");
        });
    }
  }, [dispatch, id]);

  if (!skill) {
    return <p className="text-center">Skill not found.</p>;
  }
  const handleStartConversation = () => {
    setShowModal(true);
  };
  const handleCancelConversation = () => {
    setShowModal(false);
  }
  const handleReviewSubmit = async () => {
    const review = {
      skillId: skill._id,
      userId: skill.user._id,
      rating,
      comments: newReview,
      reviewedBy: currentUser.id, 
    };

    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    const data = await res.json();
    if (res.status == 201) { 
      const newReviewData = {
        ...data.data,
        user: {
          name: currentUser.name,
        },
        reviewedBy: {
          name: currentUser.name,
        },
        createdAt: new Date().toISOString(),
      };
      setReviews([...reviews, newReviewData]);
      setNewReview("");
      setRating(0);
    } else {
      console.error("Failed to create review");
    }
  };
  const handleProviderClick = () => {
    if (skill.user._id === currentUser.id) {
      router.push("/user_dashboard");
    } else {
      router.push(`/skill_provider_details/${skill.user._id}`);
    }
  };

  return (
    <div className="bg-neutral-50 shadow-lg  p-6 mx-auto w-full min-h-screen lg:flex lg:gap-6">
      {/* Left Side: Skill Details */}
      <div className="lg:w-2/3">
        {/* Header Image */}
        <div className="relative">
          {skill.photo ? (
            <img
              src={skill.photo}
              alt={skill.title}
              className="w-full h-48 object-cover rounded-t-lg lg:rounded-lg"
            />
          ) : (
            <Image
              src={avatar}
              alt={skill.title}
              className="w-full h-48 object-cover rounded-t-lg lg:rounded-lg"
            />
          )}
        </div>
        {/* Skill Information */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-brown">{skill.title}</h2>
          <p className="text-sm text-brown mt-2">{skill.description}</p>
          <p className="text-sm text-gray mt-4">
            <strong className="text-brown">Category:</strong> {skill.category}
          </p>
        </div>
        {/* Skill Provider Information */}
        <div className="mt-6 border-t pt-4">
          <div
            onClick={handleProviderClick}
            className="flex items-center gap-4"
          >
            {skill.user.photo ? (
              <img
                src={skill.user.photo}
                alt={skill.user.name || "User Avatar"}
                className="w-12 h-12 cursor-pointer rounded-full"
              />
            ) : (
              <Image
                src={avatar}
                alt={skill.user.name || "User Avatar"}
                className="w-12 h-12 cursor-pointer rounded-full"
              />
            )}
            <div>
              <p className="text-sm cursor-pointer font-medium text-gray">
                {skill.user.name || "Anonymous"}
              </p>
              <p className="text-xs text-gray">{skill.user.country}</p>
              <p className="text-xs text-gray">{skill.user.email}</p>
            </div>
          </div>
        </div>
        {/* Review Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold text-brown">Leave a Review</h3>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray"}`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="w-full mt-2 p-2 border bg-white rounded-lg text-sm text-gray-700"
            placeholder="Thank you for your great review!"
          ></textarea>
          <button
            onClick={handleReviewSubmit}
            className="mt-2 w-full bg-orange text-white py-2 px-4 rounded-lg hover:bg-blue-600 lg:w-auto lg:px-6"
          >
            Submit
          </button>

          {/* Display Reviews */}
          {reviews
            .slice(0, showAllReviews ? reviews.length : 5)
            .map((review, index) => (
              <div key={index} className="border-b py-2">
                <div className="flex justify-between items-center">
                  <p>
                    <strong className="text-brown">Reviewed by :</strong>{" "}
                    {review && review.user && review.user.name ? review.user.name : "Anonymous"} 
                  </p>
                  <p className="text-gray-500 text-xs">
                    {review && review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <p className="text-yellow-500">
                  <strong className="text-brown">Rating:</strong>{" "}
                  {review && review.rating ? "★".repeat(review.rating) + "☆".repeat(5 - review.rating) : "No rating"}
                </p>
                <p className="text-black">
                  {review && review.comments ? review.comments : "No comments"}
                </p>
              </div>
            ))}

          {/* See More Button */}
          {reviews.length > 5 && !showAllReviews && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="mt-2 text-orange hover:underline"
            >
              See More
            </button>
          )}

          {/* See Less Button */}
          {showAllReviews && (
            <button
              onClick={() => setShowAllReviews(false)}
              className="mt-2 text-orange hover:underline"
            >
              See Less
            </button>
          )}
        </div>
      </div>

      {/* Right Side: User & Call to Action */}
      <div className="lg:w-1/3 bg-gray-100 rounded-lg p-6">
        {/* Call to Action */}
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-brown">
            Interested in this skill?
          </h3>
          <button
            onClick={handleStartConversation}
            className="mt-4 w-full bg-blue text-white py-2 px-4 rounded-lg hover:bg-blue-600 lg:px-6"
          >
            Start a Conversation
          </button>
          {showModal && (<ModalConversation providerId={skill.user._id} closeModal={handleCancelConversation} />)}
          <div>

          </div>
        </div>

        {/* User Info */}
        <div className=" flex flex-col  mx-4 mt-6 gap-4">
          <div className=" flex flex-col  items-start ">
            {skill.user.photo ? (
              <img
                src={skill.user.photo}
                alt="App User"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <Image
                src={avatar}
                alt="App User"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="text-sm pt-2 font-medium text-gray">
                {" "}
                {skill.user.name}
              </p>
              <p className="text-xs text-gray">{skill.user.country}</p>
            </div>
          </div>

          <div>
            {" "}
            <p className="mt-2 text-sm  text-justify text-black">
              {skill.user.bio}{" "}
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCardDetails;
