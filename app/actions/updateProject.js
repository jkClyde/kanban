'use server';
import connectDB from '@/config/database';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';

async function updateProject(id, formData) {
  try {
    await connectDB();
    
    // Access all values for array fields
    const tags = formData.getAll('tags');

    // Create project data object with updated fields
    const projectData = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status') || 'Planning',
      completion: parseInt(formData.get('completion') || '0'),
      priority: formData.get('priority') || 'Medium',
      gitRepo: formData.get('gitRepo'),
      domain: formData.get('domain'),
      startDate: formData.get('startDate') ? new Date(formData.get('startDate')) : null,
      targetEndDate: formData.get('targetEndDate') ? new Date(formData.get('targetEndDate')) : null,
      actualEndDate: formData.get('actualEndDate') ? new Date(formData.get('actualEndDate')) : null,
      tags,
      // techStack: formData.get('techStack')
    };

    // Find and update the project
    const updatedProject = await Project.findByIdAndUpdate(id, projectData, { 
      new: true, // Return the updated document
      runValidators: true // Run Mongoose validation
    });

    if (!updatedProject) {
      return { 
        success: false, 
        error: 'Project not found' 
      };
    }

    // Revalidate paths to update the UI
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    
    return { 
      success: true, 
      projectId: updatedProject._id.toString() 
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export default updateProject;