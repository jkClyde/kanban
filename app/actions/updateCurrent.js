'use server';
import connectDB from '@/config/database';
import Current from '@/models/Current';
import { revalidatePath } from 'next/cache';

/**
 * Updates the current project in the database
 * This version is completely simplified and removes all ID-based lookups
 */
export async function updateCurrent(formData) {
  try {
    console.log('Server action called with formData:', 
      { name: formData.get('name'), project_id: formData.get('project_id') });
    
    await connectDB();

    // Extract data from formData
    const name = formData.get('name');
    const project_id = formData.get('project_id');

    // Validate required fields
    if (!name || !project_id) {
      return {
        success: false,
        error: "Name and project_id are required"
      };
    }

    // Always delete any existing records first to avoid duplicates
    await Current.deleteMany({});

    // Create a new current project record
    const newCurrent = await Current.create({
      name,
      project_id
    });

    console.log('Created new Current record:', newCurrent);

    // Revalidate paths to update the UI
    revalidatePath('/');
    revalidatePath('/projects');
    
    return { 
      success: true, 
      data: newCurrent
    };
  } catch (error) {
    console.error('Server action error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}