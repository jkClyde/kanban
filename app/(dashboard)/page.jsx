import Project from "@/models/Project";
import connectDB from "@/config/database";
import { ProjectDashboard } from "@/components/ProjectDashboard/ProjectDashboard";

const page = async () => {
  await connectDB();
  
  // Fetch projects and convert to plain objects
  const projects = await Project.find({}).lean();
  
  // Stringify and parse to ensure plain objects
  const sanitizedProjects = JSON.parse(JSON.stringify(projects));

  return <ProjectDashboard initialProjects={sanitizedProjects} />;
}

export default page;

