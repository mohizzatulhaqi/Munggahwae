"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { mountainApi } from '@/lib/api/mountainApi'
import MountainDetailPage from '@/components/pages/mountain-detail-page'
import { Gunung } from '@/domain/entities/Gunung'

export default function MountainDetail() {
  const params = useParams()
  const mountainId = params?.id as string
  
  const [mountain, setMountain] = useState<Gunung | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mountainId) {
      loadMountain()
    }
  }, [mountainId])

  const loadMountain = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await mountainApi.getMountainById(mountainId)

      if (response.success && response.mountain) {
        setMountain(response.mountain)
      } else {
        setError(response.error || 'Mountain not found')
      }
    } catch (err) {
      console.error('Error loading mountain:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadMountain()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mountain details...</p>
        </div>
      </div>
    )
  }

  if (error || !mountain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Mountain</h2>
          <p className="text-gray-600 mb-4">{error || 'Mountain not found'}</p>
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

  return <MountainDetailPage mountain={mountain} />
}
