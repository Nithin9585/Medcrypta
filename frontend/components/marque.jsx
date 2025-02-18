import React from 'react';

function Marquee() {
  return (
    <div className="w-full overflow-hidden">
      <div className="whitespace-nowrap border-2 p-4 flex justify-center items-center rounded-md mb-5 animate-marquee text-muted-foreground bg-card">
        Click below to verify records while maintaining privacy and compliance.
      </div>
    </div>
  );
}

export default Marquee;
