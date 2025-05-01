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

/*
  #305335F
  #090F13
  #153B47
  #3D606E
  #09191F
*/ 