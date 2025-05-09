'use server';
import connectDB from '@/config/database';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/utils/getSessionUser';

async function addProject(formData,userId) {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      throw new Error('User ID is required');
    }

    const { userId } = sessionUser;

    const tags = formData.getAll('tags');

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
      owner: userId,
    };

    const newProject = new Project(projectData);
    await newProject.save();

    revalidatePath('/projects');

    return {
      success: true,
      projectId: newProject._id.toString(),
    };
  } catch (error) {
    console.error('Error adding project:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default addProject;
