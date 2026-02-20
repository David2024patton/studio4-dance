import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { X, ChevronLeft, ChevronRight, Grid, Image, Camera, Heart, Share2, ZoomIn } from 'lucide-react'

const Gallery = () => {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [viewMode, setViewMode] = useState('albums')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await axios.get('/api/gallery')
      setAlbums(response.data)
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
      // Mock data
      setAlbums([
        {
          id: 1,
          title: 'Spring Showcase 2024',
          description: 'Our annual spring performance featuring dancers of all levels',
          cover: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800',
          date: '2024-04-20',
          photo_count: 45,
          photos: [
            { id: 1, url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200', caption: 'Opening number' },
            { id: 2, url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200', caption: 'Ballet performance' },
            { id: 3, url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200', caption: 'Jazz routine' },
            { id: 4, url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200', caption: 'Contemporary piece' },
            { id: 5, url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200', caption: 'Group finale' },
            { id: 6, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200', caption: 'Behind the scenes' }
          ]
        },
        {
          id: 2,
          title: 'Regional Competition 2024',
          description: 'Our competition team bringing home the gold!',
          cover: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800',
          date: '2024-03-15',
          photo_count: 32,
          photos: [
            { id: 7, url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200', caption: 'Awards ceremony' },
            { id: 8, url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200', caption: 'Solo performance' },
            { id: 9, url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200', caption: 'Team photo' },
            { id: 10, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200', caption: 'Warm-up' }
          ]
        },
        {
          id: 3,
          title: 'Classes in Action',
          description: 'Capturing the magic of our everyday dance classes',
          cover: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800',
          date: '2024-02-01',
          photo_count: 28,
          photos: [
            { id: 11, url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200', caption: 'Ballet class' },
            { id: 12, url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200', caption: 'Stretching' },
            { id: 13, url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200', caption: 'Hip hop class' }
          ]
        },
        {
          id: 4,
          title: 'Summer Intensive 2023',
          description: 'An amazing week of learning and growing together',
          cover: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
          date: '2023-06-15',
          photo_count: 56,
          photos: [
            { id: 14, url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200', caption: 'Guest instructor workshop' },
            { id: 15, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200', caption: 'Final showcase' }
          ]
        },
        {
          id: 5,
          title: 'Holiday Show 2023',
          description: 'Celebrating the season with dance and joy',
          cover: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
          date: '2023-12-15',
          photo_count: 38,
          photos: [
            { id: 16, url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200', caption: 'Holiday performance' },
            { id: 17, url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200', caption: 'Cast photo' }
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (photo) => {
    setLightboxImage(photo)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const navigateImage = (direction) => {
    const currentAlbum = selectedAlbum || albums.find(a => a.photos.some(p => p.id === lightboxImage.id))
    if (!currentAlbum) return
    
    const currentIndex = currentAlbum.photos.findIndex(p => p.id === lightboxImage.id)
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % currentAlbum.photos.length
      : (currentIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length
    
    setLightboxImage(currentAlbum.photos[newIndex])
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading gallery..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore moments from our performances, competitions, classes, and special events.
          </p>
        </div>

        {/* Albums Grid */}
        {!selectedAlbum && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Albums</h2>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">{albums.reduce((acc, a) => acc + a.photo_count, 0)} photos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Image className="w-5 h-5" />
                            <span className="text-sm">{album.photo_count} photos</span>
                          </div>
                          <ZoomIn className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{album.description}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {new Date(album.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Album View */}
        {selectedAlbum && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedAlbum(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Albums</span>
            </button>

            {/* Album Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display">{selectedAlbum.title}</h2>
              <p className="text-gray-600 mt-2">{selectedAlbum.description}</p>
              <p className="text-gray-400 text-sm mt-2">
                {selectedAlbum.photo_count} photos • {new Date(selectedAlbum.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedAlbum.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(photo)}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white text-sm p-4">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <div className="max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImage.url}
                alt={lightboxImage.caption}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {lightboxImage.caption && (
                <p className="text-white text-center mt-4 text-lg">{lightboxImage.caption}</p>
              )}
            </div>
          </div>
        )}

        {/* Instagram CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white text-center">
          <Camera className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 font-display">Follow Us on Instagram</h3>
          <p className="text-white/90 mb-6">Stay up to date with our latest photos and behind-the-scenes moments!</p>
          <a
            href="https://instagram.com/studio4danceco"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-gray-100 transition-all"
          >
            <span>@studio4danceco</span>
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Gallery
