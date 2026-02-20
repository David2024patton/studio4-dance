import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Filter, Star, Award, Music, Users, ExternalLink } from 'lucide-react'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState('list')
  const [selectedType, setSelectedType] = useState('all')

  const eventTypes = ['all', 'competition', 'performance', 'workshop', 'rehearsal', 'audition']

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
      // Mock data
      setEvents([
        { id: 1, title: 'Regional Dance Competition', date: '2024-03-15', end_date: '2024-03-17', location: 'Downtown Performing Arts Center', address: '123 Main Street, Downtown', type: 'competition', description: 'Join us for the annual regional dance competition featuring studios from across the state. Our competition team will be performing their award-winning routines.', time: '9:00 AM - 6:00 PM', participants: 'Competition Team' },
        { id: 2, title: 'Spring Showcase 2024', date: '2024-04-20', end_date: '2024-04-21', location: 'Studio4 Main Stage', address: '123 Dance Street, Suite 100', type: 'performance', description: 'Our annual spring showcase featuring all our dancers from beginner to advanced. This is a celebration of everything they\'ve learned this year!', time: '2:00 PM & 6:00 PM', participants: 'All Students' },
        { id: 3, title: 'Dress Rehearsal - Spring Showcase', date: '2024-04-18', location: 'Studio4 Main Stage', address: '123 Dance Street, Suite 100', type: 'rehearsal', description: 'Mandatory dress rehearsal for all performers in the Spring Showcase. Full costumes required.', time: '4:00 PM - 8:00 PM', participants: 'All Performers' },
        { id: 4, title: 'Master Class with Guest Artist', date: '2024-03-02', location: 'Studio4 - Studio A', address: '123 Dance Street, Suite 100', type: 'workshop', description: 'Special master class with Broadway dancer and choreographer. Limited spots available for intermediate and advanced students.', time: '10:00 AM - 12:00 PM', participants: 'Ages 12+, Intermediate-Advanced' },
        { id: 5, title: 'Competition Team Auditions', date: '2024-05-15', location: 'Studio4 - Studio A & B', address: '123 Dance Street, Suite 100', type: 'audition', description: 'Auditions for the 2024-2025 competition team season. Prepare a 1-minute solo routine.', time: '10:00 AM - 4:00 PM', participants: 'Ages 7+' },
        { id: 6, title: 'Summer Intensive Workshop', date: '2024-06-10', end_date: '2024-06-14', location: 'Studio4 Dance Studios', address: '123 Dance Street, Suite 100', type: 'workshop', description: 'Week-long intensive workshop featuring guest instructors in ballet, jazz, contemporary, and hip hop. Perfect for dancers looking to level up!', time: '9:00 AM - 4:00 PM', participants: 'Ages 10+' },
        { id: 7, title: 'National Finals', date: '2024-07-20', end_date: '2024-07-25', location: 'Orlando Convention Center', address: 'Orlando, FL', type: 'competition', description: 'National dance competition finals for qualifying teams. Our team qualified with gold at regionals!', time: 'All Day', participants: 'Qualified Competition Team' },
        { id: 8, title: 'Parent Observation Week', date: '2024-03-11', end_date: '2024-03-15', location: 'Studio4 Dance Studios', address: '123 Dance Street, Suite 100', type: 'workshop', description: 'Parents are invited to observe classes all week. See what your dancers have been learning!', time: 'During Regular Class Times', participants: 'All Classes' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const typeConfig = {
    competition: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Award },
    performance: { color: 'bg-pink-100 text-pink-700 border-pink-200', icon: Star },
    workshop: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Music },
    rehearsal: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    audition: { color: 'bg-green-100 text-green-700 border-green-200', icon: Users }
  }

  const filteredEvents = selectedType === 'all' 
    ? events 
    : events.filter(e => e.type === selectedType)

  const getEventsByMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayEvents = filteredEvents.filter(e => e.date === dateStr)
      days.push({ day, events: dayEvents })
    }
    
    return days
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading events..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Events & Competitions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay up to date with all our upcoming performances, competitions, workshops, and special events.
          </p>
        </div>

        {/* View Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'calendar' 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Calendar
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((dayObj, index) => (
                <div
                  key={index}
                  className={`min-h-[80px] p-1 border border-gray-100 ${
                    dayObj ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {dayObj && (
                    <>
                      <span className="text-sm font-medium text-gray-900">{dayObj.day}</span>
                      <div className="mt-1 space-y-1">
                        {dayObj.events.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${typeConfig[event.type]?.color || 'bg-gray-100 text-gray-700'}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayObj.events.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayObj.events.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Try adjusting your filter</p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const config = typeConfig[event.type] || { color: 'bg-gray-100 text-gray-700', icon: Calendar }
                const IconComponent = config.icon
                
                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="md:flex">
                      {/* Date Badge */}
                      <div className="md:w-48 bg-gradient-to-br from-primary-500 to-secondary-500 p-6 text-white text-center flex items-center justify-center">
                        <div>
                          <div className="text-sm font-medium opacity-90">
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-4xl font-bold">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-sm font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                          {event.end_date && (
                            <div className="text-xs mt-2 opacity-75">
                              to {new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary-500" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-primary-500" />
                            {event.participants}
                          </div>
                        </div>

                        {event.address && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Get Directions
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Upcoming Highlights */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 font-display">Don't Miss Our Biggest Events!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Award className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Competition Season</h3>
              <p className="text-sm text-white/80">Regional & National competitions for our award-winning team</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Star className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Spring Showcase</h3>
              <p className="text-sm text-white/80">Annual performance featuring all our talented dancers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Music className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Summer Intensive</h3>
              <p className="text-sm text-white/80">Week-long workshop with guest instructors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events
