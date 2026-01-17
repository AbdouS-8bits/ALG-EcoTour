# Admin Guide - Tour & Booking Management

**Date**: January 14, 2026  
**Purpose**: Complete guide for admin authentication and management  
**System**: ALG-EcoTour Admin Panel  
**Status**: ✅ **FULLY IMPLEMENTED**

---

## 🔐 **Admin Authentication**

### **Admin Login**
1. **Navigate to**: `http://localhost:3000/admin/login`
2. **Enter Credentials**: Use admin credentials configured in your system
3. **Authentication**: Server-side validation via NextAuth.js
4. **Access**: Upon successful login, redirected to admin dashboard

### **Session Management**
- **Auto-logout**: Session expires after inactivity
- **Manual Logout**: Available in admin dashboard header
- **Protected Routes**: All admin routes require authentication
- **API Protection**: Admin APIs enforce server-side authentication

---

## 📊 **Admin Dashboard Overview**

### **Navigation**
```
Admin Dashboard
├── Tours Management (/admin/tours)
├── Bookings Management (/admin/bookings) 
├── User Management (/admin/users)
└── Logout
```

### **Quick Stats**
- Total Tours count
- Active Bookings
- Pending Confirmations
- Revenue Overview

---

## 🏞️ **Tours Management (CRUD)**

### **✅ CREATE New Tour**

#### **Step 1: Navigate to Tours Management**
1. Login to admin panel
2. Click "Tours Management" or go to `/admin/tours`

#### **Step 2: Fill Tour Information**
```
Required Fields:
- Title: Tour name (e.g., "Sahara Desert Adventure")
- Description: Detailed tour description
- Location: Tour location
- Price: Price per person in DZD
- Max Participants: Maximum number of participants

Optional Fields:
- Image: Tour cover photo
- Coordinates: Latitude/Longitude (via map)
```

#### **Step 3: Set Location on Map**
1. Click "Select Location on Map"
2. MapPicker interface opens
3. **Option A - Click on Map**: Click directly on desired location
4. **Option B - Search**: Enter address in search bar
5. **Coordinates**: Auto-populate from selection
6. **Address**: Reverse-geocoded from coordinates
7. **Confirm**: Click "Use This Location"

#### **Step 4: Upload Image**
1. Click "Choose Image" or drag & drop
2. Select image file (JPG, PNG, WebP)
3. Image uploads to Cloudinary automatically
4. Preview appears after upload

#### **Step 5: Create Tour**
1. Review all information
2. Click "Create Tour"
3. Success message confirms creation
4. Tour appears in tours list

### **✅ READ/View Tours**
- **List View**: All tours with thumbnail, title, location, price
- **Search**: Filter tours by title or location
- **Status**: Active/Inactive status indicators
- **Actions**: Edit, Delete, View Details

### **✅ UPDATE/Edit Tour**
1. Click "Edit" on tour in list
2. Modify any fields (title, description, price, etc.)
3. Update location using MapPicker if needed
4. Change image by uploading new one
5. Click "Update Tour" to save changes

### **✅ DELETE Tour**
1. Click "Delete" on tour in list
2. Confirmation dialog appears
3. Click "Confirm Delete" to remove tour
4. Tour is permanently deleted from database
5. **Safety**: Cannot delete tours with existing bookings

---

## 📅 **Bookings Management**

### **✅ View All Bookings**
1. Navigate to "Bookings Management" or `/admin/bookings`
2. See all bookings with details:
   - Guest information
   - Tour details
   - Booking status
   - Creation date

### **✅ Booking Status Management**
**Status Types:**
- **Pending**: Awaiting confirmation
- **Confirmed**: Booking approved
- **Cancelled**: Booking cancelled

**Update Status:**
1. Click "View Details" on booking
2. Use status dropdown to change status
3. Add admin notes if needed
4. Click "Update Status"

### **✅ Booking Actions**
- **Confirm**: Approve pending booking
- **Cancel**: Cancel booking (with reason)
- **Contact**: View guest contact information
- **Notes**: Add internal admin notes

---

## 🗺️ **MapPicker Usage**

### **✅ Setting Tour Location**
1. In tour creation/edit form, click "Select Location"
2. Map interface opens with Algeria centered
3. **Option A - Click on Map**: Click directly on desired location
4. **Option B - Search**: Enter address in search bar
5. **Coordinates**: Auto-populate from selection
6. **Address**: Reverse-geocoded from coordinates
7. **Confirm**: Click "Use This Location"

### **Map Features**
- **Zoom**: Mouse wheel or zoom controls
- **Pan**: Click and drag to move map
- **Search**: Address search functionality
- **Markers**: Visual location indicators
- **Coordinates**: Precise lat/lng values

---

## 📸 **Image Upload**

### **✅ Supported Formats**
- **JPEG/JPG**: Standard photo format
- **PNG**: Transparent backgrounds supported
- **WebP**: Modern web format
- **Max Size**: 10MB per image

