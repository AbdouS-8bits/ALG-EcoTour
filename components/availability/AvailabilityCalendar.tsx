'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Check } from 'lucide-react';

interface TourAvailability {
  id: number;
  tourId: number;
  date: string;
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
  createdAt: string;
  updatedAt: string;
}

interface AvailabilityCalendarProps {
  tourId: number;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  maxMonthsToShow?: number;
}

export default function AvailabilityCalendar({ 
  tourId, 
  onDateSelect, 
  selectedDate,
  maxMonthsToShow = 3 
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<TourAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get availability for current month and next few months
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + maxMonthsToShow, 0);
      
      const response = await fetch(`/api/availability?tourId=${tourId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load availability calendar');
    } finally {
      setLoading(false);
    }
  };

  // Fetch availability data
  useEffect(() => {
    fetchAvailability();
  }, [tourId, currentMonth, maxMonthsToShow]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const availabilityRecord = availability.find(a => 
      a.date === dateStr
    );
    
    if (!availabilityRecord) {
      // If no availability record exists, assume available
      return true;
    }
    
    return availabilityRecord.isAvailable && 
           availabilityRecord.currentBookings < availabilityRecord.maxBookings;
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const availabilityRecord = availability.find(a => 
      a.date === dateStr
    );
    
    if (!availabilityRecord) {
      return false;
    }
    
    return !availabilityRecord.isAvailable || 
           availabilityRecord.currentBookings >= availabilityRecord.maxBookings;
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date) && !isDatePast(date)) {
      onDateSelect?.(date);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = getFirstDayOfMonth(monthDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const isAvailable = isDateAvailable(date);
      const isUnavailable = isDateUnavailable(date);
      const isPast = isDatePast(date);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === monthDate.getMonth() &&
        selectedDate.getFullYear() === monthDate.getFullYear();

      let className = 'h-10 rounded-lg border flex items-center justify-center text-sm cursor-pointer transition-colors relative ';
      
      if (isPast) {
        className += 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed ';
      } else if (isSelected) {
        className += 'bg-blue-500 text-white border-blue-500 ';
      } else if (isUnavailable) {
        className += 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 ';
      } else if (isAvailable) {
        className += 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 ';
      } else {
        className += 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 ';
      }

      // Get availability info for tooltip
      const availabilityInfo = availability.find(a => 
        a.date === date.toISOString().split('T')[0]
      );

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDateClick(date)}
          title={availabilityInfo ? 
            `${availabilityInfo.currentBookings}/${availabilityInfo.maxBookings} bookings` : 
            'Available'
          }
        >
          {day}
          {isUnavailable && (
            <X className="absolute top-1 right-1 w-3 h-3 text-red-500" />
          )}
          {isAvailable && !isPast && (
            <Check className="absolute top-1 right-1 w-3 h-3 text-green-500" />
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded text-center text-sm"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Availability Calendar</h3>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Past dates</span>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={loading}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h4 className="text-lg font-medium text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={loading}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {Array.from({ length: maxMonthsToShow }, (_, monthIndex) => {
          const monthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthIndex, 1);
          
          return (
            <div key={monthIndex}>
              {monthIndex > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h5 className="text-md font-medium text-gray-700 mb-2">
                    {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
                  </h5>
                </div>
              )}
              
              <div className="grid grid-cols-7 gap-2">
                {/* Week day headers */}
                {weekDays.map((day, i) => (
                  <div key={i} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {renderCalendar(monthDate)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Selected Date</p>
              <p className="text-lg font-semibold text-blue-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => onDateSelect?.(new Date())}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
