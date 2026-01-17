# Playwright E2E Testing Guide

## Overview
This guide covers how to run and interpret end-to-end tests for ALG EcoTour using Playwright.

## Prerequisites
- Node.js installed
- Project dependencies installed (`npm install`)
- Database running (for full functionality)

## Running Tests

### 1. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### 2. Run Tests Headless
```bash
npm run test:e2e
```
- Runs tests in background without browser UI
- Fastest execution
- Ideal for CI/CD pipelines
- Results saved to `playwright-report/`

### 3. Run Tests with UI
```bash
npm run test:e2e:ui
```
- Opens Playwright Test Runner UI at `http://localhost:9323`
- Shows live browser execution
- Allows step-by-step debugging
- Best for development and debugging

### 4. View Test Reports
```bash
npm run test:e2e:report
```
- Opens HTML report in default browser
- Shows test results, screenshots, and traces
- Located at `playwright-report/index.html`

## Test Coverage

### Core Tests
1. **home.spec.ts** - Verifies home page loads correctly
   - Checks page title
   - Validates navigation elements
   - Confirms main content visibility

2. **tours.spec.ts** - Tests tours listing and navigation
   - Visits `/ecoTour` page
   - Clicks first tour card
   - Verifies navigation to tour detail page

3. **map.spec.ts** - Tests map page availability
   - Visits `/map` page
   - Expects NOT to return 404
   - **Will fail until map page is implemented**

4. **auth.spec.ts** - Tests signup functionality
   - Visits `/auth/signup` page
   - Attempts signup with random email
   - Asserts no 429 rate limiting
   - Captures response status on failure

## Understanding Results

### HTML Report
- **Location**: `playwright-report/index.html`
- **Features**:
  - Test results overview
  - Screenshots on failure
  - Test execution timeline
  - Error details and stack traces

### UI Mode
- **URL**: `http://localhost:9323`
- **Features**:
  - Live test execution
  - Step-by-step debugging
  - Pause at any point
  - Inspect page state
  - Browser dev tools integration

### Screenshots & Videos
- **Location**: `playwright-report/`
- **Trigger**: Automatically on failure
- **Format**: PNG screenshots, WebM videos
- **Use**: Visual debugging and evidence

## Test Status Interpretation

### ✅ PASSED
- Test completed successfully
- All assertions met
- No errors encountered

### ❌ FAILED
- Test did not complete as expected
- Screenshots and traces captured automatically
- Check HTML report for detailed error information

### ⚠️ EXPECTED FAILURES
- Map test expected to fail until map page is implemented
- Auth test may fail due to validation or server issues
- These are known issues tracked in annotations

## Common Issues and Solutions

### 1. "Map page returns 404"
- **Expected**: Map page not implemented yet
- **Solution**: Implement map page at `/app/map/page.tsx`

### 2. "Rate limiting (429) on signup"
- **Cause**: Too many signup attempts
- **Solution**: Wait between attempts or use different emails

### 3. "No tour cards found"
- **Cause**: Empty database or loading issues
- **Solution**: Run `npm run seed` to populate test data

### 4. "Server not running"
- **Cause**: Dev server not started
- **Solution**: Run `npm run dev` before tests

## Debugging Failed Tests

### 1. Use UI Mode
```bash
npm run test:e2e:ui
```
- Watch tests execute in real-time
- Pause at any point to inspect state

### 2. Check HTML Report
```bash
npm run test:e2e:report
```
- Review error messages and screenshots
- Check test annotations for context

### 3. Run Individual Tests
```bash
# Run specific test file
npx playwright test tests/e2e/home.spec.ts

# Run specific test
npx playwright test --grep "home page loads"
```

## Continuous Integration

### GitHub Actions Example
```yaml
- name: Run E2E tests
  run: npm run test:e2e
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Best Practices

1. **Run tests before deployment**
2. **Check HTML report for any failures**
3. **Review screenshots for visual regressions**
4. **Update tests when UI changes**
5. **Use UI mode for debugging**
6. **Keep test data isolated**

## File Structure
```
tests/e2e/
├── home.spec.ts      # Home page tests
├── tours.spec.ts     # Tours listing tests
├── map.spec.ts       # Map page tests
└── auth.spec.ts      # Authentication tests

playwright-report/     # Test results and artifacts
├── index.html        # HTML report
├── test-results/     # Screenshots and videos
└── trace/           # Trace files
```

## Troubleshooting

### Browser Not Found
```bash
npx playwright install
```

### Port Already in Use
- Stop any existing dev server
- Tests will start their own server

### UI Mode Not Accessible
- Check if port 9323 is available
- Use `--port` flag to specify different port

### Database Connection Issues
- Ensure database is running
- Check `.env` configuration
- Verify database schema is up to date

## Next Steps

1. **Run initial test suite**: `npm run test:e2e`
2. **Review results**: `npm run test:e2e:report`
3. **Debug failures**: `npm run test:e2e:ui`
4. **Fix critical issues** (map page, etc.)
5. **Add more test cases** as needed
6. **Integrate into CI/CD pipeline**
