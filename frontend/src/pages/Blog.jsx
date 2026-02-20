import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { Calendar, Clock, User, ArrowRight, Tag, Search, ChevronRight } from 'lucide-react'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['all', 'News', 'Tips', 'Events', 'Student Spotlight', 'Behind the Scenes']

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/blog')
      setPosts(response.data)
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      // Mock data
      setPosts([
        {
          id: 1,
          title: 'Spring Showcase 2024: A Night to Remember',
          excerpt: 'Our annual spring showcase was an incredible success! Over 200 dancers performed across two sold-out shows, showcasing their talent and hard work.',
          content: 'Full content here...',
          author: 'Studio4 Team',
          date: '2024-04-22',
          read_time: '5 min read',
          category: 'Events',
          image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800',
          tags: ['showcase', 'performance', 'spring']
        },
        {
          id: 2,
          title: '5 Tips for Improving Your Ballet Technique',
          excerpt: 'Whether you\'re a beginner or advanced dancer, these tips from our instructors will help you take your ballet technique to the next level.',
          content: 'Full content here...',
          author: 'Ms. Sarah',
          date: '2024-04-15',
          read_time: '7 min read',
          category: 'Tips',
          image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800',
          tags: ['ballet', 'technique', 'tips']
        },
        {
          id: 3,
          title: 'Meet Our Competition Team Captains',
          excerpt: 'Get to know the amazing dancers who lead our competition teams and inspire our younger students every day.',
          content: 'Full content here...',
          author: 'Studio4 Team',
          date: '2024-04-08',
          read_time: '4 min read',
          category: 'Student Spotlight',
          image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800',
          tags: ['competition', 'students', 'spotlight']
        },
        {
          id: 4,
          title: 'Regional Competition Results: Gold Across the Board!',
          excerpt: 'Our competition team brought home multiple gold trophies at the Regional Dance Competition. We couldn\'t be prouder!',
          content: 'Full content here...',
          author: 'Studio4 Team',
          date: '2024-03-18',
          read_time: '3 min read',
          category: 'News',
          image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
          tags: ['competition', 'awards', 'news']
        },
        {
          id: 5,
          title: 'The Importance of Stretching for Dancers',
          excerpt: 'Flexibility is key to preventing injuries and improving your dance performance. Learn our top stretching routines.',
          content: 'Full content here...',
          author: 'Ms. Taylor',
          date: '2024-03-10',
          read_time: '6 min read',
          category: 'Tips',
          image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
          tags: ['stretching', 'flexibility', 'health']
        },
        {
          id: 6,
          title: 'Behind the Scenes: Costume Design Process',
          excerpt: 'Ever wonder how our beautiful costumes come to life? Take a peek behind the curtain at our costume design process.',
          content: 'Full content here...',
          author: 'Studio4 Team',
          date: '2024-03-01',
          read_time: '5 min read',
          category: 'Behind the Scenes',
          image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
          tags: ['costumes', 'behind the scenes']
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = filteredPosts[0]
  const recentPosts = filteredPosts.slice(1)

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading blog posts..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Studio4 Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, events, and stories from our dance community.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Posts' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Link to={`/blog/${featuredPost.id}`} className="group block">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                <div className="md:flex">
                  <div className="md:w-1/2 aspect-[16/10] md:aspect-auto">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {featuredPost.category}
                      </span>
                      <span className="text-sm text-gray-500">Featured</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {featuredPost.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {featuredPost.read_time}
                        </span>
                      </div>
                      <span className="text-primary-600 font-medium flex items-center group-hover:translate-x-2 transition-transform">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.read_time}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2 font-display">Subscribe to Our Newsletter</h3>
          <p className="text-white/90 mb-6">Get the latest news, tips, and updates delivered straight to your inbox!</p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Popular Tags */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['ballet', 'competition', 'tips', 'showcase', 'performance', 'technique', 'students', 'events'].map(tag => (
              <button
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
