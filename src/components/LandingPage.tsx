import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './LandingPage.css';
import './PhoneInputStyles.css';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
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
    website: '',
    industry: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
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
    if (!formData.firstName.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your first name' });
      return false;
    }
    if (formData.firstName.trim().length < 2) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'First name must be at least 2 characters long' });
      return false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your last name' });
      return false;
    }
    if (formData.lastName.trim().length < 2) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Last name must be at least 2 characters long' });
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your email address' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid email address' });
      return false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your phone number' });
      return false;
    }
    if (!/^[+]?[0-9]{10,15}$/.test(formData.phone)) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid phone number with country code' });
      return false;
    }

    // Website validation
    if (formData.website.trim()) {
      if (!/^https?:\/\/[\w.-]+(?:\/[\w.-]*)*$/.test(formData.website)) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid website URL starting with http:// or https://' });
        return false;
      }
    }

    // Postal Code validation
    if (formData.postalCode.trim()) {
      if (!/^[0-9]+$/.test(formData.postalCode)) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Postal code can only contain numbers' });
        return false;
      }
    }

    // Company validation
    if (!formData.company.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your company name' });
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
    if (formData.company.trim().length < 1) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Company name must be at least 1 character long' });
      return false;
    }

    // Industry validation
    if (formData.industry.trim()) {
      if (formData.industry.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Industry must be at least 2 characters long' });
        return false;
      }
    }

    // Location validation
    if (formData.country.trim()) {
      if (formData.country.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Country must be at least 2 characters long' });
        return false;
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormState({ isSubmitting: true, isSuccess: false, error: null });

    try {
      const response = await fetch('http://localhost:5678/webhook-test/course-lead-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setFormState({ isSubmitting: false, isSuccess: true, error: null });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        industry: '',
        address: '',
        postalCode: '',
        country: '',
        city: '',
        interestedInCourse: false,
        tradingExperience: '',
        receiveTemplate: false,
        tradingInterest: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Failed to submit form. Please try again.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
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
              <label htmlFor="firstName">First Name</label>
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
              <label htmlFor="lastName">Last Name</label>
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
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="company">Company name (optional)</label>
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
            <label htmlFor="trading-interest">Area of Trading Interest</label>
            <select
              id="trading-interest"
              name="tradingInterest"
              value={formData.tradingInterest}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select your area of interest</option>
              <option value="forex">Forex Trading</option>
              <option value="cryptocurrency">Cryptocurrency Trading</option>
              <option value="stocks">Stock Trading</option>
              <option value="options">Options Trading</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="trading-experience">Trading Experience Level</label>
            <select
              id="trading-experience"
              name="tradingExperience"
              value={formData.tradingExperience}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
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
            <label htmlFor="website">Website (optional)</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="industry">Industry (optional)</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Enter your industry"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
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
              <label htmlFor="city">City</label>
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
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="Enter your country"
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
    </div>
  );
};

export default LandingPage;
