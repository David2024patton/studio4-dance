import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  DollarSign, TrendingUp, TrendingDown, Users, Calendar, Clock, 
  ArrowRight, CreditCard, Bell, ChevronRight, Music, Award, 
  Plus, Minus, ArrowUpRight, Download, ExternalLink
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Set mock data for demo
      setDashboardData({
        balance: {
          total: 250.00,
          owed: 150.00,
          credit: 100.00
        },
        students: [
          { id: 1, first_name: 'Emma', last_name: 'Doe', age: 10, enrollments: [
            { class_name: 'Ballet Level 2', style: 'Ballet', schedule: 'Mon 4:00 PM' },
            { class_name: 'Jazz Beginner', style: 'Jazz', schedule: 'Wed 5:00 PM' }
          ]},
          { id: 2, first_name: 'Jake', last_name: 'Doe', age: 7, enrollments: [
            { class_name: 'Hip Hop Kids', style: 'Hip Hop', schedule: 'Sat 10:00 AM' }
          ]}
        ],
        upcoming_events: [
          { id: 1, title: 'Regional Competition', date: '2024-03-15', location: 'Downtown Theater', type: 'competition' },
          { id: 2, title: 'Spring Showcase', date: '2024-04-20', location: 'Main Studio', type: 'performance' },
          { id: 3, title: 'Dress Rehearsal', date: '2024-04-18', location: 'Main Studio', type: 'rehearsal' }
        ],
        recent_transactions: [
          { id: 1, date: '2024-02-18', description: 'Monthly Tuition - February', amount: -150.00, type: 'charge' },
          { id: 2, date: '2024-02-15', description: 'Payment Received', amount: 200.00, type: 'payment' },
          { id: 3, date: '2024-02-01', description: 'Competition Fee - Regional', amount: -75.00, type: 'charge' },
          { id: 4, date: '2024-01-28', description: 'Costume Deposit', amount: -50.00, type: 'charge' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />
  }

  const data = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Welcome back, {user?.first_name || 'Parent'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's an overview of your account and your dancers' activities.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Account Balance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                data.balance.total >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {data.balance.total >= 0 ? 'Credit' : 'Due'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              ${Math.abs(data.balance.total).toFixed(2)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Account Balance</p>
          </div>

          {/* Amount Owed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${data.balance.owed.toFixed(2)}</h3>
            <p className="text-sm text-gray-500 mt-1">Amount Owed</p>
          </div>

          {/* Credit */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${data.balance.credit.toFixed(2)}</h3>
            <p className="text-sm text-gray-500 mt-1">Account Credit</p>
          </div>

          {/* Active Students */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data.students.length}</h3>
            <p className="text-sm text-gray-500 mt-1">Active Students</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Students & Enrollments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Students Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Your Dancers</h2>
                  <Link to="/classes" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    Browse Classes <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {data.students.map((student) => (
                    <div key={student.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{student.first_name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.first_name} {student.last_name}</h3>
                            <p className="text-sm text-gray-500">Age {student.age}</p>
                          </div>
                        </div>
                        <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                          {student.enrollments.length} class{student.enrollments.length !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {student.enrollments.map((enrollment, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <Music className="w-5 h-5 text-primary-500" />
                              <div>
                                <p className="font-medium text-gray-900">{enrollment.class_name}</p>
                                <p className="text-sm text-gray-500">{enrollment.schedule}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {enrollment.style}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data.recent_transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'payment' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {transaction.type === 'payment' ? (
                            <Plus className="w-5 h-5 text-green-600" />
                          ) : (
                            <Minus className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Events & Quick Actions */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                  <Link to="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    See All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data.upcoming_events.map((event) => (
                    <div key={event.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0">
                          <span className="text-xs font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.location}
                          </p>
                          <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full ${
                            event.type === 'competition' ? 'bg-purple-100 text-purple-700' :
                            event.type === 'performance' ? 'bg-primary-100 text-primary-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    to="/classes"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl hover:from-primary-100 hover:to-secondary-100 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Enroll in Class</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Make Payment</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <Link
                    to="/events"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">View Schedule</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>

                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Download Statement</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="w-6 h-6" />
                <h3 className="font-semibold">Reminders</h3>
              </div>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Competition registration due Feb 28</li>
                <li>• Costume payment due Mar 1</li>
                <li>• Spring showcase tickets on sale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
