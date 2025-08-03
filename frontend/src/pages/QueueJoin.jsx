import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const QueueJoin = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const locationId = searchParams.get('location_id')
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    location_id: locationId || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if (locationId) {
      // Fetch location details
      fetchLocationDetails(locationId)
    }
  }, [locationId])

  const fetchLocationDetails = async (id) => {
    try {
      // This would be a public endpoint to get location info
      const response = await axios.get(`/api/locations/${id}/public`)
      setLocation(response.data)
    } catch (error) {
      toast.error('Location not found')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post('/api/queues/join', formData)
      
      toast.success('Successfully joined the queue!')
      navigate(`/track/${response.data.id}`)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to join queue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Join Queue</h2>
        
        {location && (
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold">{location.name}</h3>
            {location.address && <p className="text-sm text-gray-600">{location.address}</p>}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="input-field"
              required
            />
          </div>
          
          {!locationId && (
            <div>
              <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
                Location ID
              </label>
              <input
                type="number"
                id="location_id"
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Joining Queue...' : 'Join Queue'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You'll receive a tracking link via SMS</li>
            <li>• Monitor your position in real-time</li>
            <li>• Get notified when you're 3rd in line</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QueueJoin