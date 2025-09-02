import React, { useState } from 'react';

const MyProfile = () => {
    // State to manage the profile image, defaulting to a placeholder
    const [profileImage, setProfileImage] = useState(null);

    // Mock data for the profile and form
    const [profileData, setProfileData] = useState({
        fullName: 'Mathimalar',
        email: 'mathimalar0505@gmail.com',
        Department: 'Computer Science and Engineering',
        Year: 'III',
        Semester: '5',
        RegisterNum: '950023104031',
    });

    const [languageStatus, setlanguageStatus] = useState([
        { name: 'Aptitude', progress: 80, color: 'bg-blue-500' },
        { name: 'Java', progress: 70, color: 'bg-red-500' },
        { name: 'Python', progress: 90, color: 'bg-green-500' },
        { name: 'C', progress: 65, color: 'bg-yellow-500' },
        { name: 'C++', progress: 85, color: 'bg-blue-500' },
    ]);
    
    // State to manage social links and their editability
    const [socialLinks, setSocialLinks] = useState([
        {
            name: 'LinkedIn', 
            url: 'https://www.linkedin.com/in/mathimalar-a-891687337/', 
            icon: (
                <div className="bg-blue-700 text-white p-3 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                    </svg>
                </div>
            )
        },
        {
            name: 'Github', 
            url: 'https://github.com/Mathimalar190505', 
            icon: (
                <div className="bg-gray-800 text-white p-3 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M15 22s-3.5 0-5-1c-1-1-4 0-4-1s2-2 2-3c0-2-3-4-3-6a10 10 0 0110-10c0 0 2 0 4 2s2 2 2 3c0 2-3 4-3 6a5 5 0 01-5 5z"/>
                        <path d="M9 18a1 1 0 01-1-1c0-1 1-1 1-1s1-1 1-2c0-1-1-1-1-1a2 2 0 01-2-2"/>
                    </svg>
                </div>
            )
        },
        {
            name: 'LeetCode', 
            url: 'https://leetcode.com/u/Mathimalar_19/', 
            icon: (
                <div className="bg-green-600 text-white p-3 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M12 11a1 1 0 0 0-1-1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1" />
                        <path d="M16 11h2.5a.5.5 0 0 0 .5-.5V9a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a.5.5 0 0 0 .5.5H16" />
                        <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                        <path d="M12 5v14" />
                        <path d="M7 5v14" />
                        <path d="M17 5v14" />
                    </svg>
                </div>
            )
        },
        {
            name: 'Autocad', 
            url: 'https://autocad.autodesk.com/profile', 
            icon: (
                <div className="bg-orange-600 text-white p-3 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <circle cx="12" cy="12" r="5" />
                    </svg>
                </div>
            )
        },
    ]);

    // New state to manage form editability
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingSocial, setIsEditingSocial] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleSocialChange = (index, e) => {
        const { value } = e.target;
        const newLinks = [...socialLinks];
        newLinks[index].url = value;
        setSocialLinks(newLinks);
    };

    // Handler for the image file input
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        console.log('Profile data saved:', profileData);
        setIsEditingProfile(false);
    };

    const handleEditProfile = () => {
        setIsEditingProfile(true);
    };

    const handleCancelProfile = () => {
        setIsEditingProfile(false);
    };
    
    const handleSaveSocial = () => {
        console.log('Social links saved:', socialLinks);
        setIsEditingSocial(false);
    };
    
    const handleEditSocial = () => {
        setIsEditingSocial(true);
    };
    
    const handleCancelSocial = () => {
        // Reset to original values if needed, for now just exit edit mode
        setIsEditingSocial(false);
    }

    return (
        <div className="bg-gray-200 min-h-screen p-4 sm:p-8 md:p-12 font-sans">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.01] border border-gray-200">
                            {/* Image with upload functionality */}
                            <div className="relative w-28 h-28 mb-4">
                                <img
                                    src={profileImage || "https://placehold.co/150x150/E2E8F0/1A202C?text=M"}
                                    alt="User"
                                    className="rounded-full w-28 h-28 object-cover border-4 border-gray-200 shadow-md transition-all duration-300"
                                />
                                {/* Hidden file input to trigger camera/gallery */}
                                <input
                                    type="file"
                                    id="profile-image-input"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    capture="camera"
                                />
                                {/* Label to act as the clickable button */}
                                <label
                                    htmlFor="profile-image-input"
                                    className="absolute bottom-0 right-0 p-1.5 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors duration-200 shadow-md transform hover:scale-110"
                                    aria-label="Upload profile image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                    </svg>
                                </label>
                            </div>
                            
                            <h4 className="text-xl font-semibold text-gray-800">{profileData.fullName}</h4>
                            <p className="text-gray-500 text-sm">{profileData.RegisterNum}</p>
                            <div className="mt-4 flex space-x-2">
                                <button className="bg-blue-500 text-white text-sm font-semibold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-200">
                                    View Portfolio
                                </button>
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="bg-white rounded-xl shadow-lg mt-8 p-6 transition-all duration-300 transform hover:scale-[1.01] border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-xl font-semibold text-gray-800">Social Links</h5>
                                {isEditingSocial ? (
                                    <div className="flex space-x-2">
                                        <button onClick={handleSaveSocial} className="bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-blue-600 transition-colors duration-200">
                                            Save
                                        </button>
                                        <button onClick={handleCancelSocial} className="bg-gray-400 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-gray-500 transition-colors duration-200">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEditSocial} className="bg-red-500 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-red-600 transition-colors duration-200">
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {socialLinks.map((link, index) => (
                                    <div key={index} className={`flex items-center ${index > 0 ? 'border-t border-gray-200' : ''} pt-4`}>
                                        <div className="w-8 h-8 flex items-center justify-center mr-4">
                                            {link.icon}
                                        </div>
                                        {isEditingSocial ? (
                                            <input
                                                type="text"
                                                value={link.url}
                                                onChange={(e) => handleSocialChange(index, e)}
                                                className="w-full text-gray-500 text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder={`Enter ${link.name} URL`}
                                            />
                                        ) : (
                                            <a href={link.url} target="_parent" rel="noopener noreferrer" className="flex items-center justify-between w-full hover:bg-gray-100 p-2 -m-2 rounded-lg transition-colors duration-200">
                                                <span className="text-gray-700 font-medium ml-4">{link.name}</span>
                                                <span className="text-gray-500 text-sm">visit</span>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Form Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-[1.01] border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h5 className="text-xl font-semibold text-gray-800">Profile Settings</h5>
                                {isEditingProfile ? (
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveProfile}
                                            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelProfile}
                                            className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleEditProfile}
                                        className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            <form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-8">
                                    <div className="flex flex-col">
                                        <label htmlFor="fullName" className="text-gray-600 font-medium text-sm mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditingProfile}
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="text-gray-600 font-medium text-sm mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleChange}
                                            disabled={!isEditingProfile}
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="year" className="text-gray-600 font-medium text-sm mb-1">Year</label>
                                        <input
                                            type="text"
                                            id="year"
                                            name="Year"
                                            value={profileData.Year}
                                            onChange={handleChange}
                                            disabled={!isEditingProfile}
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="flex flex-col" >
                                        <label htmlFor="sem" className="text-gray-600 font-medium text-sm mb-1">Semester</label>
                                        <input
                                            type="text"
                                            id="sem"
                                            name="Semester"
                                            value={profileData.Semester}
                                            onChange={handleChange}
                                            disabled={!isEditingProfile}
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="flex flex-col md:col-span-2">
                                        <label htmlFor="dept" className="text-gray-600 font-medium text-sm mb-1">Department</label>
                                        <input
                                            type="text"
                                            id="dept"
                                            name="Department"
                                            value={profileData.Department}
                                            onChange={handleChange}
                                            disabled={!isEditingProfile}
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Project Status Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-[1.01] border border-gray-200">
                            <h5 className="text-xl font-semibold text-gray-800 mb-6">Coding Progress</h5>
                            <div className="space-y-4">
                                {languageStatus.map((language, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-700 font-medium">{language.name}</span>
                                            <span className="text-gray-500 text-sm">{language.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${language.color} h-full rounded-full`}
                                                style={{ width: `${language.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
