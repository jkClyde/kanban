'use client'

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Define a component to display the dashboard
export const ProjectDashboard = ({ initialProjects }) => {
  const [projects, setProjects] = useState(initialProjects || []);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate summary metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalSpent = projects.reduce((sum, project) => sum + (project.spent || 0), 0);
  const avgCompletion = totalProjects > 0 ? 
    projects.reduce((sum, project) => sum + (project.completion || 0), 0) / totalProjects : 0;
  
  // Prepare data for charts
  // Status distribution data for pie chart
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusColors = {
    'Completed': '#81C784',
    'In Progress': '#FFB74D',
    'Planning': '#64B5F6',
    'On Hold': '#BA68C8',
    'Canceled': '#EF5350'
  };
  
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    color: statusColors[status] || '#9E9E9E'
  }));
  
  // Budget vs Spent data for bar chart
  const budgetData = projects.map(project => ({
    name: project.name.substring(0, 10) + (project.name.length > 10 ? '...' : ''),
    Budget: project.budget || 0,
    Spent: project.spent || 0
  }));
  
  // Filter projects based on status and search term
  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });
  
  // Total tasks calculation
  const totalTasks = projects.reduce((sum, project) => sum + (project.tasks || 0), 0);
  const completedTasks = projects.reduce((sum, project) => sum + (project.completedTasks || 0), 0);
  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Timeline data (using actual project dates if available)
  const getMonthlyProgress = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Initialize monthly data
    const monthlyData = {};
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentDate.getMonth() - 5 + i + 12) % 12; // Get the last 6 months
      monthlyData[months[monthIndex]] = { month: months[monthIndex], progress: 0, count: 0 };
    }
    
    // Calculate progress for each month based on project dates and completion
    projects.forEach(project => {
      if (!project.startDate || !project.completion) return;
      
      const startDate = new Date(project.startDate);
      const startMonth = startDate.getMonth();
      const startMonthName = months[startMonth];
      
      if (monthlyData[startMonthName]) {
        monthlyData[startMonthName].progress += project.completion || 0;
        monthlyData[startMonthName].count += 1;
      }
    });
    
    // Calculate average progress for each month
    return Object.values(monthlyData).map(item => ({
      month: item.month,
      progress: item.count > 0 ? Math.round(item.progress / item.count) : 0
    }));
  };
  
  const progressData = getMonthlyProgress();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Project Management Dashboard</h1>
          <p className="mt-1 text-indigo-100">Track and manage your projects efficiently</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2.5 py-1">All</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalProjects}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <span className="text-green-500 font-medium">{completedProjects} completed</span>
              <span className="mx-2">•</span>
              <span className="text-yellow-500 font-medium">{totalProjects - completedProjects} ongoing</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500 text-sm font-medium">Budget Utilization</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-1">Finance</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">${totalSpent.toLocaleString()}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <span className="text-gray-600 font-medium">of ${totalBudget.toLocaleString()} total budget</span>
              <span className="mx-2">•</span>
              <span className={`${totalBudget > 0 && totalSpent/totalBudget < 0.8 ? 'text-green-500' : 'text-yellow-500'} font-medium`}>
                {totalBudget > 0 ? Math.round((totalSpent/totalBudget) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500 text-sm font-medium">Average Completion</h3>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium rounded-full px-2.5 py-1">Progress</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(avgCompletion)}%</p>
            <div className="flex items-center mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${avgCompletion}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium rounded-full px-2.5 py-1">Tasks</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {completedTasks} / {totalTasks}
            </p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <span className="text-green-500 font-medium">
                {taskCompletionPercentage}% completed
              </span>
            </div>
          </div>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h3>
            <div className="h-64">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No status data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Budget vs Spent Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget vs Actual Spending</h3>
            <div className="h-64">
              {budgetData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Budget" fill="#64B5F6" />
                    <Bar dataKey="Spent" fill="#81C784" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No budget data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Over Time Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
            <div className="h-64">
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No progress data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div>
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 block md:inline-block md:mr-2">Filter by Status:</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 md:mt-0 block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option value="All">All Projects</option>
                {Object.keys(statusCounts).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="search" className="sr-only">Search Projects</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border text-header border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search projects"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Project
            </button>
          </div>
        </div>
        
        {/* Projects Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  {projects.some(p => p.team) && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  )}
                  {projects.some(p => p.startDate) && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                  )}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.description}</div>
                          {project.tags && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'On Hold' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{project.completion || 0}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (project.completion || 0) >= 90 ? 'bg-green-500' :
                              (project.completion || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.completion || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.budget ? (
                        <>
                          <div className="text-sm text-gray-900">
                            ${(project.spent || 0).toLocaleString()} / ${project.budget.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {project.budget > 0 ? Math.round(((project.spent || 0) / project.budget) * 100) : 0}% used
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Not specified</span>
                      )}
                    </td>
                    {projects.some(p => p.team) && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.team && project.team.length > 0 ? (
                          <div className="flex -space-x-2">
                            {project.team.map((member, index) => (
                              <div key={index} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-800">
                                  {typeof member === 'string' ? member.charAt(0) : index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No team assigned</span>
                        )}
                      </td>
                    )}
                    {projects.some(p => p.startDate) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.startDate ? (
                          <>
                            <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                            {project.endDate && (
                              <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                            )}
                          </>
                        ) : (
                          <span>No dates specified</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No projects found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Project Grid Alternative View */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Project Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'On Hold' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-2">{project.description}</p>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-600 flex justify-between mb-1">
                    <span>Completion: {project.completion || 0}%</span>
                    {project.tasks && (
                      <span>{project.completedTasks || 0}/{project.tasks} tasks</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (project.completion || 0) >= 90 ? 'bg-green-500' :
                        (project.completion || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${project.completion || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {(project.budget || project.startDate) && (
                  <div className="mt-4 flex justify-between text-sm">
                    {project.budget && (
                      <>
                        <div>
                          <div className="text-gray-500">Budget</div>
                          <div className="font-medium">${project.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Spent</div>
                          <div className="font-medium">${(project.spent || 0).toLocaleString()}</div>
                        </div>
                      </>
                    )}
                    {project.startDate && (
                      <div>
                        <div className="text-gray-500">Timeline</div>
                        <div className="font-medium">
                          {new Date(project.startDate).toLocaleDateString().split('/').slice(0, 2).join('/')}
                          {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString().split('/').slice(0, 2).join('/')}`}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex justify-between items-center">
                  {project.team && project.team.length > 0 ? (
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-800">
                            {typeof member === 'string' ? member.charAt(0) : index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div></div> // Empty div to maintain flex layout
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Details
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No projects found matching your criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};