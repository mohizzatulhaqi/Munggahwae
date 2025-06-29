"use client"

import { useState, useEffect } from 'react'
import { mountainApi, GetMountainsResponse } from '@/lib/api/mountainApi'
import MountainDiscoveryPage from '@/components/pages/mountain-discovery-page'
import { Gunung } from '@/domain/entities/Gunung'

export default function MountainDiscovery() {
  const [mountains, setMountains] = useState<Gunung[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>('')

  useEffect(() => {
    loadMountains()
  }, [selectedProvinsi])

  const loadMountains = async () => {
    console.log('window:', typeof window);
    console.log('Fetching mountains...');
    try {
      setLoading(true)
      setError(null)

      const params = selectedProvinsi ? { provinsi: selectedProvinsi } : {}
      console.log('Before fetch');

      const response: GetMountainsResponse = await mountainApi.getMountains(params)
      console.log('After fetch', response);
      if (response.success) {
        setMountains(response.mountains)
      } else {
        setError(response.error || 'Failed to load mountains')
      }
    } catch (err) {
      console.error('Error loading mountains:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleProvinsiChange = (provinsi: string) => {
    setSelectedProvinsi(provinsi)
  }

  const handleRefresh = () => {
    loadMountains()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mountains...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Mountains</h2>
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
    <MountainDiscoveryPage
      mountains={mountains}
      selectedProvinsi={selectedProvinsi}
      onProvinsiChange={handleProvinsiChange}
      onRefresh={handleRefresh}
      loading={loading}
    />
  )
}