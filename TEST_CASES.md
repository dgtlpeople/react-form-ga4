# Form Validation Test Cases

## Complete Testing Guide

This document provides comprehensive test cases for all form validations.

---

## 📋 Field: Username

### ✅ Valid Inputs
- `john123`
- `mary_jane`
- `user_1`
- `ABC123xyz`

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| *(empty)* | Username is required |
| `ab` | Username must be at least 3 characters |
| `a` | Username must be at least 3 characters |
| `thisisaverylongusernamethatexceedstwentycharacters` | Username must be at most 20 characters |
| `john doe` | Username can only contain letters, numbers, and underscores |
| `user@name` | Username can only contain letters, numbers, and underscores |
| `john-doe` | Username can only contain letters, numbers, and underscores |
| `user.name` | Username can only contain letters, numbers, and underscores |

---

## 📧 Field: Email

### ✅ Valid Inputs
- `user@example.com`
- `john.doe@company.co.uk`
- `test+tag@domain.com`
- `name_123@test-domain.org`

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| *(empty)* | Email is required |
| `test` | Invalid email format |
| `test@` | Invalid email format |
| `@test.com` | Invalid email format |
| `test.com` | Invalid email format |
| `test @test.com` | Invalid email format |
| `test@test` | Invalid email format |

---

## 🔒 Field: Password

### ✅ Valid Inputs
- `Password1!`
- `MyP@ssw0rd`
- `Test123!@#`
- `SecureP@ss1`

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| *(empty)* | Password is required |
| `Pass1!` | Password must be at least 8 characters |
| `short1!` | Password must be at least 8 characters |
| `password1!` | Password must contain at least one uppercase letter |
| `PASSWORD1!` | Password must contain at least one lowercase letter |
| `Password!` | Password must contain at least one number |
| `Password1` | Password must contain at least one special character (!@#$%^&*) |
| `Password` | Multiple errors (missing number and special character) |
| `12345678` | Multiple errors (missing uppercase, lowercase, and special) |

---

## 🔒 Field: Confirm Password

### ✅ Valid Inputs
- *(Same as password field)*

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| *(empty)* | Please confirm your password |
| `DifferentPass1!` (when password is `Password1!`) | Passwords do not match |

---

## 🎂 Field: Age

### ✅ Valid Inputs
- `18`
- `25`
- `65`
- `120`

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| *(empty)* | Age is required |
| `17` | You must be at least 18 years old |
| `0` | You must be at least 18 years old |
| `-5` | You must be at least 18 years old |
| `121` | Please enter a valid age |
| `200` | Please enter a valid age |
| `abc` | Age must be a number |
| `twenty` | Age must be a number |
| `25.5` | Age must be a number (browser may prevent decimal) |

---

## 📱 Field: Phone Number

### ✅ Valid Inputs
- `+1 555 123 4567`
- `(555) 123-4567`
- `555-123-4567`
- `5551234567`
- `+44 20 7123 4567`
- `+1-555-123-4567`

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| *(empty)* | Phone number is required |
| `123` | Phone number must have at least 10 digits |
| `12345` | Phone number must have at least 10 digits |
| `123456789` | Phone number must have at least 10 digits |
| `abcdefghij` | Invalid phone number format |
| `phone number` | Invalid phone number format |
| `555.123.4567` (with periods) | ✅ May actually be valid - periods are removed |

---

## 🌐 Field: Website (Optional)

### ✅ Valid Inputs
- *(empty)* - Field is optional
- `https://example.com`
- `http://test.org`
- `www.example.com`
- `example.com`
- `subdomain.example.co.uk`

### ❌ Invalid Inputs

| Input | Error Message |
|-------|--------------|
| `not a url` | Invalid URL format |
| `http://` | Invalid URL format |
| `example` | Invalid URL format |
| `.com` | Invalid URL format |
| `http://example` | Invalid URL format |

---

## ✅ Field: Terms and Conditions

### ✅ Valid Input
- *(checked)*

### ❌ Invalid Input
- *(unchecked)* → You must accept the terms and conditions

---

## 🎯 Complete Test Scenarios

### Scenario 1: Empty Form Submission
1. Leave all fields empty
2. Click Submit
3. **Expected**: All required fields show error messages

### Scenario 2: Incremental Validation
1. Fill out username: `ab` → Error on blur
2. Fix to `john123` → Error clears
3. Fill email: `test@` → Error on blur
4. Fix to `test@example.com` → Error clears
5. Continue for all fields

### Scenario 3: Password Mismatch
1. Password: `Password1!`
2. Confirm Password: `Password2!`
3. Click Submit or blur from confirm field
4. **Expected**: "Passwords do not match" error

### Scenario 4: Age Boundary Testing
1. Enter `17` → Error: Must be 18+
2. Change to `18` → Error clears
3. Enter `120` → No error
4. Enter `121` → Error: Invalid age

### Scenario 5: Successful Submission
1. Fill all fields correctly:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `Password1!`
   - Confirm: `Password1!`
   - Age: `25`
   - Phone: `555-123-4567`
   - Website: *(leave empty or add `https://example.com`)*
   - Terms: *(check box)*
2. Click Submit
3. **Expected**: Success alert, form resets

### Scenario 6: Multiple Failed Attempts
1. Try submitting with errors
2. Fix some errors, try again
3. Fix remaining errors
4. **Expected**: Submit count increments, final success

### Scenario 7: Reset Button
1. Fill out several fields
2. Click Reset
3. **Expected**: All fields clear, no errors shown

### Scenario 8: Cancel Button
1. Fill out several fields
2. Click Cancel
3. **Expected**: Confirmation dialog
4. Confirm
5. **Expected**: Form resets

---

## 📊 GA4 Events to Verify

For each test scenario, check that appropriate events are fired:

### On Field Blur
- `form_field_blur` event
- If error: `form_validation_error` event

### On Submit Attempt
- `form_submit_attempt` event
- If errors: `form_submit_failed` event + individual `form_validation_error` events
- If success: `form_submit_success` event

### On Reset/Cancel
- `form_reset` or `form_cancel` event

---

## 🔍 Testing Checklist

- [ ] All required fields show error when empty
- [ ] Username validation (length, characters)
- [ ] Email format validation
- [ ] Password complexity validation
- [ ] Password confirmation matching
- [ ] Age range validation (18-120)
- [ ] Phone number format and length
- [ ] Website URL validation (optional field)
- [ ] Terms checkbox requirement
- [ ] Real-time validation on blur
- [ ] Real-time validation on change (after first blur)
- [ ] Submit button validates all fields
- [ ] Reset button clears form
- [ ] Cancel button shows confirmation
- [ ] Success message on valid submission
- [ ] Submit counter increments
- [ ] All GA4 events tracked
- [ ] Console shows event logs

---

## 💡 Pro Testing Tips

1. **Open DevTools Console** - See all GA4 events in real-time
2. **Use Tab Key** - Navigate through fields to test blur events
3. **Test Edge Cases** - Try unusual inputs (emoji, special chars, very long strings)
4. **Test Copy-Paste** - Paste invalid data to test validation
5. **Mobile Testing** - Test on smaller screens for responsive design
6. **Keyboard Navigation** - Ensure all interactions work without mouse

---

## 🐛 Common Issues to Test

1. **Whitespace**: Leading/trailing spaces in fields
2. **Special Characters**: Test with unicode, emoji, etc.
3. **Very Long Input**: Test maximum lengths
4. **Rapid Clicking**: Click submit multiple times quickly
5. **Browser Autofill**: Test with browser saved data
6. **Tab Navigation**: Ensure blur events fire correctly

---

**Happy Testing! 🎉**
