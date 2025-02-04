'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function RegisterPatient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    dob: '',
    aadharNumber: '',
    phoneNumber: '',
    username: '',
    photo: null,  // State for the photo upload
  });

  const [errors, setErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],  // Save the file in formData
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.secondName) newErrors.secondName = 'Second name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.aadharNumber || !/^\d{12}$/.test(formData.aadharNumber))
      newErrors.aadharNumber = 'Aadhar number should be a 12-digit number';
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = 'Phone number should be a 10-digit number';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';  // Check if photo is uploaded

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formDataToSubmit = new FormData();
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          body: formDataToSubmit,
        });

        if (response.ok) {
          setSubmissionSuccess(true);
          setFormData({
            firstName: '',
            secondName: '',
            dob: '',
            aadharNumber: '',
            phoneNumber: '',
            username: '',
            photo: null,
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-8 w-full max-w-4xl"> {/* Ensure it's full width on larger screens */}
        <h2 className="text-3xl font-semibold dark:text-gray-400 text-gray-800 mb-6">
          Register Patient
        </h2>

        {submissionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Patient registered successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Single column with vertical spacing */}
          {Object.keys(formData).map((key) => {
            if (key === 'photo') {
              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="text-lg font-medium text-gray-700 mb-2">
                    Upload Photo:
                  </label>
                  <input
                    type="file"
                    id={key}
                    name={key}
                    onChange={handleChange}
                    required
                    className={`border rounded-lg w-full py-2 px-4 text-lg ${
                      errors[key] ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                </div>
              );
            }
            return (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="text-lg font-medium text-gray-700 mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                </label>
                <input
                  type={key === 'dob' ? 'date' : 'text'}
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className={`border rounded-lg w-full py-2 px-4 text-lg ${
                    errors[key] ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  pattern={key === 'aadharNumber' ? '\\d{12}' : key === 'phoneNumber' ? '\\d{10}' : undefined}
                  title={
                    key === 'aadharNumber'
                      ? 'Aadhar number should be a 12-digit number'
                      : key === 'phoneNumber'
                      ? 'Phone number should be a 10-digit number'
                      : undefined
                  }
                />
                {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
              </div>
            );
          })}

          <div className="w-full">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPatient;
