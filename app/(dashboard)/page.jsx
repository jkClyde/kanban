import Project from "@/models/Project";
import Service from "@/models/Services";
import Current from "@/models/Current";
import connectDB from "@/config/database";
import { ProjectDashboard } from "@/components/ProjectDashboard/ProjectDashboard";

// This disables caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const page = async () => {
  await connectDB();
  
  // Fetch projects and convert to plain objects
  const projects = await Project.find({}).lean();
  const services = await Service.find({}).lean();
  const currentProject = await Current.find({}).lean();
  
  // Add a timestamp to help with debugging
  console.log(`Fetched ${projects.length} projects at ${new Date().toISOString()}`);
  
  // Stringify and parse to ensure plain objects
  const sanitizedProjects = JSON.parse(JSON.stringify(projects));

  return <ProjectDashboard initialProjects={sanitizedProjects} services={services} currentProject={currentProject}/>;
}

export default page;