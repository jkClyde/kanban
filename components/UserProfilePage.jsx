'use client'

import { useState } from 'react';
import { Mail, User, Bookmark } from 'lucide-react';

// Dummy project data
const dummyProjects = [
  {
    _id: '1',
    title: 'Modern Apartment Complex',
    description: 'Luxury apartments in downtown area with premium amenities',
    location: 'Seattle, WA',
    image: '/api/placeholder/400/250',
    type: 'Rental'
  },
  {
    _id: '2',
    title: 'Suburban Family Home',
    description: 'Spacious 4-bedroom home with large backyard',
    location: 'Portland, OR',
    image: '/api/placeholder/400/250',
    type: 'Sale'
  },
  {
    _id: '3',
    title: 'Downtown Office Space',
    description: 'Open concept office in business district',
    location: 'San Francisco, CA',
    image: '/api/placeholder/400/250',
    type: 'Commercial'
  }
];

export default function UserProfilePage({ user = null }) {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Default user if none provided
  const userData = user || {
    email: 'user@example.com',
    username: 'exampleuser',
    image: '/api/placeholder/100/100',
    bookmarks: ['1', '2']
  };
  
  // Get bookmarked projects
  const bookmarkedProjects = dummyProjects.filter(project => 
    userData.bookmarks.includes(project._id)
  );
  
  return (
    <div className="bg-gray-100 min-h-screen pb-10 w-full rounded-[15px]">
      {/* Header */}
      <div className="bg-sidebar h-32"></div>
      
      {/* User Info Card */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img 
                  className="h-24 w-24 rounded-full border-4 border-white" 
                  src={userData.image} 
                  alt={userData.username} 
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-xl font-bold text-gray-900">@{userData.username}</h1>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-500">
                  <Mail size={16} className="mr-1" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-500">
                  <Bookmark size={16} className="mr-1" />
                  <span className="text-sm">{userData.bookmarks.length} bookmarks</span>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="mt-6 border-t border-gray-200">
              <div className="flex space-x-8 mt-4">
                <button 
                  className={`${
                    activeTab === 'projects' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('projects')}
                >
                  Projects
                </button>
                <button 
                  className={`${
                    activeTab === 'bookmarks' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('bookmarks')}
                >
                  Bookmarks
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="mt-8">
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bookmarked Projects</h2>
              {bookmarkedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No bookmarked projects yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-40">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-medium text-gray-900">{project.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {project.type}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
        <div className="mt-2 flex items-center text-gray-500 text-xs">
          <User size={14} className="mr-1" />
          <span>{project.location}</span>
        </div>
        <button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );
}