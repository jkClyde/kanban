import React from "react";
import { motion } from "framer-motion";
import DropIndicator from "./DropIndicator";

const Card = ({ title, id, _id, column, handleDragStart }) => {
  // Support both id and _id (MongoDB uses _id by default)
  const cardId = id || _id;
  
  // Log the received props for debugging
  console.log("Card rendered with:", { title, id, _id, cardId, column });
  
  return (
    <>
      <DropIndicator beforeId={cardId} column={column} />
      <motion.div
        layout
        layoutId={cardId}
        draggable="true"
        onDragStart={(e) => {
          // Log what's being passed to handleDragStart
          console.log("Starting drag with:", { title, id: cardId, column });
          handleDragStart(e, { title, id: cardId, column });
        }}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
        <p className="text-xs text-neutral-400 mt-2">ID: {cardId}</p>
      </motion.div>
    </>
  );
};

export default Card;