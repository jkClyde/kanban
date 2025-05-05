'use server'
import connectDB from "@/config/database";
import Task from "@/models/Task";
import { revalidatePath } from "next/cache";

async function addTask(formData) {
    try{
        await connectDB();

         // Access all values for array fields
         const tags = formData.getAll('tags');

         //Create task data object
         const taskData = {
            title: formData.get('title'),
            projectId: formData.get('projectId'),
            description: formData.get('description'),
            status: formData.get('status') || 'To Do',
            priority: formData.get('priority') || 'Medium',
            assignedTo: parseInt(formData.get('assignedTo') || ''),
            dueDate: formData.get('startDate') ? new Date(formData.get('dueDate')) : null,
            tags,
         };

         const newTask = new Task(taskData);
         await newTask.save();

         revalidatePath('/tasks');  

         // Convert MongoDB ObjectId to string before returning
        return { 
            success: true, 
            taskId: newTask._id.toString() 
        };
    }catch (error) {
        console.error('Error adding project:', error);
        return { 
          success: false, 
          error: error.message 
        };
      }
}

export default addTask;