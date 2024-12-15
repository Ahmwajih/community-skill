'use client';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSkillToUser } from "@/lib/features/skills/skillsSlice";
import { toast } from "react-toastify";

interface AddSkillModalProps {
  onClose: () => void;
  userId: string;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ onClose, userId }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");

  const categories = [
    "Machine Learning",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "AI Development",
    "Graphic Design",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result?.toString().split(",")[1] || "");
      };
      reader.readAsDataURL(file);
    }
  };

  // console.log('photoBase64', photoBase64);
  const photo = `data:image/jpeg;base64,${photoBase64}`;
  // console.log('photo', photo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(addSkillToUser({ title, description, category, photo, userId }));
      toast.success("Skill added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add skill.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-4 text-brown">
          Add Skill
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Add Skill
            </button>
            <button type="button" onClick={onClose} className="ml-2 bg-gray text-white py-2 px-4 rounded-md hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;