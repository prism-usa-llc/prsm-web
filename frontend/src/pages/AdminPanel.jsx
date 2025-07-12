import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const [stats, setStats] = useState({})
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsResponse, locationsResponse] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/locations')
      ])
      
      setStats(statsResponse.data)
      setLocations(locationsResponse.data)
    } catch (error) {
      toast.error('Failed to load admin data')
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
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      {/* Admin Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
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
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">System Health</h3>
          <p className="text-3xl font-bold text-green-600">✓</p>
        </div>
      </div>

      {/* All Locations */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">All Locations</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Owner</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Queue Count</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="border-b">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{location.name}</div>
                      {location.address && (
                        <div className="text-sm text-gray-500">{location.address}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{location.owner?.username || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      location.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">0</span> {/* This would come from queue data */}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel