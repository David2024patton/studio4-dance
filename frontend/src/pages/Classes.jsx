import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { Filter, Clock, Users, Calendar, ChevronDown, X, Search, ArrowRight } from 'lucide-react'

const Classes = () => {
  const [classes, setClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const danceStyles = ['all', 'Ballet', 'Jazz', 'Contemporary', 'Hip Hop', 'Tap', 'Acro', 'Lyrical', 'Pointe']
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels']

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    filterClasses()
  }, [activeFilter, levelFilter, searchQuery, classes])

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes')
      setClasses(response.data)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      // Mock data for demo
      setClasses([
        { id: 1, name: 'Ballet Level 1', style: 'Ballet', level: 'Beginner', age_range: '6-8 years', day: 'Monday', time: '4:00 PM - 5:00 PM', instructor: 'Ms. Sarah', studio: 'Studio A', description: 'Introduction to ballet basics including positions, technique, and musicality.', price: 65, spots: 8 },
        { id: 2, name: 'Ballet Level 2', style: 'Ballet', level: 'Intermediate', age_range: '9-12 years', day: 'Monday', time: '5:00 PM - 6:30 PM', instructor: 'Ms. Sarah', studio: 'Studio A', description: 'Progressing ballet technique with emphasis on strength and grace.', price: 75, spots: 5 },
        { id: 3, name: 'Pointe', style: 'Pointe', level: 'Advanced', age_range: '12+ years', day: 'Tuesday', time: '6:00 PM - 7:30 PM', instructor: 'Ms. Sarah', studio: 'Studio A', description: 'Pointe work for advanced ballet dancers.', price: 85, spots: 4 },
        { id: 4, name: 'Jazz Beginner', style: 'Jazz', level: 'Beginner', age_range: '7-10 years', day: 'Wednesday', time: '5:00 PM - 6:00 PM', instructor: 'Mr. Marcus', studio: 'Studio B', description: 'Learn the fundamentals of jazz dance in this energetic class.', price: 65, spots: 12 },
        { id: 5, name: 'Jazz Intermediate', style: 'Jazz', level: 'Intermediate', age_range: '11-14 years', day: 'Wednesday', time: '6:00 PM - 7:30 PM', instructor: 'Mr. Marcus', studio: 'Studio B', description: 'Elevate your jazz technique with more complex combinations.', price: 75, spots: 7 },
        { id: 6, name: 'Contemporary', style: 'Contemporary', level: 'Intermediate', age_range: '12+ years', day: 'Thursday', time: '5:00 PM - 6:30 PM', instructor: 'Ms. Ashley', studio: 'Studio A', description: 'Expressive movement combining ballet and modern dance elements.', price: 75, spots: 10 },
        { id: 7, name: 'Hip Hop Kids', style: 'Hip Hop', level: 'Beginner', age_range: '5-8 years', day: 'Saturday', time: '10:00 AM - 11:00 AM', instructor: 'Mr. Jay', studio: 'Studio B', description: 'Fun, high-energy class introducing hip hop fundamentals.', price: 60, spots: 15 },
        { id: 8, name: 'Hip Hop Advanced', style: 'Hip Hop', level: 'Advanced', age_range: '12+ years', day: 'Friday', time: '6:00 PM - 7:30 PM', instructor: 'Mr. Jay', studio: 'Studio B', description: 'Advanced hip hop choreography and freestyle techniques.', price: 80, spots: 8 },
        { id: 9, name: 'Tap Beginner', style: 'Tap', level: 'Beginner', age_range: '7-10 years', day: 'Tuesday', time: '4:00 PM - 5:00 PM', instructor: 'Ms. Kim', studio: 'Studio A', description: 'Learn basic tap steps, rhythms, and combinations.', price: 65, spots: 10 },
        { id: 10, name: 'Acro', style: 'Acro', level: 'All Levels', age_range: '6+ years', day: 'Thursday', time: '4:00 PM - 5:00 PM', instructor: 'Ms. Taylor', studio: 'Studio B', description: 'Acrobatic skills for dancers including flexibility and strength training.', price: 70, spots: 12 },
        { id: 11, name: 'Lyrical', style: 'Lyrical', level: 'Intermediate', age_range: '10+ years', day: 'Friday', time: '4:30 PM - 5:30 PM', instructor: 'Ms. Ashley', studio: 'Studio A', description: 'Emotional storytelling through dance, blending ballet and jazz.', price: 70, spots: 8 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterClasses = () => {
    let result = [...classes]

    if (activeFilter !== 'all') {
      result = result.filter(c => c.style === activeFilter)
    }

    if (levelFilter !== 'all') {
      result = result.filter(c => c.level === levelFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.instructor.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      )
    }

    setFilteredClasses(result)
  }

  const clearFilters = () => {
    setActiveFilter('all')
    setLevelFilter('all')
    setSearchQuery('')
  }

  const levelColors = {
    'Beginner': 'bg-green-100 text-green-700',
    'Intermediate': 'bg-blue-100 text-blue-700',
    'Advanced': 'bg-purple-100 text-purple-700',
    'All Levels': 'bg-gray-100 text-gray-700'
  }

  const styleColors = {
    'Ballet': 'bg-pink-100 text-pink-700',
    'Jazz': 'bg-yellow-100 text-yellow-700',
    'Contemporary': 'bg-indigo-100 text-indigo-700',
    'Hip Hop': 'bg-red-100 text-red-700',
    'Tap': 'bg-orange-100 text-orange-700',
    'Acro': 'bg-cyan-100 text-cyan-700',
    'Lyrical': 'bg-violet-100 text-violet-700',
    'Pointe': 'bg-pink-100 text-pink-700'
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading classes..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Our Dance Classes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect class for your dancer. We offer a variety of styles and levels for all ages.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Style Filter */}
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {danceStyles.map(style => (
                  <option key={style} value={style}>
                    {style === 'all' ? 'All Styles' : style}
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(activeFilter !== 'all' || levelFilter !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredClasses.length}</span> class{filteredClasses.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((danceClass) => (
            <div
              key={danceClass.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${styleColors[danceClass.style] || 'bg-gray-100 text-gray-700'}`}>
                    {danceClass.style}
                  </span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${levelColors[danceClass.level] || 'bg-gray-100 text-gray-700'}`}>
                    {danceClass.level}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{danceClass.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{danceClass.description}</p>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    {danceClass.day} • {danceClass.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-primary-500" />
                    {danceClass.age_range}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2 text-primary-500 text-center text-xs">👤</span>
                    {danceClass.instructor}
                  </div>
                </div>

                {/* Price & Enrollment */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${danceClass.price}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-medium">{danceClass.spots} spots left</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2">
                  <span>Enroll Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🩰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:opacity-90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Schedule Overview */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Weekly Schedule Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <div key={day} className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-center">{day}</h3>
                <div className="space-y-2">
                  {classes.filter(c => c.day === day).map(c => (
                    <div key={c.id} className="bg-white rounded-lg p-2 text-xs">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-gray-500">{c.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Classes
