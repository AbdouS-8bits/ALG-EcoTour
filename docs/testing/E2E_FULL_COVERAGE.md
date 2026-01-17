# E2E Full Coverage Testing Guide

## Overview
This guide covers comprehensive end-to-end testing for ALG EcoTour using Playwright with full project coverage including visitor flows, authentication, user features, admin functionality, and media handling.

## Prerequisites

### Environment Variables
Set these environment variables for authentication setup:
```bash
# User credentials (for testing user flows)
export E2E_USER_EMAIL="user@example.com"
export E2E_USER_PASSWORD="password123"

# Admin credentials (for testing admin flows)
export E2E_ADMIN_EMAIL="admin@example.com"
export E2E_ADMIN_PASSWORD="admin123"
```

### Database Setup
1. **Ensure database is running**
2. **Seed test data** (recommended):
   ```bash
   npm run seed
   ```

### Dependencies
- Node.js installed
- Project dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install`)

## Running Tests

### 1. Setup Authentication States
Before running tests, generate authentication storage states:
```bash
# This creates user.json and admin.json files for authenticated tests
npx playwright test tests/e2e/_setup.storage.spec.ts
```

### 2. Run All Tests
```bash
# Headless mode (CI/CD)
npm run test:e2e

# Interactive UI mode (development)
npm run test:e2e:ui
```

### 3. View Test Reports
```bash
# Opens HTML report in browser
npm run test:e2e:report
```

## Test Coverage

### 1. Setup Tests (`_setup.storage.spec.ts`)
- **User Authentication**: Creates user via signup if needed, saves state to `.auth/user.json`
- **Admin Authentication**: Attempts admin login, saves state to `.auth/admin.json`
- **Auto-creation**: If users don't exist, creates them through UI

### 2. Visitor Tests (`visitor.spec.ts`)
- **"/" loads**: Verifies main page loads without 404
- **"/ecoTour" loads**: Confirms tours listing page works
- **open first tour card -> expects url contains "/ecoTour/"**: Tests navigation to first available tour
- **"/map" loads and shows map container**: Checks map page (may not be implemented)

### 3. SEO Tests (`seo.spec.ts`)
- **"/robots.txt" returns 200 and contains "User-agent"**: Verifies robots.txt accessibility and content
- **sitemap route returns 200**: Confirms sitemap loads with valid XML (tries common URLs)

### 4. Authentication Tests (`auth.spec.ts`)
- **signup page loads; attempt signup once; assert not 429; capture response status if fails**: Tests user registration with random email
- **login works for normal user**: Validates authentication flow with credentials
- **logout works (logout button disappears OR session endpoint shows unauthenticated)**: Tests logout functionality

### 5. User Tests (`user.spec.ts`) - *Requires Authentication*
- **create booking from tour detail and verify success UI**: Tests tour booking flow
- **"/bookings" shows at least one booking or empty-state without crash**: Checks user's booking list
- **cancel booking if UI exists (otherwise mark as skipped with clear message)**: Tests booking cancellation
- **"/profile" update flow if page exists**: Tests profile information updates
- **"/settings" update flow if page exists**: Tests user settings preferences

### 6. Admin Tests (`admin.spec.ts`) - *Requires Authentication*
- **"/admin/dashboard" loads and shows analytics cards**: Verifies admin dashboard loads
- **"/admin/tours" create minimal tour with lat/lng and verify it appears**: Tests tour creation with coordinates
- **"/admin/bookings" loads; if bookings exist confirm/cancel first pending**: Tests booking management

### 7. Media Tests (`media.spec.ts`)
- **tour detail gallery renders without broken image placeholder (basic check: at least one image element or fallback)**: Tests image gallery on tour pages
- **admin upload flow if UI exists; otherwise document limitation**: Tests image upload interface

## Understanding Results

### HTML Report
- **Location**: `playwright-report/index.html`
- **Features**:
  - Complete test results overview
  - Screenshots on failure
  - Video recordings of failed tests
  - Test execution timeline
  - Error details and stack traces
  - Annotations for known issues

### Test Status Interpretation

#### ✅ PASSED
- Test completed successfully
- All assertions met
- No critical issues found

#### ❌ FAILED
- Test did not complete as expected
- Screenshots and traces captured automatically
- Check HTML report for detailed error information

#### ⚠️ SKIPPED
- Test not executed (usually due to missing prerequisites)
- Clear skip messages provided

#### 📝 ANNOTATIONS
- Known issues documented in test results
- Expected failures (like missing features)
- Implementation gaps identified

## How to Run Dev Server

1. **Start development server**:
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:3000`

2. **Verify server is running**:
   - Open `http://localhost:3000` in browser
   - Check that the home page loads

