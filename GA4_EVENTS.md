# GA4 Event Tracking Reference

## 📊 All Tracked Events

### Form Validation Events

#### `form_validation_error`
Triggered when a field fails validation.

**Parameters:**
- `field_name` (string): Name of the field with error
- `error_message` (string): The validation error message
- `error_type` (string): Either "validation" or "submit_validation"

**Example:**
```json
{
  "event": "form_validation_error",
  "field_name": "email",
  "error_message": "Invalid email format",
  "error_type": "validation"
}
```

---

#### `form_field_blur`
Triggered when user leaves a field (on blur).

**Parameters:**
- `field_name` (string): Name of the field
- `has_error` (boolean): Whether the field has a validation error

**Example:**
```json
{
  "event": "form_field_blur",
  "field_name": "password",
  "has_error": true
}
```

---

### Form Submission Events

#### `form_submit_attempt`
Triggered every time user clicks Submit button.

**Parameters:**
- `submit_count` (number): Number of submission attempts

**Example:**
```json
{
  "event": "form_submit_attempt",
  "submit_count": 1
}
```

---

#### `form_submit_success`
Triggered when form passes all validations and submits successfully.

**Parameters:**
- `submit_attempt` (number): Which attempt succeeded
- `form_data` (object): Aggregated form data
  - `has_website` (boolean): Whether user provided website
  - `age_range` (string): "young" (<30), "middle" (30-49), or "senior" (50+)

**Example:**
```json
{
  "event": "form_submit_success",
  "submit_attempt": 2,
  "form_data": {
    "has_website": true,
    "age_range": "young"
  }
}
```

---

#### `form_submit_failed`
Triggered when form submission fails due to validation errors.

**Parameters:**
- `error_count` (number): Number of validation errors
- `errors` (string): Comma-separated list of fields with errors
- `submit_attempt` (number): Which submission attempt failed

**Example:**
```json
{
  "event": "form_submit_failed",
  "error_count": 3,
  "errors": "email, password, age",
  "submit_attempt": 1
}
```

---

### Button Events

#### `form_reset`
Triggered when Reset button is clicked.

**Parameters:**
- `had_data` (boolean): Whether form had any data when reset

**Example:**
```json
{
  "event": "form_reset",
  "had_data": true
}
```

---

#### `form_cancel`
Triggered when Cancel button is clicked.

**Parameters:**
- `had_data` (boolean): Whether form had any data when cancelled

**Example:**
```json
{
  "event": "form_cancel",
  "had_data": true
}
```

---

### Error Tracking Events

#### `error_occurred`
Triggered for any JavaScript errors.

**Parameters:**
- `error_message` (string): The error message
- `error_context` (string): Where the error occurred
- `error_stack` (string): Stack trace (truncated to 500 chars)
- `error_type` (string): Type of error (TypeError, ReferenceError, etc.)
- Additional context-specific parameters

**Example - React Error:**
```json
{
  "event": "error_occurred",
  "error_message": "Cannot read property 'x' of undefined",
  "error_context": "React Error Boundary",
  "error_type": "TypeError",
  "component_stack": "at FormComponent (FormComponent.js:123)...",
  "error_boundary": true
}
```

**Example - Global Error:**
```json
{
  "event": "error_occurred",
  "error_message": "Uncaught TypeError: Cannot read property...",
  "error_context": "Global Error Handler",
  "filename": "bundle.js",
  "lineno": 1234,
  "colno": 56
}
```

**Example - Promise Rejection:**
```json
{
  "event": "error_occurred",
  "error_message": "Network request failed",
  "error_context": "Unhandled Promise Rejection",
  "promise": "Promise { <rejected> }"
}
```

---

## 🎯 Event Categories

### By User Action
- **Field Interaction**: `form_field_blur`
- **Validation**: `form_validation_error`
- **Submission**: `form_submit_attempt`, `form_submit_success`, `form_submit_failed`
- **Form Management**: `form_reset`, `form_cancel`

### By System
- **Errors**: `error_occurred`
- **Performance**: Can add `timing_complete` events

---

## 📈 Example Queries for GA4

### Top Validation Errors
```
Event name: form_validation_error
Group by: error_message
Sort by: Event count (descending)
```

### Form Completion Rate
```
Funnel:
1. form_submit_attempt
2. form_submit_success
```

### Average Attempts to Success
```
Event: form_submit_success
Metric: Average submit_attempt
```

### Most Problematic Fields
```
Event name: form_validation_error
Group by: field_name
Sort by: Event count (descending)
```

### Error Rate
```
Event name: error_occurred
Group by: error_context, error_type
```

---

## 🔍 Debugging Events

### In Browser Console
All events are logged with full details:
```
Event tracked: form_validation_error {field_name: "email", error_message: "Invalid email format", error_type: "validation"}
```

### In GA4 DebugView
1. Enable in development mode (automatic)
2. Go to Admin → DebugView
3. See real-time events with all parameters

### In GA4 Realtime
1. Go to Reports → Realtime
2. See events as they happen
3. Click on event to see details

---

## 🛠️ Customizing Events

### Add New Event
```javascript
import { trackEvent } from '../utils/ga4';

trackEvent('custom_event_name', {
  param1: 'value1',
  param2: 'value2',
  param3: 123
});
```

### Track Button Click
```javascript
import { trackButtonClick } from '../utils/ga4';

trackButtonClick('Button Label', 'Component Name', {
  additional_context: 'value'
});
```

### Track Error
```javascript
import { trackError } from '../utils/ga4';

try {
  // Your code
} catch (error) {
  trackError(error, 'Function Name', {
    user_action: 'what user was doing'
  });
}
```

---

## 📋 Best Practices

1. **Event Names**: Use snake_case (GA4 standard)
2. **Parameter Names**: Use snake_case consistently
3. **Parameter Values**: Keep strings under 100 chars
4. **Error Stacks**: Truncate to 500 chars max
5. **PII**: Never track personally identifiable information
6. **Testing**: Use DebugView in development
7. **Documentation**: Keep this reference updated

---

## 🎓 Learn More

- [GA4 Events Documentation](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Event Parameters](https://support.google.com/analytics/answer/9267735)
- [react-ga4 Library](https://github.com/PriceRunner/react-ga4)
