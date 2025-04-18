'use client';
import { useState, useEffect } from "react";

function Welcome() {
  const [showParagraph, setShowParagraph] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParagraph(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background  ">
      <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold w-full max-w-full text-center">
        <span className="inline-block animate-typewriter overflow-hidden whitespace-nowrap pr-2 dark:border-white relative">
          Welcome to <span className="text-green-500">MedCrypta</span>.
          <span className="animate-blink absolute inset-y-0 right-0 w-px  dark:bg-white"></span> 
        </span>
      </h1>

      {showParagraph && (
        <p className="mt-4 text-sm sm:text-base md:text-lg text-center">
         Bridging Doctors, Patients, and Pharmacies with Trust.
        </p>
      )}
    </div>
  );
}

export default Welcome;
