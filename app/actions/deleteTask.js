'use server'
import connectDB from '@/config/database';
import Task from '@/models/Tasks';
import { revalidatePath } from 'next/cache';

async function deleteTask(taskId) {
    try{
        await connectDB();

        // Find and delete the task by ID
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return { 
                success: false, 
                error: 'Task not found' 
            };
        }

        // Revalidate the path to update the UI
        revalidatePath('/tasks');
        
        return { 
            success: true, 
            message: 'Task deleted successfully' 
        };


    }catch(error){
        console.error('Error deleting task:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

export default deleteTask;