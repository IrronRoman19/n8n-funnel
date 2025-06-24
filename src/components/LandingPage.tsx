import React, { useState } from 'react';
import './LandingPage.css';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  location: string;
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
    website: '',
    industry: '',
    location: ''
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
    if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid phone number (10-15 digits)' });
      return false;
    }

    // Website validation
    if (formData.website.trim()) {
      if (!/^https?:\/\/[\w.-]+(?:\/[\w.-]*)*$/.test(formData.website)) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid website URL starting with http:// or https://' });
        return false;
      }
    }

    // Industry validation
    if (formData.industry.trim()) {
      if (formData.industry.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Industry must be at least 2 characters long' });
        return false;
      }
    }

    // Location validation
    if (formData.location.trim()) {
      if (formData.location.trim().length < 2) {
        setFormState({ isSubmitting: false, isSuccess: false, error: 'Location must be at least 2 characters long' });
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
      setFormData({ firstName: '', lastName: '', email: '', phone: '', website: '', industry: '', location: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Failed to submit form. Please try again.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          <div className="form-group">
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
          
          <div className="form-group">
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.yourwebsite.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., Finance, Trading, Technology"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, USA"
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
    </div>
  );
};

export default LandingPage;
