'use server'

import Board from "./Board";
import connectDB from "@/config/database";
import Card from "@/models/Card";

export const Kanban = async () => {
  await connectDB();
  const Cards = await Card.find({}).lean();

  return (
    <div className="w-full text-neutral-50 flex justify-center items-center ">
      <Board initialCards={Cards}/>
    </div>
  );
};

export default Kanban;