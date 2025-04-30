'use client'

import React, { useState } from "react";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import AddCard from "./AddCard";
import { updateCardPosition, updateCardsOrder } from "@/app/actions/cardAction";

// Helper function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  if (!id) return false;
  const str = id.toString();
  return /^[0-9a-fA-F]{24}$/.test(str);
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filter cards that belong to this column
  const filteredCards = cards.filter((c) => c.column === column);

  const handleDragStart = (e, card) => {
    // Convert MongoDB _id objects to strings if needed
    const cardId = card.id || card._id;
    
    // Ensure card ID exists
    if (!cardId) {
      console.error("Card has no ID:", card);
      return;
    }
    
    // Convert to string (in case it's an ObjectId)
    const cardIdString = cardId.toString();
    
    console.log("Drag started with card:", { ...card, id: cardIdString });
    
    // Set data with standard format
    e.dataTransfer.setData("text/plain", cardIdString);
  };

  const handleDragEnd = (e) => {
    setActive(false);
    clearHighlights();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Get the card ID from dataTransfer
      const cardId = e.dataTransfer.getData("text/plain");
      console.log("Drop event with card ID:", cardId);
      
      if (!cardId) {
        console.error("No card ID found in drop event");
        setIsUpdating(false);
        return;
      }

      const indicators = getIndicators();
      const { element } = getNearestIndicator(e, indicators);

      const before = element.dataset.before || "-1";

      if (before !== cardId) {
        let copy = [...cards];

        // Find the card by either id or _id 
        let cardToTransfer = copy.find((c) => {
          const currentId = (c.id || c._id || "").toString();
          return currentId === cardId;
        });
        
        if (!cardToTransfer) {
          console.error("Card not found:", cardId);
          setIsUpdating(false);
          return;
        }
        
        // Store original column to check if it changed
        const originalColumn = cardToTransfer.column;
        
        // Update the column in our local copy
        cardToTransfer = { ...cardToTransfer, column };

        // Remove the card from its current position
        copy = copy.filter((c) => {
          const currentId = (c.id || c._id || "").toString();
          return currentId !== cardId;
        });

        const moveToBack = before === "-1";

        if (moveToBack) {
          copy.push(cardToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => {
            const elId = (el.id || el._id || "").toString();
            return elId === before;
          });
          
          if (insertAtIndex === -1) {
            console.error("Insert position not found");
            setIsUpdating(false);
            return;
          }

          copy.splice(insertAtIndex, 0, cardToTransfer);
        }

        // Update UI state immediately for responsiveness
        setCards(copy);
        
        // Check if this card has a valid MongoDB ObjectId before updating DB
        const isValidMongoId = isValidObjectId(cardToTransfer._id || cardToTransfer.id);
        
        // If the column changed and it's a valid MongoDB card, update in the database
        if (originalColumn !== column && isValidMongoId) {
          console.log(`Updating card ${cardId} column from ${originalColumn} to ${column}`);
          const result = await updateCardPosition(cardId, column);
          if (!result.success) {
            console.error("Failed to update card in database:", result.error);
          }
        } else if (!isValidMongoId) {
          console.log("Skipping database update for local/temporary card:", cardId);
        }
        
        // SEPARATE UPDATE:
        // Only update positions of cards with valid MongoDB ObjectIds
        try {
          // First check if we have any valid MongoDB ObjectIds in this column
          const cardsWithValidIds = copy
            .filter(c => c.column === column)
            .filter(c => isValidObjectId(c._id || c.id));
          
          if (cardsWithValidIds.length > 0) {
            // Only extract valid MongoDB ObjectIds
            const validObjectIds = cardsWithValidIds.map(c => (c._id || c.id).toString());
            
            console.log(`Updating positions for ${validObjectIds.length} cards in column ${column}`);
            if (validObjectIds.length > 0) {
              const orderResult = await updateCardsOrder(validObjectIds);
              if (!orderResult.success) {
                console.error("Failed to update card positions:", orderResult.error);
              }
            }
          } else {
            console.log(`No cards with valid MongoDB ObjectIds in column ${column}`);
          }
        } catch (positionError) {
          console.error("Error updating card positions:", positionError);
        }
      }
    } catch (error) {
      console.error("Error during drag and drop:", error);
    } finally {
      setIsUpdating(false);
      setActive(false);
      clearHighlights();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((card) => {
          return (
            <Card
              key={card.id || card._id}
              id={card.id || card._id}
              _id={card._id}
              title={card.title}
              column={card.column}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
        {isUpdating && <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center">Updating...</div>}
      </div>
    </div>
  );
};

export default Column;