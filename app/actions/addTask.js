'use server';
import connectDB from "@/config/database";
import Task from "@/models/Tasks";
import { revalidatePath } from "next/cache";

async function addTask(formData) {
    try {
        await connectDB();

        // Access all values for array fields
        const tags = formData.getAll('tags');

        // Create task data object
        const taskData = {
            title: formData.get('title'),
            projectId: formData.get('projectId'),
            description: formData.get('description'),
            status: formData.get('status') || 'To Do',
            priority: formData.get('priority') || 'Medium',
            assignedTo: formData.get('assignedTo') || '',
            tags,
        };

        // Only add dueDate if it exists
        const dueDate = formData.get('dueDate');
        if (dueDate) {
            taskData.dueDate = new Date(dueDate);
        }

        const newTask = new Task(taskData);
        await newTask.save();

        // Revalidate both the tasks page and the specific project page
        revalidatePath('/tasks');
        revalidatePath(`/projects/${taskData.projectId}`);

        // Convert MongoDB ObjectId to string before returning
        return { 
            success: true, 
            taskId: newTask._id.toString() 
        };
    } catch (error) {
        console.error('Error adding task:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

export default addTask;