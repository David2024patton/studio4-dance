import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl font-display">S4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Studio4 Dance Co.</h3>
                <p className="text-xs text-gray-400">Where Dreams Take Flight</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering dancers to reach their full potential through expert instruction, creativity, and passion for the art of dance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/classes" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Our Classes</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Events & Competitions</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Photo Gallery</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Blog & News</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-display">Programs</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-300 text-sm">Ballet & Pointe</span></li>
              <li><span className="text-gray-300 text-sm">Jazz & Contemporary</span></li>
              <li><span className="text-gray-300 text-sm">Tap & Hip Hop</span></li>
              <li><span className="text-gray-300 text-sm">Acro & Tumbling</span></li>
              <li><span className="text-gray-300 text-sm">Solo & Duet Programs</span></li>
              <li><span className="text-gray-300 text-sm">Competition Team</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-display">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Dance Street<br />
                  Suite 100<br />
                  Your City, ST 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-300 text-sm hover:text-primary-400 transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@studio4danceco.com" className="text-gray-300 text-sm hover:text-primary-400 transition-colors">
                  info@studio4danceco.com
                </a>
              </div>
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">Hours of Operation</h5>
              <div className="text-gray-300 text-xs space-y-1">
                <p>Monday - Friday: 4:00 PM - 9:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm flex items-center">
              © {currentYear} Studio4 Dance Company. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-primary-500 fill-current" />
              <span>for dancers everywhere</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