### **✅ Upload Process**
1. Click "Choose Image" button
2. Select file from computer
3. Image uploads to Cloudinary
4. Automatic optimization applied
5. Preview appears immediately
6. URL stored in database

### **✅ Image Guidelines**
- **Recommended Size**: 1200x800px
- **Aspect Ratio**: 3:2 or 16:9
- **File Size**: Under 5MB for optimal performance
- **Content**: High-quality tour photos

---

## 🛡️ **Security Features**

### **✅ Authentication Enforcement**
- **Server-side validation** on all admin routes
- **Session management** with automatic timeout
- **Role-based access** control
- **API protection** for admin endpoints

### **✅ Data Validation**
- **Input sanitization** on all forms
- **Zod schema validation** server-side
- **SQL injection prevention** via Prisma
- **File upload security** via Cloudinary

### **✅ Audit Trail**
- **Action logging** for all admin operations
- **User tracking** with timestamps
- **Change history** for tours and bookings
- **Error logging** for debugging

---

## 📱 **Mobile Responsiveness**

### **✅ Admin on Mobile**
- **Responsive design** works on all screen sizes
- **Touch-friendly** interface elements
- **Optimized forms** for mobile input
- **Map interaction** supports touch gestures

### **✅ Mobile Features**
- **Swipe gestures** for navigation
- **Touch map controls** for location selection
- **Mobile-optimized** image upload
- **Responsive tables** for booking management

---

## 🔧 **Troubleshooting**

### **✅ Common Issues**

#### **Login Problems**
- **Solution**: Check admin credentials, ensure NextAuth is configured
- **Check**: Database connection, session configuration

#### **Map Not Loading**
- **Solution**: Check internet connection, Leaflet library
- **Check**: API keys, browser console for errors

#### **Image Upload Fails**
- **Solution**: Check Cloudinary configuration, file size
- **Check**: Network connection, file format

#### **Booking Updates Not Saving**
- **Solution**: Check database connection, API endpoints
- **Check**: Server logs for error messages

### **✅ Error Messages**
- **Validation Errors**: Check required fields, data formats
- **Network Errors**: Check internet connection, API status
- **Permission Errors**: Ensure proper admin authentication

---

## 📋 **Admin Checklist**

### **✅ Daily Tasks**
- [ ] Review pending bookings
- [ ] Confirm new bookings
- [ ] Check tour availability
- [ ] Respond to customer inquiries

### **✅ Weekly Tasks**
- [ ] Update tour information as needed
- [ ] Add new tours to catalog
- [ ] Review booking analytics
- [ ] Update pricing if necessary

### **✅ Monthly Tasks**
- [ ] Review booking trends
- [ ] Update tour descriptions
- [ ] Add seasonal tours
- [ ] Check system performance

---

## 🚀 **Best Practices**

### **✅ Tour Management**
- **High-quality photos** for better conversion
- **Detailed descriptions** with accurate information
- **Competitive pricing** based on market research
- **Regular updates** to keep information current

### **✅ Booking Management**
- **Quick response** to booking requests
- **Clear communication** with customers
- **Status updates** sent promptly
- **Professional handling** of cancellations

### **✅ Security**
- **Strong passwords** for admin accounts
- **Regular session** timeouts
- **Secure file handling** for uploads
- **Data backup** procedures

---

## 📞 **Support**

### **✅ Getting Help**
- **Documentation**: Refer to this guide
- **Technical Support**: Contact development team
- **Training**: Request admin training session
- **Feedback**: Provide suggestions for improvements

### **✅ Contact Information**
- **Admin Email**: admin@algecotour.dz
- **Technical Support**: support@algecotour.dz
- **Emergency**: Use system contact form

---

## 🎯 **Implementation Status**

### **✅ COMPLETED FEATURES**

#### **Authentication & Security**
- [x] Admin login with NextAuth.js
- [x] Server-side authentication enforcement
- [x] Session management
- [x] Role-based access control

#### **Tours CRUD**
- [x] Create tours with validation
- [x] Read/list all tours
- [x] Update existing tours
- [x] Delete tours (safety checks)
- [x] Image upload integration
- [x] MapPicker for location selection

#### **Bookings Management**
- [x] View all bookings
- [x] Update booking status
- [x] Add admin notes
- [x] Filter and search bookings
- [x] Tour details integration

#### **User Interface**
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Success feedback
- [x] Mobile optimization

#### **API Endpoints**
- [x] POST /api/admin/tours (create)
- [x] GET /api/admin/tours (list)
- [x] PUT /api/admin/tours/[id] (update)
- [x] DELETE /api/admin/tours/[id] (delete)
- [x] GET /api/bookings (list)
- [x] PUT /api/bookings/[id] (status update)

---

**Last Updated**: January 14, 2026  
**Version**: 1.0  
**System**: ALG-EcoTour Admin Panel  
**Status**: ✅ **FULLY FUNCTIONAL**

This guide covers all essential admin functions for managing tours and bookings in the ALG-EcoTour system. All features are implemented and tested. Follow the steps outlined above for efficient admin operations.
