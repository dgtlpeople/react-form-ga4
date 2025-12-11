import React, { useState } from 'react';
import { trackEvent } from '../utils/ga4';
import './FormComponent.css';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
    website: '',
    username: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [additionalPhones, setAdditionalPhones] = useState([]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const validateAge = (age) => {
    if (!age) return 'Age is required';
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 'Age must be a number';
    if (ageNum < 18) return 'You must be at least 18 years old';
    if (ageNum > 120) return 'Please enter a valid age';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (!phoneRegex.test(phone)) return 'Invalid phone number format';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return 'Phone number must have at least 10 digits';
    return '';
  };

  const validateWebsite = (website) => {
    if (!website) return ''; // Optional field
    // eslint-disable-next-line no-useless-escape
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(website)) return 'Invalid URL format';
    return '';
  };

  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be at most 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateTerms = (terms) => {
    if (!terms) return 'You must accept the terms and conditions';
    return '';
  };

  // Validate all fields
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value, formData.password);
      case 'age':
        return validateAge(value);
      case 'phone':
        return validatePhone(value);
      case 'website':
        return validateWebsite(value);
      case 'username':
        return validateUsername(value);
      case 'terms':
        return validateTerms(value);
      default:
        return '';
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing (optional - removes error while typing)
    if (touched[name] && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Only track if there's an error
    if (error) {
      trackEvent('form_validation_error', {
        field_name: name,
        error_message: error,
        error_type: 'validation',
      });
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newSubmitCount = submitCount + 1;
    setSubmitCount(newSubmitCount);

    // Track submit attempt
    trackEvent('form_submit_attempt', {
      submit_count: newSubmitCount,
    });

    // Validate all fields
    const newErrors = validateAllFields();
    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // If there are errors, track them and don't submit
    if (Object.keys(newErrors).length > 0) {
      trackEvent('form_submit_failed', {
        error_count: Object.keys(newErrors).length,
        errors: Object.keys(newErrors).join(', '),
        submit_attempt: newSubmitCount,
      });

      // Track each individual error
      Object.entries(newErrors).forEach(([field, error]) => {
        trackEvent('form_validation_error', {
          field_name: field,
          error_message: error,
          error_type: 'submit_validation',
        });
      });

      return;
    }

    // Success
    trackEvent('form_submit_success', {
      submit_attempt: newSubmitCount,
      form_data: {
        has_website: !!formData.website,
        age_range: formData.age < 30 ? 'young' : formData.age < 50 ? 'middle' : 'senior',
      },
    });

    alert('Form submitted successfully!');
    
    // Reset form
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      phone: '',
      website: '',
      username: '',
      terms: false,
    });
    setErrors({});
    setTouched({});
    setSubmitCount(0);
  };

  // Handle reset
  const handleReset = () => {
    trackEvent('form_reset', {
      had_data: Object.values(formData).some((val) => val),
    });

    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      phone: '',
      website: '',
      username: '',
      terms: false,
    });
    setErrors({});
    setTouched({});
  };

  // Handle cancel
  const handleCancel = () => {
    trackEvent('form_cancel', {
      had_data: Object.values(formData).some((val) => val),
    });
    
    if (Object.values(formData).some((val) => val)) {
      if (window.confirm('Are you sure you want to cancel? All data will be lost.')) {
        handleReset();
      }
    }
  };

  // Handle export
  const handleExport = () => {
    trackEvent('button_click', {
      button_name: 'Export',
      button_location: 'form_actions',
      action_type: 'export',
    });

    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-data.json';
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Form data exported!');
  };

  // Handle save draft
  const handleSaveDraft = () => {
    trackEvent('button_click', {
      button_name: 'Save Draft',
      button_location: 'form_actions',
      action_type: 'save_draft',
      has_data: Object.values(formData).some((val) => val),
    });

    localStorage.setItem('formDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
  };

  // Handle load draft
  const handleLoadDraft = () => {
    trackEvent('button_click', {
      button_name: 'Load Draft',
      button_location: 'form_actions',
      action_type: 'load_draft',
    });

    const draft = localStorage.getItem('formDraft');
    if (draft) {
      setFormData(JSON.parse(draft));
      alert('Draft loaded successfully!');
    } else {
      alert('No saved draft found.');
    }
  };

  // Handle print
  const handlePrint = () => {
    trackEvent('button_click', {
      button_name: 'Print',
      button_location: 'form_actions',
      action_type: 'print',
    });

    window.print();
  };

  // Handle share
  const handleShare = () => {
    trackEvent('button_click', {
      button_name: 'Share',
      button_location: 'form_actions',
      action_type: 'share',
    });

    if (navigator.share) {
      navigator.share({
        title: 'Form Registration',
        text: 'Check out this form!',
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      alert('Share feature is not supported in this browser.');
    }
  };

  // Handle add phone field
  const handleAddPhone = () => {
    trackEvent('button_click', {
      button_name: 'Add Phone Number',
      button_location: 'form_actions',
      action_type: 'add_field',
      field_type: 'phone',
      current_count: additionalPhones.length,
    });

    setAdditionalPhones([...additionalPhones, { id: Date.now(), value: '' }]);
  };

  // Handle remove phone field
  const handleRemovePhone = (id) => {
    trackEvent('button_click', {
      button_name: 'Remove Phone Number',
      button_location: 'form_actions',
      action_type: 'remove_field',
      field_type: 'phone',
    });

    setAdditionalPhones(additionalPhones.filter(phone => phone.id !== id));
    
    // Clean up errors for removed field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`additionalPhone_${id}`];
      return newErrors;
    });
    
    setTouched(prev => {
      const newTouched = { ...prev };
      delete newTouched[`additionalPhone_${id}`];
      return newTouched;
    });
  };

  // Handle additional phone change
  const handleAdditionalPhoneChange = (id, value) => {
    setAdditionalPhones(additionalPhones.map(phone => 
      phone.id === id ? { ...phone, value } : phone
    ));

    // Clear error when user starts typing
    const fieldName = `additionalPhone_${id}`;
    if (touched[fieldName] && errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  // Handle additional phone blur
  const handleAdditionalPhoneBlur = (id, value) => {
    const fieldName = `additionalPhone_${id}`;
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    const error = validatePhone(value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));

    if (error) {
      trackEvent('form_validation_error', {
        field_name: fieldName,
        error_message: error,
        error_type: 'validation',
        is_dynamic_field: true,
      });
    }
  };

  return (
    <div className="form-container">
      <h1>User Registration Form</h1>
      <p className="form-description">
        This form demonstrates various validation cases and GA4 event tracking.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">
            Username <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.username && touched.username ? 'error' : ''}
            placeholder="Enter username (3-20 characters)"
          />
          {errors.username && touched.username && (
            <span className="error-message">{errors.username}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? 'error' : ''}
            placeholder="Enter your email"
          />
          {errors.email && touched.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password && touched.password ? 'error' : ''}
            placeholder="Enter password"
          />
          {errors.password && touched.password && (
            <span className="error-message">{errors.password}</span>
          )}
          <small className="hint">
            Must be 8+ characters with uppercase, lowercase, number, and special character
          </small>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="age">
            Age <span className="required">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.age && touched.age ? 'error' : ''}
            placeholder="Enter your age"
            min="18"
            max="120"
          />
          {errors.age && touched.age && (
            <span className="error-message">{errors.age}</span>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.phone && touched.phone ? 'error' : ''}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && touched.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        {/* Additional Phone Numbers */}
        {additionalPhones.map((phone, index) => (
          <div className="form-group additional-field" key={phone.id}>
            <label htmlFor={`additionalPhone_${phone.id}`}>
              Additional Phone Number {index + 1}
            </label>
            <div className="input-with-button">
              <input
                type="tel"
                id={`additionalPhone_${phone.id}`}
                value={phone.value}
                onChange={(e) => handleAdditionalPhoneChange(phone.id, e.target.value)}
                onBlur={(e) => handleAdditionalPhoneBlur(phone.id, e.target.value)}
                className={errors[`additionalPhone_${phone.id}`] && touched[`additionalPhone_${phone.id}`] ? 'error' : ''}
                placeholder="+1 (555) 123-4567"
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => handleRemovePhone(phone.id)}
                title="Remove this phone number"
              >
                ✕
              </button>
            </div>
            {errors[`additionalPhone_${phone.id}`] && touched[`additionalPhone_${phone.id}`] && (
              <span className="error-message">{errors[`additionalPhone_${phone.id}`]}</span>
            )}
          </div>
        ))}

        {/* Add Phone Button */}
        <div className="form-group">
          <button type="button" className="btn btn-add-field" onClick={handleAddPhone}>
            ➕ Add Additional Phone Number
          </button>
        </div>

        {/* Website (Optional) */}
        <div className="form-group">
          <label htmlFor="website">Website (Optional)</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.website && touched.website ? 'error' : ''}
            placeholder="https://example.com"
          />
          {errors.website && touched.website && (
            <span className="error-message">{errors.website}</span>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>
              I accept the terms and conditions <span className="required">*</span>
            </span>
          </label>
          {errors.terms && touched.terms && (
            <span className="error-message">{errors.terms}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button type="button" className="btn btn-danger" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {/* Additional Action Buttons */}
        <div className="action-buttons">
          <button type="button" className="btn btn-action" onClick={handleExport}>
            📤 Export
          </button>
          <button type="button" className="btn btn-action" onClick={handleSaveDraft}>
            💾 Save Draft
          </button>
          <button type="button" className="btn btn-action" onClick={handleLoadDraft}>
            📂 Load Draft
          </button>
          <button type="button" className="btn btn-action" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button type="button" className="btn btn-action" onClick={handleShare}>
            🔗 Share
          </button>
        </div>

        {/* Submit count indicator */}
        {submitCount > 0 && (
          <div className="submit-info">
            Submit attempts: {submitCount}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormComponent;
