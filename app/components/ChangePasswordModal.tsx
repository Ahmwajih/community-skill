import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "@/lib/features/auth/authSlice";

interface ChangePasswordModalProps {
  onClose: () => void;
  userId: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, userId }) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const user = useSelector((state: RootState) => state.auth.currentUser);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordChangeInfo = {
      currentPassword,
      newPassword,
    };

    try {
      if (!user?.provider === "email") {
        alert("You cannot change the password for Google or GitHub accounts.");
        return;
      }

      if (currentPassword === newPassword) {
        alert("New password cannot be the same as the current password.");
        return;
      }

      await dispatch(changePassword(userId, passwordChangeInfo));
      onClose();
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl text-brown font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 bg-white  text-gray block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full bg-white  text-gray border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          {/* confirm password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Confirm Password</label>
            <input
              type="password"
              className="mt-1 block w-full bg-white  text-gray border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Change Password
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

export default ChangePasswordModal;