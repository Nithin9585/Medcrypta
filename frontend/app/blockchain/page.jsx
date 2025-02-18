'use client';
import React, { useEffect, useState } from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'text-yellow-500';
    case 'Confirmed':
      return 'text-green-500';
    case 'Completed':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

function BlockchainPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchTransactions = async () => {  // Function to fetch transactions (replace with your API call)
      try {
        const response = await new Promise(resolve => { // Simulate API call with Promise
            setTimeout(() => {
                resolve([
                  {
                    id: "tx" + Math.floor(Math.random() * 1000000),
                    timestamp: new Date().toISOString(),
                    status: "Pending",
                    medicines: ["Aspirin 100mg", "Paracetamol 500mg"],
                    diagnosis: "Fever and Headache",
                  },
                  {
                    id: "tx" + Math.floor(Math.random() * 1000000),
                    timestamp: new Date().toISOString(),
                    status: "Confirmed",
                    medicines: ["Ibuprofen 200mg", "Amoxicillin 500mg"],
                    diagnosis: "Infection",
                  },
                  {
                    id: "tx" + Math.floor(Math.random() * 1000000),
                    timestamp: new Date().toISOString(),
                    status: "Completed",
                    medicines: ["Omeprazole 20mg"],
                    diagnosis: "Stomach Ulcer",
                  },
                ])
            }, 500)
        })
        const data = await response;
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Handle error (e.g., display an error message to the user)
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchTransactions(); // Call the fetch function

  }, []);

  return (
    <div className="p-6 m-6  min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-center">Blockchain Transaction Details</h1>

      <div className="mt-4">
        {loading ? (  // Conditionally render loading or transactions
          <p className="text-center text-gray-500">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 mb-4 border border-gray-300 rounded-md shadow-md "
            >
              <h3 className="font-bold text-lg">Transaction ID: {transaction.id}</h3>
              <p className="text-sm text-gray-500">Timestamp: {new Date(transaction.timestamp).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Diagnosis: {transaction.diagnosis}</p>
              <p className="text-sm text-gray-500">Medicines: {transaction.medicines.join(", ")}</p>
              <p className={`font-semibold ${getStatusColor(transaction.status)}`}>
                Status: {transaction.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BlockchainPage;