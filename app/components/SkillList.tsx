"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SkillCard from "./SkillCard";
import { setSelectedCategory } from "@/lib/features/skills/categorySlice";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchSkills } from "@/lib/features/skills/skillsSlice";

const SkillsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const skills = useSelector((state: RootState) => state.skills.data);
  const selectedCategory = useSelector(
    (state: RootState) => state.category.selectedCategory
  );
  const categories = useSelector(
    (state: RootState) => state.category.categories
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.category === selectedCategory)
    : skills || [];

  const skillsPerPage = 4;
  const totalPages = Math.ceil(filteredSkills.length / skillsPerPage);

  const handleNext = () => {
    if (currentIndex + 1 < totalPages) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const paginatedSkills = filteredSkills.slice(
    currentIndex * skillsPerPage,
    (currentIndex + 1) * skillsPerPage
  );

  return (
    <div className="container  mx-auto lg:px-2 py-6">
      <div className="flex flex-wrap justify-center space-x-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 mx-2 my-2 rounded-lg text-sm md:text-base ${
              selectedCategory === category
                ? "bg-orange text-white"
                : "bg-beige text-brown"
            } transition duration-200 ease-in-out`}
            onClick={() => dispatch(setSelectedCategory(category))}
          >
            {category}
          </button>
        ))}
        <button
          className={`px-4 py-2 mx-2 my-2 rounded-lg text-sm md:text-base ${
            !selectedCategory ? "bg-orange text-white" : "bg-beige text-brown"
          } transition duration-200 ease-in-out`}
          onClick={() => dispatch(setSelectedCategory(""))}
        >
          All
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &lt; Prev
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          onClick={handleNext}
          disabled={currentIndex + 1 >= totalPages}
        >
          Next &gt;
        </button>
      </div>

      <div className="grid cursor-pointer grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-6">
        {paginatedSkills.map((skill) => (
          <div key={skill._id} className="flex justify-center">
            <SkillCard
              id={skill._id}
              imageSrc={skill.photo || "no photo"}
              title={skill.title}
              category={skill.category}
              className="w-full max-w-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;
