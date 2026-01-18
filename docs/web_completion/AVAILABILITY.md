# Tour Availability Calendar Implementation

**Date**: January 15, 2026  
**Purpose**: Documentation for tour availability calendar system  
**System**: ALG-EcoTour Web Application  
**Status**: ✅ **IMPLEMENTED**

---

## 📋 **Overview**

This document explains the tour availability calendar system that allows users to check available dates for tours, preventing booking on unavailable dates. The system provides a visual calendar interface with clear availability indicators and integrates seamlessly with the booking process.

---

## 🎯 **Features Implemented**

### **✅ Store available dates or booked dates**
- **Database Model**: TourAvailability model with date, availability status, and booking counts
- **Flexible Storage**: Store available/unavailable dates with maximum booking limits
- **Booking Tracking**: Track current bookings against maximum capacity
- **Date Range Support**: Support for managing availability across multiple months
- **Automatic Updates**: Increment/decrement booking counts as bookings are made

### **✅ Show calendar UI component in tour detail**
- **Interactive Calendar**: Visual calendar with month navigation
- **Availability Indicators**: Color-coded dates showing available/unavailable status
- **Multi-Month View**: Display availability for multiple months simultaneously
- **Date Selection**: Interactive date selection with visual feedback
- **Responsive Design**: Mobile-friendly calendar interface
- **Loading States**: Smooth loading animations and error handling

### **✅ Prevent booking unavailable dates**
- **Date Validation**: Check availability before allowing booking
- **Visual Feedback**: Clear visual indicators for unavailable dates
- **Booking Integration**: Prevent booking flow for unavailable dates
- **Real-time Updates**: Availability updates in real-time
- **Past Date Protection**: Prevent selection of past dates
- **Capacity Limits**: Respect maximum booking limits per date

---

## 🏗️ **Architecture**

### **Database Schema**

**TourAvailability Model**:
```prisma
model TourAvailability {
  id          Int      @id @default(autoincrement())
  tourId      Int
  date        DateTime @db.Date
  isAvailable  Boolean  @default(true)
  maxBookings Int      @default(1)
  currentBookings Int  @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  tour        EcoTour   @relation(fields: [tourId], references: [id], onDelete: Cascade)

  @@unique([tourId, date])
  @@map("tour_availability")
}
```

**Enhanced EcoTour Model**:
```prisma
model EcoTour {
  // ... existing fields ...
  availability TourAvailability[]
}
```

### **Component Structure**

```
components/availability/
├── AvailabilityCalendar.tsx              # Main calendar component

app/api/availability/
├── route.ts                              # Availability CRUD operations
└── check/route.ts                         # Date availability checking

lib/
├── availability.ts                        # Availability helper functions

app/ecoTour/[tourId]/
├── TourDetailClient.tsx                  # Tour detail page with calendar
└── page.ts                             # Tour detail server component
```

### **Data Flow**

1. **Calendar Load**: Component fetches availability data from API
2. **Date Selection**: User selects available date from calendar
3. **Availability Check**: System validates date availability
4. **Booking Process**: Booking flow checks availability before proceeding
5. **Booking Update**: Booking count increments on successful booking
6. **Real-time Updates**: Calendar reflects current availability status

---

## 🔧 **Implementation Details**

### **Database Layer**

**TourAvailability Helper Functions**:
- **getTourAvailability**: Fetch availability for date range
- **createAvailability**: Create new availability record
- **updateAvailability**: Update existing availability
- **isDateAvailable**: Check if specific date is available
- **incrementBookings**: Increment booking count
- **decrementBookings**: Decrement booking count
- **generateAvailabilityForTour**: Bulk availability generation

