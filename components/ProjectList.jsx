'use client'

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Calendar, Clock, GitBranch, 
  Globe, Tag, CheckSquare, AlertTriangle, Filter, Search, RefreshCw,
  ChevronDown, ChevronUp
} from 'lucide-react';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Planning': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={14} className="mr-1" /> },
    'In Progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <ArrowUpRight size={14} className="mr-1" /> },
    'On Hold': { bg: 'bg-purple-100', text: 'text-purple-800', icon: <AlertTriangle size={14} className="mr-1" /> },
    'Completed': { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckSquare size={14} className="mr-1" /> },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: <ArrowDownRight size={14} className="mr-1" /> }
  };

  const config = statusConfig[status] || statusConfig['Planning'];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {status}
    </span>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    'Low': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'Critical': { bg: 'bg-red-100', text: 'text-red-800' }
  };

  const config = priorityConfig[priority] || priorityConfig['Medium'];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {priority}
    </span>
  );
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Progress bar component
const ProgressBar = ({ completion }) => {
  let color = 'bg-blue-500';
  
  if (completion >= 100) {
    color = 'bg-green-500';
  } else if (completion >= 75) {
    color = 'bg-teal-500';
  } else if (completion >= 50) {
    color = 'bg-yellow-500';
  } else if (completion >= 25) {
    color = 'bg-orange-500';
  } else {
    color = 'bg-red-500';
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${color} h-2.5 rounded-full`} 
        style={{ width: `${completion}%` }}
      ></div>
    </div>
  );
};

// Tech stack pill component
const TechStackPill = ({ tech }) => {
  return (
    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md mr-1 mb-1 inline-block">
      {tech}
    </span>
  );
};

// Project card component
const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
          <div className="flex space-x-2">
            <PriorityBadge priority={project.priority} />
            <StatusBadge status={project.status} />
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Completion: {project.completion}%</span>
          </div>
          <ProgressBar completion={project.completion} />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {project.tags && project.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md">
              <Tag size={12} className="inline mr-1" /> {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
        >
          {expanded ? (
            <>Less details <ChevronUp size={16} className="ml-1" /></>
          ) : (
            <>More details <ChevronDown size={16} className="ml-1" /></>
          )}
        </button>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tech Stack</h3>
                
                {project.techStack?.frontend?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Frontend:</p>
                    <div className="flex flex-wrap">
                      {project.techStack.frontend.map((tech, idx) => (
                        <TechStackPill key={idx} tech={tech} />
                      ))}
                    </div>
                  </div>
                )}
                
                {project.techStack?.backend?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Backend:</p>
                    <div className="flex flex-wrap">
                      {project.techStack.backend.map((tech, idx) => (
                        <TechStackPill key={idx} tech={tech} />
                      ))}
                    </div>
                  </div>
                )}
                
                {project.techStack?.database?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Database:</p>
                    <div className="flex flex-wrap">
                      {project.techStack.database.map((tech, idx) => (
                        <TechStackPill key={idx} tech={tech} />
                      ))}
                    </div>
                  </div>
                )}
                
                {project.techStack?.devOps?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">DevOps:</p>
                    <div className="flex flex-wrap">
                      {project.techStack.devOps.map((tech, idx) => (
                        <TechStackPill key={idx} tech={tech} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Details</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>Start Date: {formatDate(project.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>Target End Date: {formatDate(project.targetEndDate)}</span>
                  </div>
                  
                  {project.actualEndDate && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>Actual End Date: {formatDate(project.actualEndDate)}</span>
                    </div>
                  )}
                  
                  {project.gitRepo && (
                    <div className="flex items-center">
                      <GitBranch size={16} className="mr-2 text-gray-400" />
                      <a 
                        href={project.gitRepo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Repository
                      </a>
                    </div>
                  )}
                  
                  {project.domain && (
                    <div className="flex items-center">
                      <Globe size={16} className="mr-2 text-gray-400" />
                      <a 
                        href={`https://${project.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {project.domain}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard stats component
const DashboardStats = ({ projects }) => {
  // Calculate stats
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    planning: projects.filter(p => p.status === 'Planning').length,
    onHold: projects.filter(p => p.status === 'On Hold').length,
    cancelled: projects.filter(p => p.status === 'Cancelled').length,
    highPriority: projects.filter(p => p.priority === 'High' || p.priority === 'Critical').length
  };

  // Prepare chart data
  const chartData = [
    { name: 'Planning', count: stats.planning, fill: '#3B82F6' },
    { name: 'In Progress', count: stats.inProgress, fill: '#FBBF24' },
    { name: 'On Hold', count: stats.onHold, fill: '#8B5CF6' },
    { name: 'Completed', count: stats.completed, fill: '#10B981' },
    { name: 'Cancelled', count: stats.cancelled, fill: '#EF4444' }
  ].filter(item => item.count > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Planning</p>
            <p className="text-2xl font-bold text-gray-900">{stats.planning}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">On Hold</p>
            <p className="text-2xl font-bold text-gray-900">{stats.onHold}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">High Priority</p>
            <p className="text-2xl font-bold text-gray-900">{stats.highPriority}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip 
                formatter={(value, name) => [value, 'Projects']}
                labelFormatter={() => ''}
              />
              <Bar dataKey="count" fill="#8884d8" barSize={30} radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ProjectList component
export function ProjectList({ projects }) {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Apply filters
  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'All') {
      result = result.filter(project => project.priority === priorityFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'priority') {
        const priorityValues = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
        comparison = (priorityValues[a.priority] || 0) - (priorityValues[b.priority] || 0);
      } else if (sortBy === 'status') {
        const statusValues = { 'Planning': 1, 'In Progress': 2, 'On Hold': 3, 'Completed': 4, 'Cancelled': 5 };
        comparison = (statusValues[a.status] || 0) - (statusValues[b.status] || 0);
      } else if (sortBy === 'completion') {
        comparison = a.completion - b.completion;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div>
      <DashboardStats projects={projects} />
      
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Projects List</h2>
            
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div className="flex items-center ml-auto">
              <button
                onClick={() => toggleSort('name')}
                className={`px-2 py-1 text-sm rounded-md mr-2 ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('priority')}
                className={`px-2 py-1 text-sm rounded-md mr-2 ${sortBy === 'priority' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('status')}
                className={`px-2 py-1 text-sm rounded-md mr-2 ${sortBy === 'status' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('completion')}
                className={`px-2 py-1 text-sm rounded-md ${sortBy === 'completion' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Completion {sortBy === 'completion' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No projects found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div>
          {filteredProjects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}