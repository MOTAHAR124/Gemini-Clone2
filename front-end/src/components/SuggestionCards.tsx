"use client";
import React from "react";
import { Compass, Lightbulb, Youtube, Code } from "lucide-react";

interface SuggestionCardsProps {
  setInput: (input: string) => void;
}

const SuggestionCards: React.FC<SuggestionCardsProps> = ({ setInput }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 text-gray-100">
      <div
        className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        onClick={() => setInput("Suggest beautiful places to see on an upcoming road trip.")}
      >
        <p>Suggest beautiful places to see on an upcoming road trip.</p>
        <Compass
          size={28}
          className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9 transition-transform duration-300 group-hover:rotate-12"
        />
      </div>
      <div
        className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        onClick={() => setInput("What's the reaction to and impact of autonomous vehicles.")}
      >
        <p>What's the reaction to and impact of autonomous vehicles.</p>
        <Lightbulb
          size={28}
          className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div
        className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        onClick={() => setInput("Come up with a recipe for an upcoming event.")}
      >
        <p>Come up with a recipe for an upcoming event.</p>
        <Youtube
          size={28}
          className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div
        className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        onClick={() => setInput("Evaluate and rank common camera categories.")}
      >
        <p>Evaluate and rank common camera categories.</p>
        <Code
          size={28}
          className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9 transition-transform duration-300 group-hover:rotate-6"
        />
      </div>
    </div>
  );
};

export default SuggestionCards;
