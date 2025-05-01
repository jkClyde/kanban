'use server';
import connectDB from '@/config/database';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';

async function addProject(formData) {
  try {
    await connectDB();

    // Access all values for array fields
    const tags = formData.getAll('tags');

    // Create project data object
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
      techStack: formData.get('techStack')
    };

    const newProject = new Project(projectData);
    await newProject.save();

    // Revalidate the path to update the UI
    revalidatePath('/projects');
    
    // Convert MongoDB ObjectId to string before returning
    return { 
      success: true, 
      projectId: newProject._id.toString() 
    };
  } catch (error) {
    console.error('Error adding project:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export default addProject;