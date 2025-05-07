'use server';
import connectDB from '@/config/database';
import Task from '@/models/Tasks';
import { revalidatePath } from 'next/cache';

export async function updateTask(formData) {
  try {
    await connectDB();

    const id = formData.get('id');
    if (!id) {
      return { success: false, error: "Task ID is required" };
    }

    // Get and validate required fields
    const title = formData.get('title');
    if (!title || !title.trim()) {
      return { success: false, error: "Title is required" };
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      description: formData.get('description'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      assignedTo: formData.get('assignedTo'),
      dueDate: formData.get('dueDate') || null,
      tags: JSON.parse(formData.get('tags') || '[]')
    };

    // Validate status
    const validStatuses = ['To Do', 'In Progress', 'In Review', 'Completed', 'Blocked'];
    if (!validStatuses.includes(updateData.status)) {
      return { success: false, error: "Invalid status value" };
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (!validPriorities.includes(updateData.priority)) {
      return { success: false, error: "Invalid priority value" };
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return { success: false, error: "Task not found" };
    }

    revalidatePath('/tasks');
    revalidatePath('/projects');
    revalidatePath('/projects/[id]', 'page');
    
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);
    return { 
      success: false, 
      error: error.message.includes('validation failed') 
        ? 'Validation error: Please check all required fields'
        : error.message
    };
  }
}