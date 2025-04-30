'use client'
import { useState } from "react";
import Column from "./Column";
import BurnBarrel from "./BurnBarrel";
import { ChevronDown } from "lucide-react";

const Board = ({ initialCards }) => {
  const [cards, setCards] = useState(initialCards || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Dummy project data
  const projects = [
    { id: 1, name: "Website Redesign" },
    { id: 2, name: "Mobile App Development" },
    { id: 3, name: "Marketing Campaign" },
    { id: 4, name: "Database Migration" },
    { id: 5, name: "UI/UX Improvements" }
  ];

  const selectProject = (project) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
    
    // Here you could add logic to fetch cards for the selected project
    // For example:
    // fetchCardsForProject(project.id);
  };

  return (
    <div className="flex flex-col h-full w-full gap-6 max-w-[1200px]">
        
      
      
      <div className="flex h-full w-full gap-3">
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-neutral-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="TODO"
          column="todo"
          headingColor="text-yellow-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In progress"
          column="doing"
          headingColor="text-blue-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-emerald-200"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div>
    </div>
  );
};

export default Board;