import React, { useState } from 'react';
import RightSidebar from '../../../components/mcqPageComponents/RightSidebar.tsx';

const McqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 1, title: 'MCQ Practice I', time: '20 Mins', type: 'Completed', count: 15, isDone: true, active: false },
    { id: 2, title: 'MCQ Practice II', time: '25 Mins', type: 'Completed', count: 20, isDone: true, active: false },
    { id: 3, title: 'MCQ Practice III', time: '10 Mins', type: 'Completed', count: 8, isDone: true, active: false },
    { id: 4, title: 'Coding Practice Walkthrough | Part 2', time: '45 Mins', type: 'In progress', count: 10, isDone: true, active: true },
    { id: 5, title: 'MCQ Practice', time: '20 Mins', type: ' Completed', count: 22, isDone: true, active: false },
    { id: 6, title: 'Coding Practice - 1A', time: '1 Hr 15 Mins', type: 'Partially Completed', count: 150, isDone: false, active: false },
    { id: 7, title: 'Coding Practice - 1B', time: '1 Hr', type: 'Not Started', count: 130, isDone: false, active: false },
    { id: 8, title: 'Coding Practice - 1C', time: '1 Hr', type: 'Not Started', count: 130, isDone: false, active: false },
  ];

  const handleNavigate = (pageName) => {
    console.log(`Navigating to ${pageName} page...`);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);
  };

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  );

  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );

  const GreenCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );

  const GoldCoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-6.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-1-3a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0z" />
    </svg>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">

      {/* ✅ Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white shadow-sm space-y-2 sm:space-y-0">
        
        {/* Left: Title */}
        <div className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            AURCT MCQ Session
          </h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center p-3 text-sm text-gray-600 bg-gray-100 rounded-full w-full sm:w-[22rem]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search for Python"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="hidden sm:block ml-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
        </div>

        {/* Right: User Info / Notifications */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="p-2 text-sm font-semibold text-gray-700 bg-yellow-200 rounded-full">9611</span>
          <div className="p-2 text-red-500 bg-red-100 rounded-full">
            <BellIcon />
          </div>
          <span className="p-2 text-blue-500 bg-blue-100 rounded-full">
            <UserIcon />
          </span>
          <img
            src="https://placehold.co/40x40/d1d5db/000000?text=P"
            alt="Profile"
            className="rounded-full cursor-pointer w-8 h-8 sm:w-10 sm:h-10"
          />
        </div>
      </div>

      {/* ✅ Main Content Area */}
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {/* Left Sidebar (Learnings) */}
        <div className="flex flex-col w-full md:w-2/3 p-4 sm:p-6 overflow-y-auto bg-white md:border-r border-gray-200">
          <button
            onClick={() => handleNavigate('Your Learnings')}
            className="flex items-center justify-between p-3 sm:p-4 mb-4 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-sm sm:text-base"
          >
            <span className="font-semibold">Your Learnings</span>
            <ArrowRightIcon />
          </button>

          <div className="space-y-3 sm:space-y-4">
            {sidebarItems.map((item, index) => (
              <div key={item.id} className="flex items-start">
                
                {/* Vertical timeline */}
                <div className="flex flex-col items-center mr-3 sm:mr-4 self-stretch">
                  {index > 0 && (
                    <div className={`w-px flex-grow ${sidebarItems[index - 1].isDone ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  )}
                  <div className="flex-shrink-0 z-10 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                    {item.isDone ? <GreenCheckIcon /> : <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-400"></div>}
                  </div>
                  {index < sidebarItems.length - 1 && (
                    <div className={`w-px flex-grow ${item.isDone ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  )}
                </div>

                {/* Content */}
                <button
                  onClick={() => handleNavigate(item.title)}
                  className={`flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-colors duration-200 text-left ${item.active ? 'bg-purple-100' : 'bg-white hover:bg-gray-200'}`}
                >
                  <div className="flex flex-col">
                    <span className={`font-medium text-sm sm:text-base ${item.active ? 'text-purple-600' : 'text-gray-900'}`}>{item.title}</span>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="mr-1">{item.time}</span>
                      <span className="mx-1">•</span>
                      {item.type === 'Learning' ? <BookOpenIcon /> : null}
                      <span>{item.type}</span>
                      <span className="mx-1">•</span>
                      <GoldCoinIcon />
                      <span className="ml-1 text-yellow-500">{item.count}</span>
                    </div>
                  </div>

                  {item.isDone && (
                    <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0 sm:ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Retaking: ${item.title}`);
                        }}
                        className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Retake
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Viewing score for: ${item.title}`);
                        }}
                        className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-200 rounded-lg hover:bg-blue-300 transition-colors"
                      >
                        Score
                      </button>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Use the new RightSidebar component */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default McqPage;
