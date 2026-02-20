import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Music, Heart, Award, Sparkles, Play } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Music,
      title: 'Expert Instruction',
      description: 'Learn from world-class instructors with years of professional experience'
    },
    {
      icon: Heart,
      title: 'Nurturing Environment',
      description: 'A supportive community where every dancer can thrive and grow'
    },
    {
      icon: Award,
      title: 'Award-Winning',
      description: 'Multiple championship titles and recognition in regional competitions'
    },
    {
      icon: Sparkles,
      title: 'State-of-the-Art Studios',
      description: 'Professional dance floors, mirrors, and equipment for optimal training'
    }
  ]

  const classes = [
    { name: 'Ballet', level: 'All Ages', image: '🩰' },
    { name: 'Jazz', level: 'Beginner-Advanced', image: '💃' },
    { name: 'Contemporary', level: 'Intermediate-Advanced', image: '🎭' },
    { name: 'Hip Hop', level: 'All Levels', image: '🎤' },
    { name: 'Tap', level: 'Beginner-Intermediate', image: '👟' },
    { name: 'Acro', level: 'All Ages', image: '🤸' }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Parent',
      content: 'Studio4 has been incredible for my daughter. The instructors are patient, skilled, and truly care about each student\'s progress.',
      rating: 5
    },
    {
      name: 'Emily R.',
      role: 'Student',
      content: 'I\'ve grown so much as a dancer here. The training is top-notch and the supportive environment has given me confidence I never knew I had.',
      rating: 5
    },
    {
      name: 'Michael T.',
      role: 'Parent',
      content: 'The parent portal makes tracking my kids\' classes and payments so easy. Best decision we made enrolling them at Studio4!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-md">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">Where Dreams Take Flight</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-gray-900">
              <span className="block">Discover Your</span>
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Rhythm & Passion
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
              Join Studio4 Dance Company and experience world-class dance instruction in a nurturing, supportive environment. From your first step to your final bow, we're here to help you shine.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/classes"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Explore Classes</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-all duration-300"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Why Choose Studio4?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best dance education while fostering creativity, confidence, and community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Preview Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Our Dance Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From ballet to hip hop, we offer a wide range of dance styles for all ages and skill levels.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {classes.map((danceClass, index) => (
              <Link
                key={index}
                to="/classes"
                className="group bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {danceClass.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{danceClass.name}</h3>
                <p className="text-sm text-gray-500">{danceClass.level}</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/classes"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <span>View All Classes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from parents and students who have experienced the Studio4 difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-display text-white mb-6">
            Ready to Start Your Dance Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join Studio4 Dance Company today and discover the joy of dance. New students receive their first class free!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Dancing Today</span>
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
