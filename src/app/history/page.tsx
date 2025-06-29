"use client"

import { useState, useEffect } from 'react'
import { bookingApi, GetBookingsResponse, BookingWithMountain } from '@/lib/api/bookingApi'
import BookingHistoryPage from '@/components/pages/booking-history-page'

export default function History() {
  const [bookings, setBookings] = useState<BookingWithMountain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Get userId from authentication context
      const userId = 'user-123' // Placeholder
      const response: GetBookingsResponse = await bookingApi.getBookings({ userId })

      if (response.success) {
        setBookings(response.bookings)
      } else {
        setError(response.error || 'Failed to load bookings')
      }
    } catch (err) {
      console.error('Error loading bookings:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadBookings()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <BookingHistoryPage
      bookings={bookings}
      onRefresh={handleRefresh}
      loading={loading}
    />
  )
}
