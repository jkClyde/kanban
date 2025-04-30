'use server'

import { revalidatePath } from "next/cache";
import Card from "@/models/Card"; // Update with your actual Card model path
import connectDB from "@/config/database";
import mongoose from "mongoose";

// Helper function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

export async function updateCardPosition(cardId, newColumn) {
  try {
    // First validate that this is a proper MongoDB ObjectId
    if (!isValidObjectId(cardId)) {
      console.log("Invalid ObjectId format:", cardId);
      return { success: false, error: "Invalid ObjectId format" };
    }
    
    await connectToDB();
    
    // Find and update the card
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { column: newColumn },
      { new: true }
    );
    
    if (!updatedCard) {
      return { success: false, error: "Card not found" };
    }
    
    revalidatePath("/board");
    return { success: true, data: updatedCard };
  } catch (error) {
    console.error("Error updating card position:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCardsOrder(cardIds) {
  try {
    if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
      return { success: false, error: "No valid card IDs provided" };
    }
    
    // Filter out any IDs that aren't valid MongoDB ObjectIds
    const validCardIds = cardIds.filter(id => isValidObjectId(id));
    
    if (validCardIds.length === 0) {
      return { success: false, error: "No valid MongoDB ObjectIds in the provided list" };
    }
    
    await connectToDB();
    
    // Update position for each card
    const updatePromises = validCardIds.map((id, index) => {
      return Card.findByIdAndUpdate(id, { position: index });
    });
    
    await Promise.all(updatePromises);
    
    revalidatePath("/board");
    return { success: true };
  } catch (error) {
    console.error("Error updating card order:", error);
    return { success: false, error: error.message };
  }
}

export async function createCard(title, column) {
  try {
    await connectToDB();
    
    // Find the highest position in this column to place new card at the end
    const highestPositionCard = await Card.findOne({ column })
      .sort({ position: -1 })
      .limit(1);
    
    const position = highestPositionCard ? highestPositionCard.position + 1 : 0;
    
    // Create the new card
    const newCard = await Card.create({
      title,
      column,
      position
    });
    
    revalidatePath("/board");
    return { success: true, data: newCard };
  } catch (error) {
    console.error("Error creating card:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCard(cardId) {
  try {
    if (!isValidObjectId(cardId)) {
      return { success: false, error: "Invalid ObjectId format" };
    }
    
    await connectToDB();
    
    const deletedCard = await Card.findByIdAndDelete(cardId);
    
    if (!deletedCard) {
      return { success: false, error: "Card not found" };
    }
    
    revalidatePath("/board");
    return { success: true };
  } catch (error) {
    console.error("Error deleting card:", error);
    return { success: false, error: error.message };
  }
}