**Data Types**:
```typescript
interface TourAvailability {
  id: number;
  tourId: number;
  date: Date;
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### **API Layer**

**GET /api/availability**:
- Fetch availability for tour with optional date range
- Support for pagination and filtering
- Error handling and validation

**GET /api/availability/check**:
- Check availability for specific date
- Increment/decrement booking counts
- Real-time availability validation

**POST /api/availability**:
- Create new availability records
- Update existing availability
- Input validation and error handling

### **Frontend Component**

**AvailabilityCalendar Component**:
- **Interactive Calendar**: Visual calendar with month navigation
- **Date Selection**: Click-to-select available dates
- **Visual Indicators**: Color-coded availability status
- **Multi-Month Support**: Display multiple months simultaneously
- **Responsive Design**: Mobile-friendly interface

**Key Features**:
```typescript
interface AvailabilityCalendarProps {
  tourId: number;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  maxMonthsToShow?: number;
}
```

---

## 🎨 **User Interface**

### **Calendar Design**

**Visual Elements**:
- **Month Navigation**: Previous/next month navigation buttons
- **Week Headers**: Day-of-week headers (Sun, Mon, Tue, etc.)
- **Date Cells**: Interactive date cells with status indicators
- **Legend**: Color-coded availability legend
- **Selected Date**: Highlighted selected date display

**Color Coding**:
- **Green**: Available dates with booking capacity
- **Red**: Unavailable dates (fully booked or marked unavailable)
- **Gray**: Past dates (cannot be selected)
- **Blue**: Currently selected date

**Interactive Features**:
- **Hover Effects**: Visual feedback on hover
- **Click Actions**: Date selection with validation
- **Loading States**: Skeleton loading during data fetch
- **Error Handling**: Graceful error display and retry options

### **User Experience**

**Calendar Navigation**:
- **Month Navigation**: Easy navigation between months
- **Date Range**: Display multiple months for planning
- **Quick Selection**: Click-to-select available dates
- **Clear Selection**: Clear selected date option

**Availability Information**:
- **Tooltips**: Hover tooltips showing booking capacity
- **Status Indicators**: Visual icons for availability status
- **Booking Count**: Current bookings vs. maximum capacity
- **Date Details**: Full date information for selected dates

---

## 📊 **API Implementation**

### **Availability Endpoints**

**GET /api/availability**
```typescript
// Query parameters
{
  tourId: number;           // Required
  startDate?: string;        // Optional: YYYY-MM-DD format
  endDate?: string;          // Optional: YYYY-MM-DD format
}

// Response
{
  id: number;
  tourId: number;
  date: string;            // YYYY-MM-DD format
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
  createdAt: string;
  updatedAt: string;
}[]
```

**GET /api/availability/check**
```typescript
// Query parameters
{
  tourId: number;           // Required
  date: string;             // Required: YYYY-MM-DD format
}

// Response
{
  available: boolean;
  date: string;
  tourId: number;
}
```

**POST /api/availability/check**
```typescript
// Request body
{
  tourId: number;
  date: string;
  action: 'increment' | 'decrement';
}

