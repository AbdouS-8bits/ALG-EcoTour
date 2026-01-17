// Centralized selectors for E2E tests
export const Selectors = {
  // Navigation
  navbar: {
    container: 'nav, header[role="navigation"]',
    homeLink: 'a:has-text("Home"), a[href="/"]',
    toursLink: 'a:has-text("Tours"), a[href*="ecoTour"]',
    mapLink: 'a:has-text("Map"), a[href="/map"]',
    loginLink: 'a:has-text("Login"), a[href*="login"]',
    signupLink: 'a:has-text("Sign Up"), a[href*="signup"]',
    logoutButton: 'button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")',
  },

  // Authentication
  auth: {
    loginForm: 'form:has(input[type="email"])',
    signupForm: 'form:has(input[type="email"]):has(input[type="password"])',
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    nameInput: 'input[name="name"], input[placeholder*="name"], input[id*="name"]',
    submitButton: 'button[type="submit"], button:has-text("Login"), button:has-text("Sign Up"), button:has-text("Register")',
  },

  // Tours
  tours: {
    container: '[data-testid="tours-container"], .tours-container, main',
    tourCard: '[data-testid="tour-card"], .tour-card, article:has(a[href*="ecoTour/"])',
    tourLink: 'a[href*="/ecoTour/"]',
    firstTourCard: '[data-testid="tour-card"], .tour-card, article:has(a[href*="ecoTour/"])',
    firstTourLink: 'a[href*="/ecoTour/"]:first-child',
    title: 'h1, h2, [data-testid="tour-title"]',
    description: '[data-testid="tour-description"], .tour-description, p',
    price: '[data-testid="tour-price"], .tour-price, [data-price]',
    bookingButton: 'button:has-text("Book"), button:has-text("Book Now"), a:has-text("Book")',
  },

  // Map
  map: {
    container: '[data-testid="map"], #map, .map, .map-container',
    mapElement: '[data-testid="map-element"], .leaflet-container, canvas',
  },

  // Admin
  admin: {
    dashboard: {
      container: '[data-testid="admin-dashboard"], .admin-dashboard, main',
      statsCards: '[data-testid="stats-card"], .stats-card, .dashboard-card',
      charts: '[data-testid="chart"], .chart, canvas',
      analyticsCards: '[data-testid="analytics-card"], .analytics-card',
    },
    tours: {
      container: '[data-testid="admin-tours"], .admin-tours, main',
      createButton: 'button:has-text("Create"), button:has-text("Add Tour"), a:has-text("Create Tour")',
      form: 'form:has(input[name="title"])',
      titleInput: 'input[name="title"], input[placeholder*="title"], input[id*="title"]',
      descriptionInput: 'textarea[name="description"], textarea[placeholder*="description"], textarea[id*="description"]',
      locationInput: 'input[name="location"], input[placeholder*="location"], input[id*="location"]',
      priceInput: 'input[name="price"], input[type="number"], input[placeholder*="price"]',
      maxParticipantsInput: 'input[name="maxParticipants"], input[type="number"], input[placeholder*="participants"]',
      latitudeInput: 'input[name="latitude"], input[type="number"], input[placeholder*="latitude"]',
      longitudeInput: 'input[name="longitude"], input[type="number"], input[placeholder*="longitude"]',
      submitButton: 'button[type="submit"], button:has-text("Save"), button:has-text("Create")',
    },
    bookings: {
      container: '[data-testid="admin-bookings"], .admin-bookings, main',
      bookingList: '[data-testid="booking-list"], .booking-list, table',
      confirmButton: 'button:has-text("Confirm"), button:has-text("Approve")',
      cancelButton: 'button:has-text("Cancel"), button:has-text("Reject")',
    },
  },

  // User
  user: {
    bookings: {
      container: '[data-testid="user-bookings"], .user-bookings, main',
      bookingCard: '[data-testid="booking-card"], .booking-card, .card',
      emptyState: 'text="No bookings", text="No bookings found", .empty-state',
      cancelButton: 'button:has-text("Cancel"), button:has-text("Cancel Booking")',
    },
    profile: {
      container: '[data-testid="profile"], .profile, main',
      form: 'form:has(input[name="name"])',
      nameInput: 'input[name="name"], input[placeholder*="name"], input[id*="name"]',
      emailInput: 'input[type="email"], input[name="email"]',
      phoneInput: 'input[type="tel"], input[name="phone"], input[placeholder*="phone"]',
      saveButton: 'button[type="submit"], button:has-text("Save"), button:has-text("Update")',
    },
    settings: {
      container: '[data-testid="settings"], .settings, main',
      languageSelect: 'select[name="language"], [data-testid="language-select"]',
      emailNotificationsToggle: 'input[type="checkbox"][name*="email"], input[type="checkbox"][name*="notification"]',
      darkModeToggle: 'input[type="checkbox"][name*="dark"], input[type="checkbox"][name*="theme"]',
      saveButton: 'button[type="submit"], button:has-text("Save"), button:has-text("Update")',
    },
  },

  // Media
  media: {
    gallery: '[data-testid="gallery"], .gallery, .image-gallery',
    imageGallery: '[data-testid="image-gallery"], .ImageGallery, .tour-images',
    carousel: '[data-testid="carousel"], .carousel, .slider',
    tourImages: 'img[alt*="tour"], img[src*="tour"], .tour-image',
    uploadButton: 'button:has-text("Upload"), button:has-text("Add Image")',
    fileInput: 'input[type="file"]',
    dropZone: '[data-testid="drop-zone"], .drop-zone, .upload-area',
    uploadForm: 'form:has(input[type="file"])',
  },

  // Common
  common: {
    main: 'main, [role="main"]',
    heading: 'h1, h2, [data-testid="heading"]',
    body: 'body',
    error: '.error, .alert-error, [role="alert"]',
    success: '.success, .alert-success, [role="status"]',
    loading: '[data-testid="loading"], .loading, [aria-busy="true"]',
    button: 'button',
    input: 'input',
    form: 'form',
  },
};
