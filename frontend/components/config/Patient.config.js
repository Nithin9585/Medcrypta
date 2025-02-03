export const patientData = {
    id: 1,
    name: 'Ella Smith',
    age: 29,
    email: 'ella.smith@gmail.com',
    phone: '(123) 456-7890',
    image: '/images/patients/patient-2.jpg',
    address: '123 Oak Street, Springfield, IL',
    emergencyContact: '(321) 654-0987',
    medicalHistory: [
      { id: 1, condition: 'Hypertension', diagnosed: '2020-05-15', treatment: 'Medication' },
      { id: 2, condition: 'Asthma', diagnosed: '2019-08-10', treatment: 'Inhaler' },
    ],
  };

  export const upcomingAppointments = [
    { id: 1, date: '2025-02-10', doctor: 'Dr. John Doe', reason: 'Routine Checkup', time: '10:00 AM' },
    { id: 2, date: '2025-02-15', doctor: 'Dr. Emily Smith', reason: 'Dental Cleaning', time: '2:00 PM' },
  ];

  export const appointmentHistory = [
    { id: 1, date: '2024-12-01', doctor: 'Dr. John Doe', reason: 'Routine Checkup', prescription: 'None' },
    { id: 2, date: '2024-11-10', doctor: 'Dr. Emily Smith', reason: 'Dental Cleaning', prescription: 'Toothpaste' },
  ];
  

  export const patientReviews = [
    { 
      id: 1, 
      doctor: 'Dr. John Doe', 
      rating: 4, 
      comment: 'Great doctor, very thorough with the checkup!' 
    },
    { 
      id: 2, 
      doctor: 'Dr. Emily Smith', 
      rating: 5, 
      comment: 'Very kind and gentle during my dental cleaning, highly recommend!' 
    },
  ];
  
  
  export const Last7daysData = [
    {
      day1: 5,
      day2: 7,
      day3: 4,
      day4: 6,
      day5: 3,
      day6: 8,
      day7: 5,
    },
  ];
  