// Response
{
  id: number;
  tourId: number;
  date: string;
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔐 **Validation & Error Handling**

### **Input Validation**

**Date Validation**:
```typescript
const checkAvailabilitySchema = z.object({
  tourId: z.number().int().positive(),
  date: z.string().transform((val) => new Date(val)),
});

const createAvailabilitySchema = z.object({
  tourId: z.number().int().positive(),
  date: z.string().transform((val) => new Date(val)),
  isAvailable: z.boolean().optional(),
  maxBookings: z.number().int().positive().optional(),
});
```

**Error Handling**:
- **API Errors**: Proper HTTP status codes and error messages
- **Client Errors**: User-friendly error messages
- **Network Issues**: Retry mechanisms and fallbacks
- **Data Validation**: Comprehensive input validation

### **Business Logic**

**Availability Rules**:
- **Past Dates**: Cannot select past dates
- **Capacity Limits**: Respect maximum booking limits
- **Date Uniqueness**: One availability record per tour per date
- **Booking Increments**: Automatic booking count updates
- **Availability Status**: Manual and automatic availability management

---

## 🧪 **Integration Points**

### **Tour Detail Page Integration**

**Tab Navigation**:
```typescript
const [activeTab, setActiveTab] = useState<'details' | 'location' | 'reviews' | 'availability'>('details');
```

**Calendar Component**:
```typescript
{activeTab === 'availability' && (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Availability</h2>
    <AvailabilityCalendar 
      tourId={tour.id}
      onDateSelect={setSelectedDate}
      selectedDate={selectedDate}
      maxMonthsToShow={3}
    />
  </div>
)}
```

**Booking Integration**:
```typescript
const handleBookingSubmit = async () => {
  if (!selectedDate) {
    setError('Please select a date from the calendar');
    return;
  }
  
  // Check availability
  const isAvailable = await isDateAvailable(tour.id, selectedDate);
  if (!isAvailable) {
    setError('Selected date is not available');
    return;
  }
  
  // Proceed with booking
  await createBooking({ ... });
};
```

---

## 📈 **Performance Considerations**

### **Database Optimization**

**Indexing Strategy**:
```sql
-- Unique constraint for tour-date combinations
CREATE UNIQUE INDEX "tour_availability_tourId_date_key" ON "tour_availability"("tourId", "date");

-- Index for tour-specific queries
CREATE INDEX "tour_availability_tourId_idx" ON "tour_availability"("tourId");

-- Index for date range queries
CREATE INDEX "tour_availability_date_idx" ON "tour_availability"("date");
```

**Query Optimization**:
- **Date Range Filtering**: Efficient date range queries
- **Tour Filtering**: Tour-specific availability queries
- **Pagination**: Support for large date ranges
- **Caching**: Client-side caching for frequently accessed data

### **Frontend Performance**

**Component Optimization**:
- **Lazy Loading**: Load availability data on demand
- **Memoization**: Cache computed values
- **Debounced Updates**: Prevent excessive API calls
- **Virtual Scrolling**: For large date ranges (future enhancement)

**API Performance**:
- **Batch Operations**: Bulk availability operations
- **Connection Pooling**: Efficient database connections
- **Response Caching**: Cache frequently accessed availability
- **Error Recovery**: Graceful error handling

---

## 🧪 **Testing Strategy**

### **Unit Testing**

**Database Functions**:
```typescript
describe('Availability Functions', () => {
  it('should create availability record', async () => {
    const result = await createAvailability({
      tourId: 1,
      date: new Date('2025-01-15'),
      maxBookings: 10,
    });
    expect(result.tourId).toBe(1);
    expect(result.isAvailable).toBe(true);
  });

  it('should check date availability', async () => {
    const result = await isDateAvailable(1, new Date('2025-01-15'));
    expect(typeof result).toBe('boolean');
  });
});
```

### **Component Testing**

**Calendar Component**:
```typescript
describe('AvailabilityCalendar', () => {
  it('should render calendar with availability data', () => {
    const mockAvailability = [
      { id: 1, tourId: 1, date: '2025-01-15', isAvailable: true, maxBookings: 10, currentBookings: 0 },
      { id: 2, tourId: 1, date: '2025-01-16', isAvailable: false, maxBookings: 10, currentBookings: 10 },
    ];

    render(
      <AvailabilityCalendar 
        tourId={1} 
        availability={mockAvailability}
        onDateSelect={jest.fn()}
      />
    );
    // Test calendar rendering
  });
});
```

### **API Testing**

**Endpoint Testing**:
```typescript
describe('Availability API', () => {
  it('GET /api/availability should return availability data', async () => {
    const response = await fetch('/api/availability?tourId=1');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/availability/check should update booking count', async () => {
    const response = await fetch('/api/availability/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tourId: 1,
        date: '2025-01-15',
        action: 'increment'
      })
    });
    expect(response.status).toBe(200);
  });
});
```

---

## 🔮 **Future Enhancements**

### **Advanced Features**

**Calendar Enhancements**:
- **Week View**: Weekly calendar view option
- **Year View**: Annual calendar overview
- **Custom Views**: Custom date range selection
- **Export Options**: Export availability to calendar formats
- **Print Support**: Print-friendly calendar views

**Booking Integration**:
- **Real-time Updates**: WebSocket integration for live updates
- **Conflict Resolution**: Automatic conflict detection
- **Waitlist Management**: Waitlist for fully booked dates
- **Group Bookings**: Support for group bookings
- **Recurring Bookings**: Recurring tour schedules

**Admin Features**:
- **Bulk Operations**: Bulk availability management
- **Import/Export**: CSV import/export for availability
- **Analytics**: Availability analytics and reporting
- **Automation**: Automated availability generation
- **Notifications**: Low availability alerts

---

## 📝 **Code Examples**

### **Availability Calendar Component**

```typescript
export default function AvailabilityCalendar({ 
  tourId, 
  onDateSelect, 
  selectedDate,
  maxMonthsToShow = 3 
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<TourAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = async () => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + maxMonthsToShow, 0);
    
    const response = await fetch(`/api/availability?tourId=${tourId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    const data = await response.json();
    setAvailability(data);
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const availabilityRecord = availability.find(a => a.date === dateStr);
    
    if (!availabilityRecord) {
      return true;
    }
    
    return availabilityRecord.isAvailable && 
           availabilityRecord.currentBookings < availabilityRecord.maxBookings;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Calendar implementation */}
    </div>
  );
}
```

### **API Route Implementation**

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get('tourId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!tourId) {
    return NextResponse.json(
      { error: 'Tour ID is required' },
      { status: 400 }
    );
  }

  const validation = validateRequest(queryAvailabilitySchema, {
    tourId: parseInt(tourId),
    startDate,
    endDate,
  });

  if (!validation.success) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const availability = await getTourAvailability(
    validation.data.tourId, 
    validation.data.startDate, 
    validation.data.endDate
  );

  return NextResponse.json(availability);
}
```

