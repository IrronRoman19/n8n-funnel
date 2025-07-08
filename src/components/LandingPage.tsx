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

const topicOfInterestOptions = [
  { value: 'Python', label: 'Python' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Pandas', label: 'Pandas' },
  { value: 'AI', label: 'AI' }
];

const learningGoalOptions = [
  { value: 'Get a job', label: 'Get a job' },
  { value: 'Improve skills', label: 'Improve skills' },
  { value: 'Switch careers', label: 'Switch careers' },
  { value: 'Academic growth', label: 'Academic growth' },
  { value: 'Personal interest', label: 'Personal interest' }
];

const weeklyTimeCommitmentOptions = [
  { value: '0–2 hrs', label: '0–2 hrs' },
  { value: '2–5 hrs', label: '2–5 hrs' },
  { value: '5–10 hrs', label: '5–10 hrs' },
  { value: '10+ hrs', label: '10+ hrs' }
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
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
  country: CountryOption;
  codingExperience: string;
  language: string;
  level: string;
  topicOfInterest: string[];
  learningGoal: string;
  weeklyTimeCommitment: string;
}

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
    country: { code: '', name: '' },
    codingExperience: '',
    language: '',
    level: '',
    topicOfInterest: [],
    learningGoal: '',
    weeklyTimeCommitment: ''
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
    if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid phone number with country code' });
      return false;
    }

    // Country validation
    if (!formData.country || !formData.country.code) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your country' });
      return false;
    }

    // Coding Experience validation
    if (!formData.codingExperience.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your coding experience' });
      return false;
    }

    // Language validation
    if (!formData.language.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your preferred programming language' });
      return false;
    }

    // Level validation
    if (!formData.level) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your skill level' });
      return false;
    }

    // Topic of Interest validation
    if (formData.topicOfInterest.length === 0) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select at least one topic of interest' });
      return false;
    }

    // Learning Goal validation
    if (!formData.learningGoal) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your learning goal' });
      return false;
    }

    // Weekly Time Commitment validation
    if (!formData.weeklyTimeCommitment) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please select your weekly time commitment' });
      return false;
    }




    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ isSubmitting: true, isSuccess: false, error: null });

    if (!validateForm()) return;

    // Determine the appropriate webhook URL based on environment
    if (!n8nurl) {
      setFormState({ 
        isSubmitting: false, 
        isSuccess: false, 
        error: 'Server configuration error. Please contact support.' 
      });
      return;
    }
    
    // Ensure n8nurl has proper protocol and no trailing slash
    const baseUrl = n8nurl.replace(/\/+$/, '');
    const webhookPath = process.env.NODE_ENV === 'production' 
      ? '/webhook/course-lead-webhook'
      : '/webhook-test/course-lead-webhook';
    const webhookUrl = `${baseUrl}${webhookPath}`;

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
    .then(async response => {
      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = 'Network response was not ok';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (response.status === 404) {
            errorMessage = 'The form submission service is currently unavailable. Please try again later or contact support.';
          }
        } catch (e) {
          // If we can't parse the error response, use the status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
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
        country: { code: '', name: '' },
        codingExperience: '',
        language: '',
        level: '',
        topicOfInterest: [],
        learningGoal: '',
        weeklyTimeCommitment: ''
      });
    })
    .catch(error => {
      console.error('Form submission error:', error);
      
      let userFriendlyError = 'An error occurred while submitting the form. Please try again.';
      
      if (error.message.includes('Failed to fetch')) {
        userFriendlyError = 'Unable to connect to the form submission service. Please check your internet connection and try again.';
      } else if (error.message.includes('NetworkError')) {
        userFriendlyError = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        userFriendlyError = error.message;
      }
      
      console.error('Detailed error:', error);
      
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: userFriendlyError
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleMultiSelectChange = (selectedOptions: readonly Option[] | null, actionMeta: { name?: string }) => {
    if (!actionMeta.name) return;
    setFormData(prev => ({
      ...prev,
      [actionMeta.name as string]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSelectChange = (selectedOption: Option | null, actionMeta: { name?: string }) => {
    if (!actionMeta.name) return;
    setFormData(prev => ({
      ...prev,
      [actionMeta.name as string]: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    setFormData(prev => ({
      ...prev,
      country: selectedOption || { code: '', name: '' }
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
            <label htmlFor="country">Country:</label>
            <Select
              id="country"
              name="country"
              value={formData.country?.code ? formData.country : null}
              onChange={handleCountryChange}
              options={countries}
              getOptionLabel={(option: CountryOption) => option.name}
              getOptionValue={(option: CountryOption) => option.code}
              required
              placeholder="Select your country"
              isClearable={true}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label htmlFor="codingExperience">Coding Experience:</label>
            <input
              type="text"
              id="codingExperience"
              name="codingExperience"
              value={formData.codingExperience}
              onChange={handleChange}
              required
              placeholder="Describe your coding experience"
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Programming Language:</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              placeholder="E.g., Python, JavaScript, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Skill Level:</label>
            <Select
              id="level"
              value={levelOptions.find(option => option.value === formData.level) || null}
              onChange={(value, actionMeta) => {
                handleSelectChange(value, { name: 'level' });
              }}
              options={levelOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              required
              placeholder="Select your skill level"
            />
          </div>

          <div className="form-group">
            <label>Topics of Interest:</label>
            <Select
              isMulti
              name="topicOfInterest"
              options={topicOfInterestOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={(value, actionMeta) => {
                handleMultiSelectChange(value, { name: 'topicOfInterest' });
              }}
              value={topicOfInterestOptions.filter(option => 
                formData.topicOfInterest.includes(option.value)
              )}
              required
              placeholder="Select topics of interest..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="learningGoal">Learning Goal:</label>
            <Select
              id="learningGoal"
              name="learningGoal"
              value={learningGoalOptions.find(option => option.value === formData.learningGoal) || null}
              onChange={(value, actionMeta) => {
                handleSelectChange(value, { name: 'learningGoal' });
              }}
              options={learningGoalOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              required
              placeholder="Select your learning goal"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weeklyTimeCommitment">Weekly Time Commitment:</label>
            <Select
              id="weeklyTimeCommitment"
              name="weeklyTimeCommitment"
              value={weeklyTimeCommitmentOptions.find(option => option.value === formData.weeklyTimeCommitment) || null}
              onChange={(value, actionMeta) => {
                handleSelectChange(value, { name: 'weeklyTimeCommitment' });
              }}
              options={weeklyTimeCommitmentOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              required
              placeholder="Select your weekly time commitment"
            />
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