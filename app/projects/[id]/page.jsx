// app/projects/[id]/page.js
import connectDB from '@/config/database';
import Project from '@/models/Project';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ProjectActions from './ProjectAction';

// Function to get a single project by ID
async function getProject(id) {
  await connectDB();
  
  try {
    const project = await Project.findById(id);
    
    if (!project) return null;
    
    // Convert Mongoose document to a plain JavaScript object
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.id);
  
  if (!project) {
    notFound();
  }

  // Calculate the completion date if available
  const startDateFormatted = project.startDate 
    ? new Date(project.startDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'Not set';
  
  const targetEndDateFormatted = project.targetEndDate 
    ? new Date(project.targetEndDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'Not set';
  
  // Calculate project timeline/duration
  const timeUntilDeadline = project.targetEndDate 
    ? formatDistanceToNow(new Date(project.targetEndDate), { addSuffix: true }) 
    : 'No deadline set';

  // Status color mapping
  const statusColors = {
    'Planning': 'bg-blue_bg text-blue-100',
    'In Progress': 'bg-yellow_bg text-yellow-100',
    'On Hold': 'bg-red_bg text-orange-100',
    'Completed': 'bg-green_bg text-green-100',
    'Cancelled': 'bg-red_bg text-red-100'
  };
  
  // Priority color mapping
  const priorityColors = {
    'Low': 'bg-green_bg text-gray-100',
    'Medium': 'bg-blue_bg text-blue-100',
    'High': 'bg-pink_bg text-orange-100',
    'Critical': 'bg-red_bg text-red-100'
  };

  
  const rawTagColors = [
    { name: "WordPress", color: "#21759B" },
    { name: "Next.js", color: "#000000" },
    { name: "React", color: "#61DAFB" },
    { name: "Laravel", color: "#FF2D20" },
    { name: "Static Website", color: "#A0AEC0" },
    { name: "GoHighLevel", color: "#F6A609" },
    { name: "E-Commerce", color: "#38B2AC" },
    { name: "Mobile Development - React Native", color: "#61DAFB" },
    { name: "PHP", color: "#777BB4" },
    { name: "JavaScript", color: "#F7DF1E" }
  ];

    // Create a normalized map for matching
    const tagColors = rawTagColors.reduce((acc, tag) => {
      acc[tag.name.toLowerCase()] = tag.color;
      return acc;
    }, {});

  return (
    <div className="w-full h-full mx-auto px-8 py-8 bg-white">
      {/* Back button */}
      <div className='flex flex-col gap-[15px] mb-6'>
      {/* <Link 
          href="/" 
          className="inline-flex items-center text-sm text-purple_bg hover:text-indigo-700 "
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link> */}

        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-purple_bg hover:text-indigo-700 "
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Dashboard
        </Link>
      </div>
      
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-header">{project.name}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
              {project.status}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority] || 'bg-gray-100 text-gray-800'}`}>
              {project.priority} Priority
            </span>
            {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {project.completion}% Complete
            </span> */}
          </div>
        </div>

        <ProjectActions project={project} />
        
        {/* <div className="flex gap-2">
          <Link
            href={`/projects/${project._id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
          <button
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none"
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div> */}
      </div>
      
      {/* Project Details */}
      <div className="bg-[#f1f0f0] shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-header">Project Details</h2>
        </div>
        
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-line">{project.description || 'No description provided.'}</p>
          </div>

          {/* tags */}
          <div className="flex flex-wrap gap-2 mt-1 mb-6">
            {project.tags.map((tag, index) => {
              const tagKey = tag.toLowerCase().trim();
              const bgColor = tagColors[tagKey] || "#E2E8F0";
              const isDarkBg = ["#000000", "#21759B", "#777BB4"].includes(bgColor);
              const textColor = isDarkBg ? "#FFFFFF" : "#000000";
              return (
                  <span
                    key={index}
                    style={{ backgroundColor: bgColor, color: textColor }}
                    className="px-2 py-0.5 rounded-[5px] text-xs font-medium"
                  >
                      {tag}
                    </span>
                  );
                })}
          </div>
         
            
          {/* Dates & Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
              <div className="bg-gray-50 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Start Date:</span>
                  <span className="text-sm font-medium text-gray-900">{startDateFormatted}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Target End Date:</span>
                  <span className="text-sm font-medium text-gray-900">{targetEndDateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Timeline:</span>
                  <span className="text-sm font-medium text-gray-900">{timeUntilDeadline}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Progress</h3>
              <div className="bg-gray-50 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-900 font-medium">{project.completion}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple_bg h-2.5 rounded-full" 
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {project.gitRepo && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Repository</h3>
                <a 
                  href={project.gitRepo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple_bg hover:text-indigo-700 flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Repository
                </a>
              </div>
            )}
            
            {project.domain && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Live Site</h3>
                <a 
                  href={project.domain} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple_bg hover:text-indigo-700 flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                  Visit Live Site
                </a>
              </div>
            )}
          </div>
        
        </div>
      </div>
    </div>
  );
}