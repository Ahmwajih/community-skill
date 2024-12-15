"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SkillCard from "@/app/components/SkillCard";
import avatar from "@/app/public/avatar.jpg";
import { RootState, AppDispatch } from "@/lib/store";
import { setFilteredSkills, fetchSkills } from "@/lib/features/skills/skillsSlice";
import { setSelectedCategory } from "@/lib/features/skills/categorySlice";

const FiltredCountry: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchResults = useSelector((state: RootState) => state.skills.searchResults);
  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
  const categories = useSelector((state: RootState) => state.category.categories);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [filteredSkills, setFilteredSkillsState] = useState(searchResults);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (searchResults.length === 0) {
      dispatch(fetchSkills());
    } else {
      setFilteredSkillsState(searchResults);
    }
  }, [searchResults, dispatch]);

  useEffect(() => {
    let filtered = searchResults;
    if (selectedCountry !== "All") {
      filtered = filtered.filter(
        (skill) =>
          skill.user?.country?.toLowerCase() === selectedCountry.toLowerCase()
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (skill) => skill.category === selectedCategory
      );
    }
    setFilteredSkillsState(filtered);
  }, [selectedCountry, selectedCategory, searchResults]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

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
    <div className="bg-white py-6">
      <div className="p-6 bg-white rounded-md shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray">Filter by Country</h2>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="block bg-white w-full mt-1 rounded-md border-gray shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="All">All</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
        </select>
        <p className="mt-4 text-gray">
          Selected Country: <strong>{selectedCountry}</strong>
        </p>
      </div>

      <div className="flex flex-wrap justify-center space-x-2 mt-6 mb-6">
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

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-2">
        {paginatedSkills.length > 0 ? (
          paginatedSkills.map((skill: any) => (
            <div className="cursor-pointer my-4 w-full" key={skill._id}>
              <SkillCard
                id={skill._id}
                imageSrc={skill.photo || avatar}
                title={skill.title}
                category={skill.category}
              />
            </div>
          ))
        ) : (
          <div className="text-center w-full">
            <p className="text-gray">No skills found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltredCountry;
