import React, { useState } from 'react';
import './LandingPage.css';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: ''
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your name' });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.phone.trim()) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Please enter your phone number' });
      return false;
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
      setFormData({ name: '', email: '', phone: '' });
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
