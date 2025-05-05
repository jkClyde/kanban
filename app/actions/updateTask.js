'use server';
import connectDB from '@/config/database';
import Task from '@/models/Tasks';
import { revalidatePath } from 'next/cache';

/**
 * Updates the status of a task in the database
 */
export async function updateTaskStatus(formData) {
  try {
    console.log('Server action called with formData:', 
      { id: formData.get('id'), status: formData.get('status') });
    
    await connectDB();

    // Extract data from formData
    const id = formData.get('id');
    const status = formData.get('status');

    console.log('Extracted from formData - ID:', id, 'Status:', status);

    // Validate required fields
    if (!id) {
      return {
        success: false,
        error: "Task ID is required"
      };
    }

    const validStatuses = ['To Do', 'In Progress', 'In Review', 'Completed', 'Blocked'];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: "Invalid status value"
      };
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return {
        success: false,
        error: "Task not found"
      };
    }

    console.log('Updated task:', updatedTask);

    // Revalidate paths to update the UI
    revalidatePath('/tasks');
    revalidatePath('/projects');
    revalidatePath('/projects/[id]', 'page');
    
    return { 
      success: true, 
      data: updatedTask
    };
  } catch (error) {
    console.error('Server action error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}