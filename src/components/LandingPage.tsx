import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import Select from 'react-select';
import 'react-phone-input-2/lib/style.css';
import './LandingPage.css';
import './PhoneInputStyles.css';
import { countries } from '../utils/countries';

const n8nurl = process.env.REACT_APP_N8N_URL;

// Define option type
interface Option {
  value: string;
  label: string;
}

// Options arrays
const tradingInterestOptions = [
  { value: 'stocks', label: 'Stocks' },
  { value: 'cryptocurrency', label: 'Cryptocurrency' },
  { value: 'forex', label: 'Forex' },
  { value: 'options', label: 'Options' },
  { value: 'futures', label: 'Futures' },
  { value: 'other', label: 'Other' }
];

const tradingExperienceOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
];

const industryOptions = [
  { value: '', label: 'Select industry' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'education', label: 'Education' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'other', label: 'Other' }
];

interface CountryOption {
  code: string;
  name: string;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  address: string;
  postalCode: string;
  city: string;
  country: CountryOption;
  interestedInCourse: boolean;
  tradingExperience: string;
  receiveTemplate: boolean;
  tradingInterest: string;
} // No need for countryCode in state as PhoneInput handles it internally

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    address: '',
    postalCode: '',
    city: '',
    country: null as unknown as CountryOption,
    interestedInCourse: false,
    tradingExperience: '',
    receiveTemplate: false,
    tradingInterest: '',
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const validateForm = (): boolean => {
    // First Name validation
    const firstName = formData.firstName.trim();
    if (!firstName) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your first name' });
      return false;
    }
    if (firstName.length < 2) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'First name must be at least 2 characters long' });
      return false;
    }

    // Last Name validation
    const lastName = formData.lastName.trim();
    if (!lastName) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your last name' });
      return false;
    }
    if (lastName.length < 2) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Last name must be at least 2 characters long' });
      return false;
    }

    // Email validation
    const email = formData.email.trim();
    if (!email) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your email address' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid email address' });
      return false;
    }

    // Phone validation
    const phone = formData.phone.trim();
    if (!phone) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your phone number' });
      return false;
    }

    // Country validation
    if (!formData.country) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your country' });
      return false;
    }
    if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid phone number with country code' });
      return false;
    }

    // Company validation (optional)
    const company = formData.company.trim();

    // Postal Code validation
    const postalCode = formData.postalCode.trim();
    if (postalCode) {
      if (!/^[0-9]+$/.test(postalCode)) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Postal code can only contain numbers' });
        return false;
      }
    }

    // Country validation
    if (!formData.country) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your country' });
      return false;
    }
    if (!formData.country.code) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select a valid country' });
      return false;
    }

    // Trading Experience validation
    if (!formData.tradingExperience) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your trading experience level' });
      return false;
    }

    // Trading Interest validation
    if (!formData.tradingInterest) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your area of trading interest' });
      return false;
    }
    // Company validation (optional - no length check)

    // Industry validation
    if (!formData.industry) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your industry' });
      return false;
    }

    // Location validation
    if (!formData.country || !formData.country.name) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your country' });
      return false;
    }
    if (formData.country.name.length < 2) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Country name must be at least 2 characters long' });
      return false;
    }
    if (formData.city.trim()) {
      if (formData.city.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'City must be at least 2 characters long' });
        return false;
      }
    }
    if (formData.address.trim()) {
      if (formData.address.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Address must be at least 2 characters long' });
        return false;
      }
    }
    if (formData.postalCode.trim()) {
      if (formData.postalCode.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Postal code must be at least 2 characters long' });
        return false;
      }
    }



    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ isSubmitting: true, isSuccess: false, error: null });

    if (!validateForm()) return;

    // Determine the appropriate webhook URL based on environment
    const webhookUrl = process.env.NODE_ENV === 'production' 
      ? `${n8nurl}/webhook/course-lead-webhook`
      : `${n8nurl}/webhook-test/course-lead-webhook`;

    // Submit form data
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        country: formData.country.code,
        countryName: formData.country.name
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Form submitted successfully:', data);
      setFormState({ isSubmitting: false, isSuccess: true, error: null });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        address: '',
        postalCode: '',
        city: '',
        country: null as unknown as CountryOption,
        interestedInCourse: false,
        tradingExperience: '',
        receiveTemplate: false,
        tradingInterest: ''
      });
    })
    .catch(error => {
      console.error('Form submission error:', error);
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: error.message || 'An error occurred while submitting the form. Please try again.'
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    setFormData(prev => ({
      ...prev,
      country: selectedOption || countries[0]
    }));
  };

  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>Transform Your Business with n8n Trade</h1>
        <p>Automate your trading workflows with powerful integrations</p>
      </div>

      <div className="lead-form">
        <h2>Get Started Today</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="company">Company name (optional):</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="trading-interest">Area of Trading Interest:</label>
            <Select<Option>
              id="trading-interest"
              name="tradingInterest"
              value={tradingInterestOptions.find((option: Option) => option.value === formData.tradingInterest)}
              onChange={(option: Option | null) => setFormData(prev => ({
                ...prev,
                tradingInterest: option?.value || ''
              }))}
              options={tradingInterestOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              required
              placeholder="Select your area of interest"
            />
          </div>

          <div className="form-group">
            <label htmlFor="trading-experience">Trading Experience Level:</label>
            <Select<Option>
              id="trading-experience"
              name="tradingExperience"
              value={tradingExperienceOptions.find((option: Option) => option.value === formData.tradingExperience)}
              onChange={(option: Option | null) => setFormData(prev => ({
                ...prev,
                tradingExperience: option?.value || ''
              }))}
              options={tradingExperienceOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              required
              placeholder="Select your experience level"
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="interestedInCourse"
                  checked={formData.interestedInCourse}
                  onChange={handleChange}
                />
                I'm interested in learning about AI-Powered Trading Automation with n8n
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="receiveTemplate"
                  checked={formData.receiveTemplate}
                  onChange={handleChange}
                />
                Yes, I want to receive the free n8n workflow template
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <PhoneInput
              country={'us'}
              value={formData.phone}
              onChange={(value, countryData: { dialCode?: string }) => {
                // Get the country code from the selected country
                const countryCode = countryData?.dialCode || '';
                // Format the number with country code and plus sign
                const fullNumber = value.startsWith('+') ? value : `+${value}`;
                setFormData({ 
                  ...formData, 
                  phone: fullNumber
                });
              }}
              placeholder="E.g. +1 234 567 8900"
              enableSearch
              searchPlaceholder="Search country..."
              inputStyle={{
                color: '#333',
                fontFamily: 'Arial, sans-serif'
              }}
              inputProps={{
                placeholder: 'E.g. +1 234 567 8900'
              }}
            />
          </div>


          <div className="form-group">
            <label htmlFor="industry">Industry:</label>
            <Select
              id="industry"
              name="industry"
              value={industryOptions.find((option) => option.value === formData.industry)}
              onChange={(selectedOption) => {
                handleChange({ target: { name: 'industry', value: selectedOption?.value || '' } } as React.ChangeEvent<HTMLSelectElement>);
              }}
              options={industryOptions}
              placeholder="Select your industry"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                className="form-control"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="postalCode">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                  setFormData({ ...formData, postalCode: value });
                }}
                required
                placeholder="Enter postal code (numbers only)"
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter your city"
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="country">Country:</label>
              <Select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleCountryChange}
                options={countries}
                getOptionLabel={(option: CountryOption) => option.name}
                getOptionValue={(option: CountryOption) => option.code}
                required
                placeholder="Select your country"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Submitting...' : 'Get Started'}
          </button>
          
          {formState.error && (
            <div className="error-message">
              {formState.error}
            </div>
          )}
          
          {formState.isSuccess && (
            <div className="success-message">
              Thank you for your interest! We'll be in touch soon.
            </div>
          )}
        </form>
      </div>

      <div className="features-section">
        <h2>Why Choose n8n Trade?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Automated Workflows</h3>
            <p>Streamline your trading processes with automated workflows</p>
          </div>
          <div className="feature-card">
            <h3>Powerful Integrations</h3>
            <p>Connect with multiple trading platforms and tools</p>
          </div>
          <div className="feature-card">
            <h3>Custom Solutions</h3>
            <p>Build custom solutions tailored to your needs</p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;