"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { historyApi, GetHistoryResponse, BookingWithMountain } from '@/lib/api/historyApi'
import BookingHistoryPage from '@/components/pages/booking-history-page'

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithMountain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const loadBookings = async (page = 1, status?: string, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response: GetHistoryResponse = await historyApi.getHistory({
        page,
        limit: pagination.limit,
        status,
        search,
      })

      if (response.success) {
        setBookings(response.bookings)
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        })
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
    loadBookings(pagination.page)
  }

  const handlePageChange = (newPage: number) => {
    loadBookings(newPage)
  }

  const handleStatusFilter = (status: string) => {
    loadBookings(1, status === 'all' ? undefined : status)
  }

  const handleSearch = (searchTerm: string) => {
    loadBookings(1, undefined, searchTerm || undefined)
  }


  if (authLoading || loading || !user) {
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
      pagination={pagination}
      onPageChange={handlePageChange}
      onStatusFilter={handleStatusFilter}
      onSearch={handleSearch}
    />
  )
}
