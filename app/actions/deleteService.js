'use server'
import connectDB from '@/config/database';
import Task from '@/models/Tasks';
import Service from '@/models/Services';
import { revalidatePath } from 'next/cache';

async function deleteService(taskId) {
    try{
        await connectDB();

        // Find and delete the task by ID
        const deletedService = await Service.findByIdAndDelete(taskId);

        if (!deletedService) {
            return { 
                success: false, 
                error: 'Service not found' 
            };
        }

        // Revalidate the path to update the UI
        revalidatePath('/service');
        
        return { 
            success: true, 
            message: 'Service deleted successfully' 
        };


    }catch(error){
        console.error('Error deleting service:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

export default deleteService;