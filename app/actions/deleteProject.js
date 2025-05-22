'use server';
import connectDB from '@/config/database';
import Project from '@/models/Project';
import Task from '@/models/Tasks';
import { revalidatePath } from 'next/cache';

async function deleteProject(projectId) {
  try {
    await connectDB();

    // Find and delete the project by ID
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return {
        success: false,
        error: 'Project not found'
      };
    }

    // Delete all tasks that belong to this project
    await Task.deleteMany({ projectId });

    // Revalidate the path to update the UI
    revalidatePath('/projects');
    
    return { 
      success: true, 
      message: 'Project and related tasks deleted successfully' 
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export default deleteProject;
