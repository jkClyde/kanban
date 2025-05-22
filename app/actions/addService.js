'use server';

import connectDB from "@/config/database";
import Service from "@/models/Services";
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/utils/getSessionUser';


export async function addService(formData) {
  try {
    await connectDB();
   
    const name = formData.get('name');
    const color = formData.get('color') || '#3B82F6';

    const sessionUser = await getSessionUser();

     if (!sessionUser || !sessionUser.userId) {
      throw new Error('User ID is required');
    }

    const { userId } = sessionUser;

    
    
    if (!name) {
      throw new Error('Service name is required');
    }
    
    const newService = new Service({
      name: name.trim(),
      color,
      owner: userId,

    });
    
    await newService.save();
    
    // Revalidate the cache for both services page and homepage
    revalidatePath('/services');
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Service added successfully',
      data: JSON.parse(JSON.stringify(newService))
    };
  } catch (error) {
    console.error('Error adding service:', error);
    return {
      success: false,
      error: error.message || 'Failed to add service'
    };
  }
}