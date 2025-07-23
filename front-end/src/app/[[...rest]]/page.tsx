import React from "react";
import GeminiBody from "../../components/GeminiBody";
import Sidebar from "../../components/Sidebar";

export default function Home() {
  // Sidebar open state is now managed in Sidebar, so layout is always full width
  return (
    <div className="flex min-h-screen bg-bgPrimaryColor">
      <Sidebar />
      <div className="flex-1 transition-all duration-300">
        <GeminiBody />
      </div>
    </div>
  );
} 