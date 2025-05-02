'use client'

import { useState } from 'react';
import Header from './Header';
import SummaryCards from './SummaryCard';
import StatusChart from './StatusChart';
import BudgetChart from './BudgetChart';
import ProgressChart from './ProgressChart';
import DashboardFilters from './DashboardFilters';
import ProjectsTable from './ProjectsTable';
import ProjectCards from './ProjectCards';


export const ProjectDashboard = ({ initialProjects , services}) => {
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
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});
  
  const budgetData = projects.map(project => ({
    name: project.name.substring(0, 10) + (project.name.length > 10 ? '...' : ''),
    Budget: project.budget || 0,
    Spent: project.spent || 0
  }));
  
  // Filter projects
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

  return (
    <div className="bg-gray-100 min-h-screen w-full py-10">
    <header className=" text-header">
      <div className="container mx-auto px-4 pb-[15px]">
        <h1 className="text-3xl font-bold">Project Management Dashboard</h1>
        <p className="mt-1 text-text">Track and manage your projects efficiently</p>
      </div>
    </header>
      
      <main className="container mx-auto px-4 py-[15px]">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusChart projects={projects} />
          <ProgressChart projects={projects} />
        </div>
        
       
        
        <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Projects</h2>
        <ProjectCards filteredProjects={filteredProjects} />
      </main>

   
    </div>
  );
};