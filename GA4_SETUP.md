# Setting Up GA4 Tracking

## Step-by-Step Guide to Configure Google Analytics 4

### Option 1: Test Without GA4 (Easiest)

The app works perfectly without GA4 configured! All events will be logged to the browser console.

**No setup needed** - just run `npm start` and open the console to see events.

---

### Option 2: Set Up Real GA4 Tracking

#### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. Click **Create Property**
4. Enter property details:
   - Property name: `Form GA4 Demo` (or your choice)
   - Timezone and currency
5. Click **Next** and **Create**

#### 2. Create Data Stream

1. After creating property, you'll be prompted to set up a data stream
2. Click **Web**
3. Enter:
   - Website URL: `http://localhost:3000` (for development)
   - Stream name: `Development` or `Local Testing`
4. Click **Create stream**

#### 3. Get Measurement ID

1. After creating the stream, you'll see the **Measurement ID**
2. Format: `G-XXXXXXXXXX`
3. **Copy this ID**

#### 4. Configure Your App

1. In the project root, create `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your editor

3. Replace the placeholder with your Measurement ID:
   ```
   REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. Save the file

5. **Restart the development server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm start
   ```

#### 5. Verify It's Working

**In Browser Console:**
```
GA4 initialized successfully
Event tracked: form_field_blur { field_name: "email", has_error: false }
```

**In GA4 Realtime:**
1. Go to Google Analytics
2. Click **Reports** → **Realtime**
3. Interact with your form
4. See events appear within seconds!

---

## Using GA4 DebugView

For detailed event inspection in development:

### Enable DebugView (Already Enabled)

The app automatically enables debug mode in development. You can verify by checking the initialization:

```javascript
// In src/utils/ga4.js
gaOptions: {
  debug_mode: process.env.NODE_ENV === 'development',
}
```

### Access DebugView

1. Go to Google Analytics
2. Click **Admin** → **DebugView**
3. Your events will appear with full details
4. Click any event to see all parameters

---

## Production Setup

When deploying to production:

### 1. Create Production Data Stream

1. In GA4, go to **Admin** → **Data Streams**
2. Click **Add stream**
3. Choose **Web**
4. Enter your production URL: `https://yourdomain.com`
5. Get the new Measurement ID

### 2. Set Environment Variable

**For Vercel, Netlify, etc:**
```
REACT_APP_GA4_MEASUREMENT_ID=G-YYYYYYYYYY
```

**For custom server:**
```bash
# .env.production
REACT_APP_GA4_MEASUREMENT_ID=G-YYYYYYYYYY
```

### 3. Build & Deploy

```bash
npm run build
# Deploy the build folder
```

---

## Multiple Environments

You can have different IDs for different environments:

### Development (.env.development)
```
REACT_APP_GA4_MEASUREMENT_ID=G-DEV1234567
```

### Staging (.env.staging)
```
REACT_APP_GA4_MEASUREMENT_ID=G-STG1234567
```

### Production (.env.production)
```
REACT_APP_GA4_MEASUREMENT_ID=G-PRD1234567
```

---

## Common Issues & Solutions

### Issue: "GA4 Measurement ID is not set"

**Solution:** 
- Check `.env` file exists in project root
- Verify the variable name: `REACT_APP_GA4_MEASUREMENT_ID`
- Restart the development server after creating/editing `.env`

### Issue: Events not appearing in GA4

**Possible causes:**
1. **Wrong Measurement ID** - Double-check the ID
2. **Ad Blocker** - Disable ad blocker or use incognito
3. **Delay** - Realtime can take 10-30 seconds
4. **Wrong Property** - Make sure you're viewing the correct property

### Issue: "Failed to initialize GA4"

**Solution:**
- Check browser console for detailed error
- Verify internet connection
- Check if GA4 scripts are blocked by firewall/extension

### Issue: Can't find Measurement ID

**Location:**
1. Google Analytics → **Admin**
2. Under Property column → **Data Streams**
3. Click your stream
4. Measurement ID is at the top

---

## Testing GA4 Integration

### 1. Check Console Logs

Open DevTools Console and interact with the form. You should see:
```
GA4 initialized successfully
Page view tracked: /
Event tracked: form_field_blur { field_name: "email", has_error: false }
Event tracked: form_validation_error { field_name: "email", error_message: "Invalid email format" }
```

### 2. Check GA4 Realtime

1. Open Google Analytics in another tab
2. Go to **Reports** → **Realtime**
3. Fill out the form in your app
4. See events appear in GA4 within 10-30 seconds

### 3. Check DebugView (Most Detailed)

1. Go to **Admin** → **DebugView**
2. See events with full parameter details
3. Click any event to expand all data

---

## Optional: Enhanced Measurement

GA4 can automatically track some interactions:

1. Go to **Admin** → **Data Streams**
2. Click your stream
3. Toggle **Enhanced measurement** ON
4. This adds automatic tracking for:
   - Page views
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads

**Note**: Our app already tracks custom events, so this is optional.

---

## Privacy & GDPR Compliance

If deploying to production with real users:

### 1. Add Cookie Consent

Users should consent before GA4 tracking starts.

### 2. Update Privacy Policy

Disclose that you use Google Analytics.

### 3. IP Anonymization

GA4 automatically anonymizes IPs in the EU.

### 4. Data Retention Settings

1. Go to **Admin** → **Data Settings** → **Data Retention**
2. Set retention period (2-14 months)

---

## Resources

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Events Documentation](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [react-ga4 Library](https://github.com/PriceRunner/react-ga4)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)

---

**Need Help?** Check the [README.md](README.md) or open an issue on GitHub.
