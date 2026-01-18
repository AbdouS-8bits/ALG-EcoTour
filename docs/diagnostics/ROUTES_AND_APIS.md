# Routes and APIs Documentation

**Generated**: January 15, 2026  
**Purpose**: Complete list of application routes and API endpoints  
**System**: ALG-EcoTour Web Application  

---

## 🌐 **Application Routes (Pages)**

### **Public Routes**
| Route | Path | File | Description |
|-------|-------|------|-------------|
| **Home** | `/` | `app/page.tsx` | Main landing page |
| **About** | `/about` | `app/about/page.tsx` | About page |
| **Contact** | `/contact` | `app/contact/page.tsx` | Contact page |
| **Tours List** | `/ecoTour` | `app/ecoTour/page.tsx` | Tours listing page |
| **Tour Detail** | `/ecoTour/[tourId]` | `app/ecoTour/[tourId]/page.tsx` | Individual tour page |
| **Map** | `/map` | `app/map/page.tsx` | Interactive map page |
| **Auth Login** | `/auth/login` | `app/auth/login/page.tsx` | User login |
| **Auth Signup** | `/auth/signup` | `app/auth/signup/page.tsx` | User signup |

### **Protected Routes**
| Route | Path | File | Description |
|-------|-------|------|-------------|
| **Bookings** | `/bookings` | `app/bookings/page.tsx` | User bookings management |
| **Profile** | `/profile` | `app/profile/page.tsx` | User profile |
| **Settings** | `/settings` | `app/settings/page.tsx` | User settings |

### **Admin Routes**
| Route | Path | File | Description |
|-------|-------|------|-------------|
| **Admin Login** | `/admin/login` | `app/admin/login/page.tsx` | Admin login |
| **Admin Dashboard** | `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Admin dashboard |
| **Admin Tours** | `/admin/tours` | `app/admin/tours/page.tsx` | Tour management |
| **Admin EcoTours** | `/admin/EcoTours` | `app/admin/EcoTours/page.tsx` | EcoTour management |
| **Admin Bookings** | `/admin/bookings` | `app/admin/bookings/page.tsx` | Booking management |

---

## 🔌 **API Routes**

### **Authentication APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **ALL** | `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | NextAuth.js authentication |
| **POST** | `/api/auth/register` | `app/api/auth/register/route.ts` | User registration |
| **POST** | `/api/auth/signup` | `app/api/auth/signup/route.ts` | User signup |

### **Tour Management APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **GET** | `/api/tours` | `app/api/tours/route.ts` | Get tours list |
| **GET** | `/api/tours/[tourId]` | `app/api/tours/[tourId]/route.ts` | Get single tour |
| **GET** | `/api/geojson` | `app/api/geojson/route.ts` | Get tours as GeoJSON |
| **GET/POST** | `/api/reviews` | `app/api/reviews/route.ts` | Tour reviews |

### **Booking APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **GET/POST** | `/api/bookings` | `app/api/bookings/route.ts` | User bookings |
| **PUT/DELETE** | `/api/bookings/[bookingId]` | `app/api/bookings/[bookingId]/route.ts` | Manage booking |

### **Availability APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **GET/POST** | `/api/availability` | `app/api/availability/route.ts` | Tour availability |
| **GET/POST** | `/api/availability/check` | `app/api/availability/check/route.ts` | Check availability |

### **Admin APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **GET** | `/api/admin/analytics` | `app/api/admin/analytics/route.ts` | Analytics data |
| **GET/POST** | `/api/admin/bookings` | `app/api/admin/bookings/route.ts` | Admin bookings |
| **GET/POST/PUT/DELETE** | `/api/admin/tours` | `app/api/admin/tours/route.ts` | Tour CRUD |
| **GET/PUT/DELETE** | `/api/admin/tours/[id]` | `app/api/admin/tours/[id]/route.ts` | Tour management |

### **User Management APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **GET/PUT** | `/api/user/profile` | `app/api/user/profile/route.ts` | User profile |
| **GET/PUT** | `/api/user/settings` | `app/api/user/settings/route.ts` | User settings |

### **Utility APIs**
| Method | Path | File | Description |
|---------|-------|------|-------------|
| **POST** | `/api/upload` | `app/api/upload/route.ts` | Image upload |

---

## 📊 **Route Summary**

### **Total Routes**
- **App Routes**: 16 pages
- **API Routes**: 18 endpoints
- **Total**: 34 routes

### **Route Categories**
- **Public Pages**: 8 routes
- **Protected Pages**: 3 routes
- **Admin Pages**: 5 routes
- **Authentication APIs**: 3 endpoints
- **Tour APIs**: 4 endpoints
- **Booking APIs**: 2 endpoints
- **Availability APIs**: 2 endpoints
- **Admin APIs**: 4 endpoints
- **User APIs**: 2 endpoints
- **Utility APIs**: 1 endpoint

---

## 🛡️ **Authentication Requirements**

### **Public Access**
- Home, About, Contact, Tours List, Tour Detail, Map
- Auth Login/Signup pages
- All GET APIs for tours and reviews

### **Authentication Required**
- Bookings, Profile, Settings pages
- Booking management APIs
- User profile/settings APIs

### **Admin Required**
- All admin pages
- All admin APIs
- Upload API (admin-only)

---

## 🔗 **Route Dependencies**

### **Database Dependencies**
- All API routes require database connection
- Authentication routes require user table
- Booking routes require booking table
- Tour routes require tour table

### **External Service Dependencies**
- Upload API requires Cloudinary
- Auth routes require email service (if configured)
- Map page requires OpenStreetMap tiles

### **Authentication Dependencies**
- Protected routes require NextAuth session
- Admin routes require admin role
- API routes may require authentication headers

---

## 🚀 **Route Features**

### **Dynamic Routes**
- `/ecoTour/[tourId]` - Dynamic tour pages
- `/api/tours/[tourId]` - Dynamic tour API
- `/api/bookings/[bookingId]` - Dynamic booking API
- `/api/admin/tours/[id]` - Dynamic admin tour API
- `/api/auth/[...nextauth]` - NextAuth dynamic routes

### **Static Routes**
- All other pages are statically generated where possible
- SEO routes (robots.txt, sitemap.xml) are static

### **API Methods**
- **GET**: Data retrieval
- **POST**: Data creation
- **PUT**: Data updates
- **DELETE**: Data deletion
- **ALL**: NextAuth authentication

---

## 📝 **Route Status**

### **Implemented Features**
- ✅ Complete CRUD operations for tours
- ✅ User authentication and authorization
- ✅ Booking system with payment integration
- ✅ Admin dashboard and management
- ✅ Image upload functionality
- ✅ Availability calendar system
- ✅ Review system
- ✅ Analytics and reporting

### **Route Health**
- ✅ All routes properly structured
- ✅ Proper error handling implemented
- ✅ Authentication middleware in place
- ✅ Rate limiting on sensitive routes
- ✅ CORS configuration for APIs

---

**Last Updated**: January 15, 2026  
**Status**: ✅ **ROUTES COMPLETE**
