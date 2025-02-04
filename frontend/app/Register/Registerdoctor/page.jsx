'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

function Registerdoctor() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    specialization: '',
    licenseNumber: '',
    hospitalName: '',
    designation: '',
    experience: '',
    username: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0], // Only setting the first file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can handle the image upload here if needed, e.g., sending it to a server
  };

  // Motion variants for animation
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold m-6 text-gray-600"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        Register as a Doctor
      </motion.h2>

      <div className="w-full h-full flex justify-center items-center">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl rounded-lg p-8 space-y-6"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          {/* Doctor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </motion.select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Medical License Number"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Hospital/Clinic Name"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation/Position"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of Experience"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
          </div>

          {/* Image Upload */}
          <div className="w-full">
            <motion.label
              className="block text-sm font-semibold text-gray-700 mb-2"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            >
              Profile Picture
            </motion.label>
            <motion.input
              type="file"
              name="profileImage"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
          </div>

          {/* Authentication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <motion.input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
          </div>

          <div className="flex items-center space-x-3">
            <motion.input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="h-4 w-4 text-green-500 border-gray-400 rounded"
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            />
            <label className="text-sm text-gray-600">
              I accept the <span className="text-green-600">terms and conditions</span>.
            </label>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg mt-6 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            initial="hidden"
            animate="visible"
            variants={inputVariants}
          >
            Register
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default Registerdoctor;
