import React, { useState } from 'react';

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState('Monthly Tracker');

  const monthlyLeaderboard = [
    { rank: 1, name: 'karks', score: 2359 },
    { rank: 2, name: 'Karkuzhali', score: 2269 },
    { rank: 3, name: 'Noor', score: 2203 },
  ];

  const fullLeaderboard = [
    { rank: 1, name: 'Revanth', score: 4238 },
    { rank: 2, name: 'jyothiswaroop', score: 4010 },
    { rank: 3, name: 'Dhruev Gola', score: 2880 },
    { rank: 4, name: 'Pavan', score: 2162 },
    { rank: 5, name: 'thoomu poojasri', score: 1783 },
    { rank: 6, name: 'Ushasree', score: 1777 },
    { rank: 7, name: 'SourjyaShree', score: 1557 },
    { rank: 8, name: 'Karkuzhali', score: 1026 },
    { rank: 9, name: 'Rohan', score: 1025 },
    { rank: 10, name: 'Ramya', score: 751 },
    { rank: 11, name: 'Shivakumar', score: 743 },
    { rank: 12, name: 'Prajakta Mhaske', score: 720 },
    { rank: 13, name: 'Ranjitha', score: 424 },
  ];

  const handleNavigate = (pageName) => {
    console.log(`Navigating to ${pageName} page...`);
  };

  return (
    <div className="flex flex-col w-full md:w-1/3 p-4 sm:p-6 overflow-y-auto bg-gray-100">
      <div className="p-3 sm:p-4 mb-4 sm:mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between mb-3 sm:mb-4">
          <div className="flex space-x-2 border-b-2 border-transparent">
            <button
              className={`px-2 py-1 sm:px-3 sm:py-1 font-semibold text-gray-700 border-b-2 text-sm ${activeTab === 'Monthly Tracker' ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setActiveTab('Monthly Tracker')}
            >
              Monthly Tracker
            </button>
            <button
              className={`px-2 py-1 sm:px-3 sm:py-1 font-semibold text-gray-700 border-b-2 text-sm ${activeTab === 'Leaderboard' ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setActiveTab('Leaderboard')}
            >
              Leaderboard
            </button>
           
          </div>
          <button className="text-xs sm:text-sm font-semibold text-blue-500" onClick={() => handleNavigate(`${activeTab} View`)}>View →</button>
        </div>

        {activeTab === 'Monthly Tracker' && (
          <>
            <div className="flex items-center p-2 mb-3 sm:mb-4 bg-gray-100 rounded-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 bg-yellow-200 rounded-full"></div>
              <div>
                <span className="font-semibold text-yellow-600 text-sm sm:text-base">Bronze League</span>
                <p className="text-xs text-gray-500">Aug 2025</p>
              </div>
            </div>
            <div className="space-y-2">
              {monthlyLeaderboard.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-5 sm:w-6 mr-2 text-xs sm:text-sm text-gray-600">{user.rank}</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 mr-2 bg-gray-200 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-800">{user.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-600">{user.score}</span>
                </div>
              ))}
            </div>
            <div className="p-3 sm:p-4 mt-4 sm:mt-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-base sm:text-lg font-semibold text-gray-800">Events</span>
                <button className="text-xs sm:text-sm font-semibold text-blue-500" onClick={() => handleNavigate('Events')}>View →</button>
              </div>
              <p className="mb-2 text-xs sm:text-sm text-gray-500">Challenges, podcasts & a lot more activities!</p>
              <div className="flex items-center p-2 text-orange-500 bg-orange-100 rounded-lg text-sm">
                <span className="mr-2">⚡</span>
                <span className="font-medium">1 Upcoming Event</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Leaderboard' && (
          <>
            <div className="flex items-center justify-between px-3 pt-2 pb-3 sm:px-4 sm:pt-2 sm:pb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Silver League</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 font-semibold text-gray-600 border-b border-gray-200 text-sm">
                <div className="flex items-center">
                  <span className="w-8 text-center">Rank</span>
                  <span className="ml-2">Learners</span>
                </div>
                <span>XP</span>
              </div>
              {fullLeaderboard.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-8 text-sm font-semibold text-center text-gray-800">{user.rank}</span>
                    <div className="w-6 h-6 ml-2 mr-2 bg-gray-200 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-800">{user.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{user.score}</span>
                </div>
              ))}
            </div>
          </>
        )}

        
      </div>

      <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm mt-4 md:mt-auto">
        <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-800">Your learning is paused</h3>
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">Pick up where you left off and resume now.</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Your learning is paused from...</span>
          <button className="px-3 py-1 sm:px-4 sm:py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm" onClick={() => handleNavigate('Help')}>Help</button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;