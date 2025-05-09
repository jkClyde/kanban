import Project from "@/models/Project";
import Service from "@/models/Services";
import Current from "@/models/Current";
import Task from "@/models/Tasks";
import connectDB from "@/config/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectDashboard } from "@/components/ProjectDashboard/ProjectDashboard";
import User from "@/models/User";

// This disables caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const page = async () => {
  await connectDB();
  
  // Get user session
  const session = await getServerSession(authOptions);
  
  // Check if user is logged in
  if (!session?.user?.email) {
    return <div>Please log in to view your projects</div>;
  }

  // Fetch projects owned by the current user
  const currentUser = await User.findOne({ email: session.user.email }).lean();
  const projects = await Project.find({ owner: currentUser._id }).lean();
  const services = await Service.find({}).lean();
  const tasks = await Task.find({ status: "To Do" }).lean();
  const currentProject = await Current.find({}).lean();
  
  // Add a timestamp to help with debugging
  console.log(`Fetched ${projects.length} projects for user ${session.user.email} at ${new Date().toISOString()}`);
  
  // Stringify and parse to ensure plain objects
  const sanitizedProjects = JSON.parse(JSON.stringify(projects));

  return (
    <ProjectDashboard 
      initialProjects={sanitizedProjects} 
      services={services} 
      currentProject={currentProject} 
      tasks={tasks}
    />
  );
}

export default page;