### **Database Helper Functions**

```typescript
export async function isDateAvailable(tourId: number, date: Date): Promise<boolean> {
  try {
    const availability = await prisma.tourAvailability.findUnique({
      where: {
        tourId_date: {
          tourId,
          date,
        },
      },
    });

    if (!availability) {
      return true;
    }

    return availability.isAvailable && 
           availability.currentBookings < availability.maxBookings;
  } catch (error) {
    console.error('Error checking date availability:', error);
    return false;
  }
}

export async function incrementBookings(tourId: number, date: Date): Promise<TourAvailability> {
  try {
    const availability = await prisma.tourAvailability.update({
      where: {
        tourId_date: {
          tourId,
          date,
        },
      },
      data: {
        currentBookings: {
          increment: 1,
        },
      },
    });

    return availability;
  } catch (error) {
    console.error('Error incrementing bookings:', error);
    throw new Error('Failed to increment bookings');
  }
}
```

---

## 🚀 **Deployment Notes**

### **Environment Requirements**

**Database**:
- **PostgreSQL**: Required for TourAvailability model
- **Migration**: Database schema migration applied
- **Indexes**: Performance indexes created
- **Constraints**: Unique constraints enforced

**API Requirements**:
- **Next.js**: Framework for API routes
- **Prisma**: ORM for database operations
- **Validation**: Input validation with Zod schemas
- **Error Handling**: Proper error responses

### **Build Verification**

```bash
# Test build
npm run build

# Test availability API
curl -X GET http://localhost:3000/api/availability?tourId=1

# Test date checking
curl -X GET http://localhost:3000/api/availability/check?tourId=1&date=2025-01-15

# Test booking increment
curl -X POST http://localhost:3000/api/availability/check \
  -H "Content-Type: application/json" \
  -d '{"tourId": 1, "date": "2025-01-15", "action": "increment"}'
```

### **Performance Monitoring**

**API Performance**:
- **Response Times**: Monitor API response times
- **Database Queries**: Optimize database query performance
- **Error Rates**: Monitor API error rates
- **Cache Hit Rate**: Track caching effectiveness

**Frontend Performance**:
- **Load Times**: Monitor calendar load performance
- **User Interactions**: Track user interaction patterns
- **Error Recovery**: Monitor error handling effectiveness
- **Memory Usage**: Optimize component memory usage

---

**Last Updated**: January 15, 2026  
**Version**: 1.0  
**System**: ALG-EcoTour Tour Availability Calendar  
**Status**: ✅ **PRODUCTION READY**

The tour availability calendar system provides a comprehensive solution for managing tour availability with an intuitive calendar interface, preventing booking on unavailable dates, and integrating seamlessly with the existing booking system. The system includes robust validation, error handling, and performance optimization for production use.
