# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up GA4 (Optional for testing)
```bash
# Create environment file
cp .env.example .env

# Edit .env and add your GA4 Measurement ID
# REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note**: The app works without GA4 configured - events will be logged to the console.

### 3. Run the App
```bash
npm start
```

Visit: http://localhost:3000

## 🧪 Test the Form

### Quick Validation Tests:

1. **Try to submit empty** → See all required field errors
2. **Email**: Type `test@test` → Invalid format error
3. **Password**: Type `password` → See multiple validation errors
4. **Age**: Type `15` → Must be 18+ error
5. **Phone**: Type `123` → Too short error
6. **Fill everything correctly** → Success!

### Buttons to Test:
- **Submit** → Validates and tracks submission
- **Reset** → Clears form (tracked)
- **Cancel** → Confirms before clearing (tracked)

## 📊 View GA4 Events

### In Console (Always Available):
Open browser DevTools → Console → See all tracked events

### In GA4 (If Configured):
1. Go to Google Analytics
2. Click **Realtime** → See events as they happen
3. Click **Events** → View event details

## 🎯 What Gets Tracked

✅ Every button click  
✅ Every validation error  
✅ Form submission attempts  
✅ Form success/failure  
✅ JavaScript errors  
✅ Field interactions  

## 🔧 Optional: Test Error Tracking

Uncomment this in `src/App.js` to enable error demo buttons:

```javascript
import ErrorDemo from './components/ErrorDemo';

// Add inside <main>:
<ErrorDemo />
```

Then you can trigger different types of errors to see how they're tracked!

## 📁 Key Files

- `src/components/FormComponent.js` - The main form with all validations
- `src/utils/ga4.js` - GA4 tracking functions
- `src/components/ErrorBoundary.js` - Catches and tracks React errors

## 💡 Tips

- **Development mode**: All events logged to console
- **No GA4 ID**: App works fine, just console logging
- **See all errors**: Try submitting empty form
- **Real-time feedback**: Validation on blur and change

## 🎨 Customize

Want to add more fields? Edit `FormComponent.js`:
1. Add field to `formData` state
2. Create validation function
3. Add field to JSX
4. Done!

---

**Need help?** Check the full [README.md](README.md) for detailed documentation.
