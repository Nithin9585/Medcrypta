import React from 'react';

function AboutProject() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-primary mb-4">About MedCrypta</h1>
        <p className="text-lg text-muted-foreground mb-4">
          MedCrypta is a secure, blockchain-based healthcare platform designed to protect patient data, streamline medical record access, and ensure trust between doctors, patients, and pharmacists.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          By leveraging blockchain technology, we provide a decentralized and tamper-proof system for storing medical records, prescriptions, and transactions.
        </p>
        <p className="text-lg text-muted-foreground">
          Our platform enhances privacy, prevents unauthorized data modifications, and simplifies healthcare interactions. Whether you're a doctor, patient, or pharmacist, MedCrypta ensures that medical data remains secure, transparent, and easily accessible when needed.
        </p>
      </div>
    </div>
  );
}

export default AboutProject;
