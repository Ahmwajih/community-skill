'use client';
import React, { useState, useEffect } from "react";
import Logo from "@/app/public/Logo.svg";
import Image from "next/image";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/lib/features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "@/lib/store";
import { searchSkills, setSearchResults, fetchSkills } from "@/lib/features/skills/skillsSlice";

const Navbar: React.FC<{ onSearchResults: (results: any[]) => void }> = ({ onSearchResults }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const searchResults = useSelector((state: RootState) => state.skills.searchResults);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    dispatch(setSearchResults(searchResults));
  }, [searchResults, dispatch]);

  const navItems = [
    { label: "Home", isActive: true, href: "/" },
    { label: "Main", isActive: true, href: "/main" },
    { label: "Dashboard", isActive: true, href: "/user_dashboard" },
    { label: "Messages", isActive: true, href: "/chat" },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser(router)); 
    router.push("/"); 
  };
  
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const toggleAvatarMenu = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); 
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      dispatch(searchSkills({ searchSkill: searchTerm }, router));
    } else {
      dispatch(fetchSkills());
    }
  };

  const handleAvatarClick = () => {
    router.push("/profile");
  };

  return (
    <div className="w-full bg-neutral-50 px-1 py-4 border-b shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto px-4">
        <div className="flex items-center hidden md:block flex-shrink-0">
          <Link href="/">
            <Image
              loading="lazy"
              src={Logo}
              alt="Logo"
              className="object-contain w-16 md:w-32"
              style={{ cursor: "pointer", display: "block" }}
            />
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center gap-6 text-brown hover:text-brown">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              label={item.label}
              isActive={item.isActive}
              href={item.href}
            />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <SearchBar onSearch={handleSearch} />
          <div className="relative">
            <FaUserCircle
              className="text-gray w-8 h-8 cursor-pointer"
              onClick={toggleAvatarMenu}
            />
            {isAvatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                <ul className="py-2">
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto md:hidden">
          <FaSearch
            onClick={toggleSearch}
            className="text-gray-600 w-6 h-6 cursor-pointer"
          />
        <div className="relative">
      {currentUser?.photo ? (
        <img
          src={currentUser.photo}
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={toggleAvatarMenu}
        />
      ) : (
        <FaUserCircle
          className="text-gray w-8 h-8 cursor-pointer"
          onClick={toggleAvatarMenu}
        />
      )}
      {isAvatarMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
          <ul className="py-2">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleAvatarClick}
            >
              Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>

          <button onClick={toggleMenu} className="text-gray-600">
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="block md:hidden mt-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}

      {isMenuOpen && (
        <nav className="block md:hidden text-black hover:text-brown mt-4 space-y-2">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              label={item.label}
              isActive={item.isActive}
              href={item.href}
            />
          ))}
        </nav>
      )}
    </div>
  );
};

const NavItem: React.FC<{ label: string; isActive: boolean; href: string }> = ({
  label,
  isActive,
  href,
}) => {
  return (
    <Link
      href={href}
      className={`block text-center font-poppins text-lg hover:opacity-80  py-2 ${
        isActive ? "font-bold text-orange-500" : "text-gray-700"
      }`}
      style={{ textDecoration:"none", cursor: "pointer", color:"#3c1e06" }}
    >
      {label}
    </Link>
  );
};

const SearchBar: React.FC<{ onSearch: (searchTerm: string) => void }> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      console.log("Searching for:", searchTerm);
    } else {
      onSearch(""); // Reset search results
      console.log("No search term provided");
    }
  };

  return (
    <div className="flex items-center border border-gray bg-white rounded-md">
      <input
        type="text"
        placeholder="Search for Skills"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full bg-white px-4 py-2 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange"
      >
        Search
      </button>
    </div>
  );
};

export default Navbar;