// AnalogClock.js
'use client';  // This makes sure the component is rendered on the client side

import React, { useState, useEffect } from 'react';

function AnalogClock({ onTimeSelected }) {
  const [time, setTime] = useState('9:00 AM');  // Default selected time

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    if (onTimeSelected) {
      onTimeSelected(e.target.value);
    }
  };

  return (
    <div className="analog-clock">
      <label htmlFor="time-selector" className="block mb-2">Select Prescription Time:</label>
      <select
        id="time-selector"
        value={time}
        onChange={handleTimeChange}
        className="border p-2"
      >
        <option value="9:00 AM">9:00 AM</option>
        <option value="10:00 AM">10:00 AM</option>
        <option value="11:00 AM">11:00 AM</option>
        <option value="12:00 PM">12:00 PM</option>
        <option value="1:00 PM">1:00 PM</option>
        {/* Add more times as needed */}
      </select>
    </div>
  );
}

export default AnalogClock;
