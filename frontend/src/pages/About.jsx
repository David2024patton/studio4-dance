import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Award, Users, Star, Music, Sparkles, Target, Lightbulb, ChevronRight } from 'lucide-react'

const About = () => {
  const instructors = [
    {
      name: 'Ms. Sarah Johnson',
      role: 'Artistic Director & Ballet Instructor',
      bio: 'With over 20 years of professional dance experience, Ms. Sarah brings world-class ballet training to Studio4. She trained at the Royal Academy of Dance and has performed with companies across Europe.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      specialties: ['Ballet', 'Pointe', 'Contemporary']
    },
    {
      name: 'Mr. Marcus Williams',
      role: 'Jazz & Hip Hop Instructor',
      bio: 'Marcus is a dynamic performer and choreographer who has worked with major artists and toured nationally. His energy and passion make every class an exciting experience.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      specialties: ['Jazz', 'Hip Hop', 'Choreography']
    },
    {
      name: 'Ms. Ashley Chen',
      role: 'Contemporary & Lyrical Instructor',
      bio: 'A former competitive dancer with numerous national titles, Ashley specializes in expressive contemporary and lyrical dance. She loves helping students find their emotional connection to movement.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      specialties: ['Contemporary', 'Lyrical', 'Competition']
    },
    {
      name: 'Ms. Kim Taylor',
      role: 'Tap & Acro Instructor',
      bio: 'Kim\'s background in both tap dance and acrobatics makes her uniquely qualified to teach our acro and tumbling classes. Her focus on safety and technique ensures students progress confidently.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      specialties: ['Tap', 'Acro', 'Tumbling']
    },
    {
      name: 'Mr. Jay Rodriguez',
      role: 'Hip Hop Instructor',
      bio: 'Jay brings authentic street dance culture to Studio4. His classes are high-energy and focus on building confidence, rhythm, and style in dancers of all ages.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      specialties: ['Hip Hop', 'Street Dance', 'Breakdance']
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We believe dance should be a joyful experience. Our instructors are passionate about sharing their love of dance with every student.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our world-class instruction to our state-of-the-art facilities.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Studio4 is more than a dance studio – it\'s a family. We foster a supportive environment where everyone belongs.'
    },
    {
      icon: Lightbulb,
      title: 'Growth',
      description: 'We believe every dancer has unlimited potential. Our goal is to help each student discover and develop their unique talents.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Students' },
    { number: '15+', label: 'Years of Excellence' },
    { number: '50+', label: 'Award Winners' },
    { number: '20+', label: 'Expert Instructors' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Studio4</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Since 2009, Studio4 Dance Company has been inspiring dancers of all ages to discover their passion, develop their skills, and shine on stage and in life.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Studio4 Dance Company was founded in 2009 with a simple dream: to create a place where dancers of all ages and abilities could discover the joy of dance in a nurturing, professional environment.
                </p>
                <p>
                  What started as a small studio with a handful of students has grown into one of the region's premier dance education centers. Today, we're proud to serve over 500 students in our state-of-the-art facility.
                </p>
                <p>
                  Our founders, both professional dancers themselves, believed that dance education should go beyond technique. At Studio4, we focus on building confidence, creativity, and character in every student who walks through our doors.
                </p>
                <p>
                  From recreational classes to our award-winning competition team, we offer programs that meet dancers where they are and help them achieve their dreams.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800"
                  alt="Studio4 Dance Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-primary-500" />
                  <span className="font-semibold text-gray-900">Est. 2009</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at Studio4, from how we teach to how we treat each other.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">Meet Our Instructors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of expert instructors brings decades of professional experience and a passion for teaching.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                  <p className="text-primary-600 font-medium text-sm mb-3">{instructor.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{instructor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">Our Facility</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our 10,000+ square foot facility was designed with dancers in mind. Every detail has been carefully planned to provide the best possible learning environment.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>3 spacious studios with professional sprung floors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Floor-to-ceiling mirrors and premium sound systems</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Comfortable waiting area with free WiFi for parents</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Private changing rooms and secure storage</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>On-site dancewear boutique</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400"
                alt="Studio Space"
                className="rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400"
                alt="Dance Class"
                className="rounded-2xl shadow-lg mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400"
                alt="Performance"
                className="rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400"
                alt="Students"
                className="rounded-2xl shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold font-display mb-4">Ready to Join Our Family?</h2>
            <p className="text-xl text-white/90 mb-8">
              Schedule a free trial class and discover why hundreds of families choose Studio4.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/classes"
                className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
              >
                View Our Classes
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
