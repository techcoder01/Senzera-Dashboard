"use client";

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Sidebar from "@/components/common/SideBar";
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    location: '',
    clientApplicant: '',
    projectType: '',
    buildingClass: '',
    buildingUsage: '',
    numberOfFloors: '',
    grossFloorArea: '',
    buildingVolume: '',
    technicalData: '',
    relevantAuthorities: '',
    documentList: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const isZip = selectedFile.name.toLowerCase().endsWith('.zip') || 
                    selectedFile.type === 'application/zip' || 
                    selectedFile.type === 'application/x-zip-compressed' ||
                    selectedFile.type === 'application/octet-stream';
      
      if (isZip) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a ZIP file');
        setFile(null);
      }
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const response = await axios.post('http://18.192.10.230:8000/upload', formDataToSend, {
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type - axios will set it automatically with boundary
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data) {
        setFormData(response.data);
        setError(null);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'Upload failed'
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .split(/(?=[A-Z])/).join(' ') // Split on capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  return (
    <div className="flex flex-col md:flex-row bg-white">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 font-sans">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-black">New Project</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4 md:mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full md:w-1/2 p-2 bg-blue-50 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-6 md:mb-8">
            <label className="flex items-center justify-center px-4 py-2 border border-gray-700 border-dashed rounded text-sm text-gray-600 w-full md:w-auto cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="mr-2" size={18} />
              {file ? file.name : 'Upload ZIP file'}
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".zip,application/zip,application/x-zip-compressed,application/octet-stream"
              />
            </label>
            <button
              type="button"
              onClick={uploadFile}
              className="px-6 py-2 rounded text-sm text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center w-full md:w-auto disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              disabled={loading || !file}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Processing...'}
                </span>
              ) : (
                'Upload and Process'
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-500 mb-4 p-2 bg-red-50 rounded border border-red-100">
              {error}
            </div>
          )}

          {Object.keys(formData).some(key => formData[key]) && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Extracted Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-16 md:gap-y-4">
                {Object.entries(formData).map(([key, value], index) => (
                  value && (
                    <div key={key} className={index >= 10 ? "col-span-1 md:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {formatFieldName(key)}:
                      </label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-100">
                        {value || '-'}
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;