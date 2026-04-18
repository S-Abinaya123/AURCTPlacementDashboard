import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { getProfile, updateProfile } from "../../api/profileApi";
import SuccessToast from "../../components/messages/SuccessToast";
import FailToast from "../../components/messages/FailToast";
import LogoutPopup from "../../components/loginPageComponent/LogoutPopup";
import { FaPowerOff } from "react-icons/fa";

interface ProfileData {
  userName: string;
  email: string;
  registerNo: string;
  mobileNo: string;
  department: string;
  year: number | null;
  batch: string;
  profilePicture: string;
  hasProfilePicture: boolean;
  role: string;
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    userName: "",
    email: "",
    registerNo: "",
    mobileNo: "",
    department: "",
    year: null,
    batch: "",
    profilePicture: "",
    hasProfilePicture: false,
    role: "",
  });

  const [originalData, setOriginalData] = useState<ProfileData>({
    userName: "",
    email: "",
    registerNo: "",
    mobileNo: "",
    department: "",
    year: null,
    batch: "",
    profilePicture: "",
    hasProfilePicture: false,
    role: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.status === "SUCCESS") {
        const data = response.data;
        
        // Profile picture is now returned as base64 data URL directly
        const profile: ProfileData = {
          userName: data.userName || "",
          email: data.email || "",
          registerNo: data.registerNo || "",
          mobileNo: data.mobileNo || "",
          department: data.department || "",
          year: data.year || null,
          batch: data.batch || "",
          profilePicture: data.profilePicture || "",
          hasProfilePicture: data.hasProfilePicture || false,
          role: data.role || "",
        };
        setProfileData(profile);
        setOriginalData(profile);
        setImagePreview(data.profilePicture || "");
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      setErrorMessage("Failed to load profile");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      
      const response = await updateProfile({
        userName: profileData.userName,
        department: profileData.department,
        year: profileData.year || undefined,
        batch: profileData.batch,
        profilePicture: selectedImage || undefined,
      });
      
      if (response.status === "SUCCESS") {
        // Profile picture is returned as base64 data URL directly
        const fullProfilePicture = response.data.profilePicture || "";
        
        localStorage.setItem("userName", profileData.userName);
        localStorage.setItem("profilePicture", fullProfilePicture);
        
        // Dispatch event for other components to update
        window.dispatchEvent(new Event("userUpdated"));
        
        setSuccessMessage("Profile updated successfully!");
        setShowSuccess(true);
        
        // Reset state
        setOriginalData(profileData);
        setSelectedImage(null);
        setHasChanges(false);
        
        // Reload to get fresh data from database
        await loadProfile();
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Failed to update profile");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setImagePreview(originalData.profilePicture);
    setSelectedImage(null);
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isStudent = profileData.role === "STUDENT";

  return (
    <div className="p-6">
      {showSuccess && (
        <SuccessToast
          title="Success"
          message={successMessage}
          show={showSuccess}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <FailToast
          title="Error"
          message={errorMessage}
          show={showError}
          onClose={() => setShowError(false)}
        />
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-blue-100">Manage your profile and preferences</p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📷</span> Profile Picture
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={
                      imagePreview ||
                      "https://res.cloudinary.com/djbmyn0fw/image-upload/v1752897230/default-profile_n6tn9o.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-picture-input"
                  className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profile-picture-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </div>
              
              <p className="text-gray-500 text-sm text-center">
                Click the camera icon to change your profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>👤</span> Profile Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Read-only fields */}
              <div>
                <label className="text-sm text-gray-500 block">
                  Register Number
                </label>
                <input
                  type="text"
                  value={profileData.registerNo || "Not available"}
                  disabled
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email || "Not available"}
                  disabled
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={profileData.mobileNo || "Not available"}
                  disabled
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block">Role</label>
                <input
                  type="text"
                  value={isStudent ? "Student" : "Faculty (TPO)"}
                  disabled
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 mt-1"
                />
              </div>

              {/* Editable fields */}
              <div>
                <label className="text-sm text-gray-500 block">Full Name</label>
                <input
                  type="text"
                  name="userName"
                  value={profileData.userName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block">Department</label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {isStudent && (
                <>
                  <div>
                    <label className="text-sm text-gray-500 block">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={profileData.year || ""}
                      onChange={handleChange}
                      min={1}
                      max={4}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 block">Batch</label>
                    <input
                      type="text"
                      name="batch"
                      value={profileData.batch}
                      onChange={handleChange}
                      placeholder="2021-2025"
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Update and Logout Buttons */}
            <div className="mt-6 flex gap-4 justify-end items-center">
              {hasChanges && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleUpdate}
                disabled={!hasChanges || saving}
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                  !hasChanges || saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Updating..." : "Update"}
              </button>
              <button
                onClick={() => setIsLogoutPopupOpen(true)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaPowerOff />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLogoutPopupOpen && (
        <LogoutPopup onClose={() => setIsLogoutPopupOpen(false)} />
      )}
    </div>
  );
};

export default Settings;
