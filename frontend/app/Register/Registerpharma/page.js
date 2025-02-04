'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function RegisterMedicalStore() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ownerName: '',
    storeAddress: '',
    phoneNumber: '',
    medicalLicenseNumber: '',
    storeName: '',
    pharmaRegistrationNumber: '',
    gstNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.storeAddress) newErrors.storeAddress = 'Store address is required';
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = 'Phone number should be a 10-digit number';
    if (!formData.medicalLicenseNumber) newErrors.medicalLicenseNumber = 'Medical license number is required';
    if (!formData.storeName) newErrors.storeName = 'Store name is required';
    if (!formData.pharmaRegistrationNumber) newErrors.pharmaRegistrationNumber = 'Pharma registration number is required';
    if (formData.gstNumber && !/^\d{15}$/.test(formData.gstNumber)) newErrors.gstNumber = 'Invalid GST number';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('/api/register-medical-store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSubmissionSuccess(true);
          setFormData({
            ownerName: '',
            storeAddress: '',
            phoneNumber: '',
            medicalLicenseNumber: '',
            storeName: '',
            pharmaRegistrationNumber: '',
            gstNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          router.push('/success');
        } else {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            alert(errorData.message);
          } else {
            alert('An error occurred during registration.');
          }
        }
      } catch (error) {
        alert('An error occurred during registration.');
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Register Medical Store</h2>

        {submissionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Medical store registered successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="ownerName" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Owner Name:</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.ownerName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="storeName" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name:</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.storeName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="storeAddress" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Store Address:</label>
            <input
              type="text"
              id="storeAddress"
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.storeAddress ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.storeAddress && <p className="text-red-500 text-sm mt-1">{errors.storeAddress}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="phoneNumber" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="medicalLicenseNumber" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Medical License Number:</label>
            <input
              type="text"
              id="medicalLicenseNumber"
              name="medicalLicenseNumber"
              value={formData.medicalLicenseNumber}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.medicalLicenseNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.medicalLicenseNumber && <p className="text-red-500 text-sm mt-1">{errors.medicalLicenseNumber}</p>}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="pharmaRegistrationNumber" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Pharma Registration Number:</label>
            <input
              type="text"
              id="pharmaRegistrationNumber"
              name="pharmaRegistrationNumber"
              value={formData.pharmaRegistrationNumber}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.pharmaRegistrationNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.pharmaRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.pharmaRegistrationNumber}</p>}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="gstNumber" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">GST Number (Optional):</label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.gstNumber && <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="email" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Email (Optional):</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password & Confirm Password */}
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="password" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="confirmPassword" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`border rounded-lg w-full py-2 px-4 text-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="col-span-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              Register Medical Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterMedicalStore;