## How to Open UI

1. **Run tests in UI mode**:
   ```bash
   npm run test:e2e:ui
   ```

2. **Access UI at**: `http://localhost:9323`

3. **UI Features**:
   - Live test execution
   - Step-by-step debugging
   - Pause at any point
   - Inspect page state
   - Browser dev tools integration

## How to Read HTML Report

1. **Open report**:
   ```bash
   npm run test:e2e:report
   ```

2. **Report Sections**:
   - **Overview**: Pass/fail statistics
   - **Test Results**: Individual test details
   - **Screenshots**: Visual evidence of failures
   - **Traces**: Step-by-step execution replay
   - **Annotations**: Known issues and context

3. **Interpreting Failures**:
   - Check error messages
   - Review screenshots for visual issues
   - Use traces to debug step-by-step
   - Look for annotations explaining expected failures

## Demo Checklist

### Before Running Tests
- [ ] Database is running
- [ ] Environment variables set
- [ ] Test data seeded (optional but recommended)
- [ ] Dev server not running (tests start their own)

### After Running Tests
- [ ] All tests executed
- [ ] HTML report reviewed
- [ ] Failed tests investigated
- [ ] Critical issues prioritized

## File Structure

```
tests/e2e/
├── _setup.storage.spec.ts    # Authentication setup
├── selectors.ts              # Centralized selectors
├── visitor.spec.ts           # Unauthenticated user flows
├── seo.spec.ts             # SEO and accessibility
├── auth.spec.ts             # Authentication flows
├── user.spec.ts            # Authenticated user features
├── admin.spec.ts           # Admin functionality
└── media.spec.ts           # Media and image handling

.auth/                       # Authentication state files
├── user.json              # User authentication state
├── admin.json             # Admin authentication state
└── admin-failed.json     # Failed admin login attempt

playwright-report/            # Test results and artifacts
├── index.html            # HTML report
├── test-results/         # Screenshots and videos
└── trace/               # Trace files
```

## Troubleshooting

### Common Issues

#### 1. "Authentication state files not found"
**Cause**: Setup tests not run first
**Solution**: Run `npx playwright test tests/e2e/_setup.storage.spec.ts`

#### 2. "Admin login failed"
**Cause**: Admin user doesn't exist or incorrect credentials
**Solution**: 
1. Create regular user via signup
2. Update user role to 'admin' in database
3. Set correct admin credentials in environment variables

#### 3. "No tours available for testing"
**Cause**: Empty database
**Solution**: Run `npm run seed` to populate test data

#### 4. "Tests timeout"
**Cause**: Slow loading or network issues
**Solution**: 
- Check server performance
- Increase timeout values in tests
- Verify database connectivity

#### 5. "Storage state corrupted"
**Cause**: Authentication state files are invalid
**Solution**: Delete `.auth/` directory and re-run setup tests

## Best Practices

### Test Development
1. **Use centralized selectors** from `selectors.ts`
2. **Add annotations for known issues**
3. **Test both success and failure paths**
4. **Use robust selectors** (avoid brittle CSS)
5. **Wait for proper load states**

### Test Execution
1. **Run setup tests first** to generate auth states
2. **Use UI mode for debugging** failed tests
3. **Check HTML report** for detailed error analysis
4. **Review screenshots** for visual issues

### Continuous Integration
```yaml
- name: Setup E2E Authentication
  run: npx playwright test tests/e2e/_setup.storage.spec.ts
  
- name: Run E2E Tests
  run: npm run test:e2e
  
- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Performance Considerations

### Test Optimization
- **Parallel execution**: Tests run in parallel by default
- **Selective testing**: Run specific test files during development
- **Storage states**: Reuse authentication to avoid repeated logins

### Resource Management
- **Browser cleanup**: Tests automatically close browsers
- **Memory usage**: Monitor during large test suites
- **Disk space**: Clean old test results periodically

## Next Steps

1. **Initial Setup**: Run authentication setup tests
2. **Full Test Run**: Execute complete test suite
3. **Review Results**: Analyze HTML report for issues
4. **Fix Critical Issues**: Prioritize failing tests
5. **Expand Coverage**: Add edge cases and error scenarios
6. **CI Integration**: Automate test execution in pipeline

## Expected Test Results

### Healthy Project
- **Pass Rate**: >80%
- **Critical Failures**: 0
- **Known Issues**: Documented with annotations

### Needs Attention
- **Pass Rate**: <60%
- **Authentication Failures**: Multiple auth-related failures
- **Missing Features**: Tests skipped due to unimplemented features

This comprehensive E2E testing setup provides full coverage of ALG EcoTour application with stable, deterministic tests that can be integrated into CI/CD pipelines.
