import React, { useState } from 'react';
import { Resend } from 'resend';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

/**
 * DomainQuoteForm - A React component for domain name quotation requests
 * 
 * @param {Object} props
 * @param {string} props.domainName - The domain name being quoted
 * @param {string} props.sellerEmail - Email address where quotes will be sent
 * @param {number} props.minPrice - Minimum acceptable price
 * @param {number} props.maxPrice - Maximum price (for UI slider)
 * @param {string} props.resendApiKey - Resend API key for sending emails (not recommended, use environment variables instead)
 * @param {string} props.apiEndpoint - Custom API endpoint for server-side email handling (recommended approach)
 * @param {string} props.currency - Currency symbol (default: '$')
 * @param {string} props.theme - Predefined theme ('light', 'dark', 'colorful')
 * @param {Object} props.customStyles - Custom styling options (overrides theme)
 * @returns {JSX.Element} The rendered form component
 */
const DomainQuoteForm = ({
  domainName,
  sellerEmail,
  minPrice = 100,
  maxPrice = 10000,
  resendApiKey,
  apiEndpoint,
  currency = '$',
  theme = 'light',
  customStyles = {}
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    price: Math.floor((minPrice + maxPrice) / 2),
    message: ''
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Valid email is required');
      return false;
    }
    
    if (!formData.phone.trim() || !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      setErrorMessage('Valid phone number is required');
      return false;
    }
    
    if (formData.price < minPrice) {
      setErrorMessage(`Price must be at least ${currency}${minPrice}`);
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Preferred approach: Use a server-side API endpoint
      if (apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domainName,
            sellerEmail,
            ...formData
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send quote request');
        }
      } 
      // Fallback approach: Use client-side Resend (not recommended for production)
      else if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: 'Domain Quote <onboarding@resend.dev>',
          to: sellerEmail,
          subject: `New Quote Request for ${domainName}`,
          html: `
            <h2>New Domain Quote Request</h2>
            <p><strong>Domain:</strong> ${domainName}</p>
            <p><strong>Offered Price:</strong> ${currency}${formData.price}</p>
            <h3>Buyer Information:</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            ${formData.message ? `<p><strong>Message:</strong> ${formData.message}</p>` : ''}
          `
        });
      } else {
        throw new Error('No email sending method configured');
      }
      
      setSubmitStatus('success');
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        price: Math.floor((minPrice + maxPrice) / 2),
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage('Failed to send quote. Please try again later.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Predefined themes
  const themes = {
    light: {
      container: 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-md',
      heading: 'text-xl font-bold mb-4 text-gray-800',
      label: 'block text-sm font-medium text-gray-700 mb-1',
      input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      slider: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
      button: 'w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50',
      errorText: 'mt-2 text-sm text-red-600',
      successContainer: 'p-4 bg-green-100 rounded-md',
      successText: 'text-green-800 flex items-center',
      errorContainer: 'p-4 bg-red-100 rounded-md',
      errorIcon: 'h-5 w-5 text-red-500 mr-2',
      successIcon: 'h-5 w-5 text-green-500 mr-2',
    },
    dark: {
      container: 'max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md',
      heading: 'text-xl font-bold mb-4 text-white',
      label: 'block text-sm font-medium text-gray-300 mb-1',
      input: 'w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      slider: 'w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer',
      button: 'w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50',
      errorText: 'mt-2 text-sm text-red-400',
      successContainer: 'p-4 bg-green-800 rounded-md',
      successText: 'text-green-200 flex items-center',
      errorContainer: 'p-4 bg-red-900 rounded-md',
      errorIcon: 'h-5 w-5 text-red-400 mr-2',
      successIcon: 'h-5 w-5 text-green-400 mr-2',
    },
    colorful: {
      container: 'max-w-md mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-md',
      heading: 'text-xl font-bold mb-4 text-purple-800',
      label: 'block text-sm font-medium text-purple-700 mb-1',
      input: 'w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500',
      slider: 'w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer',
      button: 'w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50',
      errorText: 'mt-2 text-sm text-red-600',
      successContainer: 'p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-md',
      successText: 'text-green-800 flex items-center',
      errorContainer: 'p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-md',
      errorIcon: 'h-5 w-5 text-red-500 mr-2',
      successIcon: 'h-5 w-5 text-green-500 mr-2',
    }
  };
  
  // Default styles that can be overridden
  const defaultStyles = {
    ...themes[theme] || themes.light,
    ...customStyles
  };
  
  // If submission was successful, show success message
  if (submitStatus === 'success') {
    return (
      <div className={defaultStyles.container}>
        <div className={defaultStyles.successContainer}>
          <p className={defaultStyles.successText}>
            <CheckCircleIcon className={defaultStyles.successIcon} />
            Your quote for {domainName} has been submitted successfully! We'll be in touch soon.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={defaultStyles.container}>
      <h2 className={defaultStyles.heading}>Request Quote for {domainName}</h2>
      
      {submitStatus === 'error' && (
        <div className={defaultStyles.errorContainer}>
          <p className="text-red-800 flex items-center">
            <ExclamationCircleIcon className={defaultStyles.errorIcon} />
            {errorMessage}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={defaultStyles.label}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={defaultStyles.input}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className={defaultStyles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={defaultStyles.input}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className={defaultStyles.label}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={defaultStyles.input}
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className={defaultStyles.label}>
            Your Offer: {currency}{formData.price}
          </label>
          <input
            type="range"
            id="price"
            name="price"
            min={minPrice}
            max={maxPrice}
            value={formData.price}
            onChange={handleChange}
            className={defaultStyles.slider}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{currency}{minPrice}</span>
            <span>{currency}{maxPrice}</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className={defaultStyles.label}>Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className={defaultStyles.input}
          ></textarea>
        </div>
        
        {errorMessage && !submitStatus && (
          <p className={defaultStyles.errorText}>{errorMessage}</p>
        )}
        
        <button
          type="submit"
          className={defaultStyles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
        </button>
      </form>
    </div>
  );
};

export default DomainQuoteForm;
