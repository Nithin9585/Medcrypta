import Link from 'next/link';
import React, { useState, useEffect } from 'react';

function Marquee() {
  const [transactionDetails, setTransactionDetails] = useState('Waiting for transaction...');

  // Simulate real-time transactions (you can replace this with actual API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      // This is a mock for a transaction happening
      const transactionMock = `New Prescription Created: ${Math.floor(Math.random() * 1000)}. Verifying...`;
      setTransactionDetails(transactionMock); // Update the state with new "transaction" data
    }, 5000); // Update every 5 seconds (simulate real-time transaction)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleClick = () => {
    // Store the current transaction details in localStorage
    localStorage.setItem('transactionDetails', transactionDetails);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="whitespace-nowrap border-2 p-4 flex justify-center items-center rounded-md mb-5 animate-marquee text-muted-foreground bg-card">
        <Link href="/blockchain" onClick={handleClick}>
          {transactionDetails}
        </Link>
      </div>
    </div>
  );
}

export default Marquee;
