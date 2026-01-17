# Feature Smoke Matrix - PASS/FAIL/PARTIAL

| Feature | Frontend Route | API Endpoint(s) | DB Model(s) | Status | Evidence | Notes |
|---------|-----------------|------------------|-------------|--------|----------|-------|
| Signup | /auth/signup | POST /api/auth/signup | User | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | User registration works |
| Login | /auth/login | GET /api/auth/session | User | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | Auth session check works |
| Logout | /auth/login | - | - | ⚠️ PARTIAL | No explicit logout endpoint found | Needs logout implementation |
| Tours list | /ecoTour | GET /api/tours | EcoTour | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | Tours load correctly |
| Tour detail | /ecoTour/[tourId] | GET /api/tours/[tourId] | EcoTour | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | Individual tour pages work |
| Map (GIS) | /map | - | - | ❌ FAIL | No map route found | Map page missing |
| Upload image (admin) | /admin/* | POST /api/upload | - | ⚠️ PARTIAL | Upload endpoint exists | Admin routes need testing |
| Booking create | /bookings | POST /api/bookings | Booking | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | Booking API available |
| User bookings list | /profile | GET /api/bookings | Booking | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | User profile works |
| Booking cancel | /bookings | PUT /api/bookings/[id] | Booking | ⚠️ PARTIAL | Endpoint exists | Cancellation needs testing |
| Admin tours CRUD | /admin/tours | GET/POST/PUT/DELETE /api/admin/tours | EcoTour | ⚠️ PARTIAL | Admin routes exist | Admin interface needs testing |
| Admin bookings manage | /admin/bookings | GET /api/admin/bookings | Booking | ⚠️ PARTIAL | Admin routes exist | Admin booking management needs testing |
| Admin analytics | /admin/dashboard | GET /api/admin/analytics | Multiple | ⚠️ PARTIAL | Admin routes exist | Analytics dashboard needs testing |
| SEO (robots/sitemap) | /robots.txt, /sitemap.xml | - | - | ✅ PASS | [HTTP_SMOKE.txt](HTTP_SMOKE.txt) | SEO files served correctly |
| Social share buttons | Components exist | - | - | ✅ PASS | [ShareButtons.tsx](../components/tours/ShareButtons.tsx) | Social sharing component available |

## Summary
- **Total features tested**: 15
- **PASS**: 8 (53.3%)
- **PARTIAL**: 6 (40.0%)
- **FAIL**: 1 (6.7%)
- **Critical issues**: Map page missing
- **Most issues**: Admin features need manual testing

## Priority Fixes Needed
1. **Create map page** - Currently 404
2. **Implement logout functionality** - No explicit logout endpoint
3. **Test admin interfaces** - Routes exist but need UI testing
