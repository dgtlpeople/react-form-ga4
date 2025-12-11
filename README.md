# React Form with GA4 Tracking

A comprehensive React application demonstrating form validation, error handling, and Google Analytics 4 (GA4) event tracking.

## Features

### Form Validations
The application includes a registration form with extensive validation rules:

- **Username**: 3-20 characters, alphanumeric and underscores only
- **Email**: Valid email format required
- **Password**: 
  - Minimum 8 characters
  - Must contain uppercase and lowercase letters
  - Must contain at least one number
  - Must contain at least one special character (!@#$%^&*)
- **Confirm Password**: Must match password
- **Age**: 18-120 years old, numeric only
- **Phone**: Valid phone format with at least 10 digits
- **Website**: Optional, but must be valid URL format if provided
- **Terms & Conditions**: Must be accepted

### GA4 Event Tracking

The application tracks the following events:

#### Form Events
- `form_submit_attempt` - When user tries to submit the form
- `form_submit_success` - When form is submitted successfully
- `form_submit_failed` - When form submission fails due to validation errors
- `form_validation_error` - Individual field validation errors
- `form_field_blur` - When user leaves a field
- `form_reset` - When reset button is clicked
- `form_cancel` - When cancel button is clicked

#### Button Events
All button clicks are tracked with context about the button and its location.

#### Error Events
- `error_occurred` - Any JavaScript errors
- React Error Boundary catches
- Unhandled promise rejections
- Global error handler events

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure GA4

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your GA4 Measurement ID:

```
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

To get your GA4 Measurement ID:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Navigate to Admin > Data Streams
4. Select your web stream
5. Copy the Measurement ID (format: G-XXXXXXXXXX)

### 3. Run the Application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
form-ga4/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FormComponent.js      # Main form with validations
│   │   ├── FormComponent.css     # Form styling
│   │   └── ErrorBoundary.js      # Error boundary component
│   ├── utils/
│   │   └── ga4.js               # GA4 tracking utilities
│   ├── App.js                   # Main app component
│   ├── App.css                  # App styling
│   ├── index.js                 # Entry point
│   └── index.css                # Global styles
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Validation Test Cases

Try these scenarios to see different validation errors:

1. **Email validation**:
   - Missing email: Leave blank
   - Invalid format: `test@`, `test.com`, `@test.com`

2. **Password validation**:
   - Too short: `Pass1!`
   - Missing uppercase: `password1!`
   - Missing lowercase: `PASSWORD1!`
   - Missing number: `Password!`
   - Missing special char: `Password1`

3. **Age validation**:
   - Under 18: `17`
   - Over 120: `121`
   - Non-numeric: `twenty`

4. **Phone validation**:
   - Too short: `12345`
   - Invalid characters: `abc-def-ghij`

5. **Username validation**:
   - Too short: `ab`
   - Too long: `thisisaverylongusernamethatexceedsthetwentycharacterlimit`
   - Invalid characters: `user name`, `user@name`

## GA4 Events Reference

### Event Parameters

Each tracked event includes relevant parameters:

```javascript
// Example: Form validation error
{
  event: 'form_validation_error',
  field_name: 'email',
  error_message: 'Invalid email format',
  error_type: 'validation'
}

// Example: Successful form submission
{
  event: 'form_submit_success',
  submit_attempt: 1,
  form_data: {
    has_website: true,
    age_range: 'young'
  }
}

// Example: Error tracking
{
  event: 'error_occurred',
  error_message: 'Cannot read property...',
  error_context: 'React Error Boundary',
  error_type: 'TypeError'
}
```

## Viewing GA4 Events

1. Go to your GA4 property
2. Navigate to **Reports > Realtime**
3. Interact with the form
4. See events appear in real-time

For detailed analysis:
- **Reports > Engagement > Events** - See all tracked events
- **Explore** - Create custom reports and funnels
- **DebugView** - See detailed event data (requires debug mode)

## Development Mode

In development mode:
- GA4 debug mode is enabled
- Console logs show all tracked events
- Error details are displayed in the error boundary

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Customization

### Adding New Validations

Edit [src/components/FormComponent.js](src/components/FormComponent.js) and add new validation functions:

```javascript
const validateNewField = (value) => {
  if (!value) return 'Field is required';
  // Add your validation logic
  return '';
};
```

### Adding New Events

Use the tracking utilities in [src/utils/ga4.js](src/utils/ga4.js):

```javascript
import { trackEvent } from '../utils/ga4';

trackEvent('custom_event', {
  param1: 'value1',
  param2: 'value2'
});
```

## Technologies Used

- **React 18** - UI framework
- **react-ga4** - GA4 integration library
- **CSS3** - Styling
- **HTML5** - Semantic markup

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning and development.

## Contributing

This is a demo project, but feel free to fork and customize it for your needs!

## Troubleshooting

### Events not appearing in GA4
- Check that your Measurement ID is correct in `.env`
- Ensure you're looking at the correct property in GA4
- Try using Realtime view for immediate feedback
- Check browser console for any errors

### Form not submitting
- This is expected! Check the console for validation errors
- All fields must pass validation
- Terms and conditions must be accepted

### Error boundary not working
- Error boundaries only catch errors in child components
- They don't catch errors in event handlers or async code
- Global error handlers catch these other types of errors

## Contact

For questions or issues, please open an issue on GitHub.
