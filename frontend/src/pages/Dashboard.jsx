import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_locations: 0,
    active_queues: 0,
    total_customers_today: 0,
    is_admin: false
  })
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, locationsResponse] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/locations')
      ])
      
      setStats(statsResponse.data)
      setLocations(locationsResponse.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Locations</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.total_locations}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Queues</h3>
          <p className="text-3xl font-bold text-green-600">{stats.active_queues}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Customers Today</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total_customers_today}</p>
        </div>
      </div>

      {/* Locations */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Locations</h2>
          <button className="btn-primary">Add Location</button>
        </div>
        
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No locations yet</p>
            <button className="btn-primary">Create Your First Location</button>
          </div>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{location.name}</h3>
                    {location.address && (
                      <p className="text-gray-600 text-sm mt-1">{location.address}</p>
                    )}
                    {location.phone && (
                      <p className="text-gray-600 text-sm">{location.phone}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">View Queue</button>
                    <button className="btn-primary text-sm">QR Code</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard