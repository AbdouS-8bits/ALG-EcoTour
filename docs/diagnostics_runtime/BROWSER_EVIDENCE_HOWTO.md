# Runtime Browser Evidence Collection Guide

## How to Collect Runtime Evidence

### 1. Console Errors
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Navigate through the application
4. **Screenshot** any red error messages
5. Note the **URL** and **action** that triggered the error
6. Copy full error stack traces

### 2. Network Failed Requests
1. Go to **Network** tab in Developer Tools
2. Filter by "Failed" or "4xx/5xx" status codes
3. **Screenshot** failed requests
4. Note:
   - Request URL
   - HTTP status code
   - Request payload (if applicable)
   - Response error message

### 3. Steps to Reproduce Issues
For each issue found:
1. **Clear browser cache**
2. **Open in incognito mode**
3. **Navigate to the problematic page**
4. **Perform the action that fails**
5. **Document each step** with screenshots
6. Note browser version and OS

### 4. Common Issues to Check
- **Signup flow**: Complete registration process
- **Login flow**: Authentication with valid/invalid credentials
- **Tour booking**: Select tour → fill form → submit
- **Image uploads**: Try uploading tour images
- **Admin functions**: Access admin panel with credentials
- **Responsive design**: Test on mobile viewport
- **Form validation**: Submit empty/invalid forms

### 5. Evidence Documentation
Create screenshots with:
- **Full page context** (include URL bar)
- **Error messages** (console and UI)
- **Network requests** (failed ones)
- **Mobile vs desktop** differences

Save evidence as:
- Screenshots: PNG/JPG files
- Console logs: Copy-paste text
- Network errors: HAR files (optional)

### 6. Testing Checklist
- [ ] Home page loads without errors
- [ ] Tour listing displays correctly
- [ ] Tour detail pages load
- [ ] Signup process completes
- [ ] Login works with valid credentials
- [ ] Booking form submits successfully
- [ ] Admin panel accessible
- [ ] No console errors on navigation
- [ ] Mobile responsive layout works
- [ ] Images load correctly

### 7. Reporting Format
For each issue found:
```
## Issue Title
**URL**: [page where issue occurred]
**Browser**: [browser and version]
**Steps to Reproduce**:
1. [step 1]
2. [step 2]
3. [step 3]

**Expected Behavior**: [what should happen]
**Actual Behavior**: [what actually happened]
**Error Message**: [exact error text]
**Screenshot**: [reference to screenshot file]
```

### 8. Tools to Use
- **Browser DevTools**: Built-in Chrome/Firefox tools
- **BrowserStack/Responsive**: For cross-browser testing
- **Postman**: For API testing
- **Lighthouse**: For performance and accessibility audit
