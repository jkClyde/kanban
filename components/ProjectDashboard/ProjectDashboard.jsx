'use client'

import { useState, useEffect } from 'react';
import SummaryCards from './SummaryCard';
import StatusChart from './StatusChart';
import BudgetChart from './BudgetChart';
import ProgressChart from './ProgressChart';
import DashboardFilters from './DashboardFilters';
import ProjectsTable from './ProjectsTable';
import ProjectCards from './ProjectCards';
import CurrentProject from './CurrentProject';
import { useSession, getProviders } from 'next-auth/react';



export const ProjectDashboard = ({ initialProjects, services, currentProject, tasks }) => {
  const [projects, setProjects] = useState(initialProjects || []);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');



  // This effect will update the state when initialProjects changes
  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
    }
  }, [initialProjects]); 

  // Calculate summary metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalSpent = projects.reduce((sum, project) => sum + (project.spent || 0), 0);
  const avgCompletion = totalProjects > 0 ? 
    projects.reduce((sum, project) => sum + (project.completion || 0), 0) / totalProjects : 0;
  
  // Prepare data for charts
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});
  

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });
  
  // Total tasks calculation
  const totalTasks = tasks.length;
  const completedTasks = projects.reduce((sum, project) => sum + (project.completedTasks || 0), 0);
  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className=" bg-gray-100 min-h-screen w-full py-6  p-[15px] md:p-8 rounded-xl">
      
      
      <main className=" mx-auto px-0 md:px-4 py-2">

      <header className="text-header">
        <div className=" mx-auto px-0 md:px-4 ">
          {/* <h1 className="text-3xl font-bold">Project Management Dashboard</h1> */}
          <p className="mt-1 text-text">Track and manage your projects efficiently</p>

        </div>
      </header>
      <CurrentProject CurrentProject={currentProject[0]} allProjects={initialProjects}/>

        <SummaryCards 
          totalProjects={totalProjects}
          completedProjects={completedProjects}
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          avgCompletion={avgCompletion}
          taskCompletionPercentage={taskCompletionPercentage}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          services={services}
        />

        <DashboardFilters 
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusCounts={statusCounts}
          services={services}
        />
        
        <ProjectsTable 
          projects={projects}
          filteredProjects={filteredProjects}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] md:gap-6 mb-8">
          <StatusChart projects={projects} />
          <ProgressChart projects={projects} />
        </div>
        
        <div className="container w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Projects</h2>
        <ProjectCards filteredProjects={filteredProjects} />
        </div>
      </main>
    </div>
  );
};