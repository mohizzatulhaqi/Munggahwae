"use client"

import { useState, useEffect } from 'react'
import { bookingApi, BookingStatisticsResponse } from '@/lib/api/bookingApi'
import AdminDashboardPage from '@/components/pages/admin/admin-dashboard-page'

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response: BookingStatisticsResponse = await bookingApi.getBookingStatistics()

      if (response.success && response.statistics) {
        setStatistics(response.statistics)
      } else {
        setError(response.error || 'Failed to load statistics')
      }
    } catch (err) {
      console.error('Error loading statistics:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadStatistics()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
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
    <AdminDashboardPage
      statistics={statistics}
      onRefresh={handleRefresh}
      loading={loading}
    />
  )
}
