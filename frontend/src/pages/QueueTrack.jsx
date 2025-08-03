import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

const QueueTrack = () => {
  const { entryId } = useParams()
  const [queueData, setQueueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQueueData()
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchQueueData, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [entryId])

  const fetchQueueData = async () => {
    try {
      const response = await axios.get(`/api/queues/track/${entryId}`)
      setQueueData(response.data)
      setError(null)
    } catch (error) {
      setError('Queue entry not found')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'text-blue-600 bg-blue-50'
      case 'notified':
        return 'text-yellow-600 bg-yellow-50'
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return 'Waiting in Queue'
      case 'notified':
        return 'Your Turn Soon!'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Queue Status</h1>
          <div className="flex items-center justify-center mb-2">
            <MapPinIcon className="h-5 w-5 text-gray-500 mr-1" />
            <span className="text-gray-600">{queueData.location_name}</span>
          </div>
        </div>

        {/* Position Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-primary-600 mb-2">
            #{queueData.position}
          </div>
          <p className="text-gray-600">Your position in line</p>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(queueData.status)}`}>
            {getStatusText(queueData.status)}
          </div>
        </div>

        {/* Estimated Wait Time */}
        {queueData.estimated_wait_time > 0 && (
          <div className="flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-lg">
            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">
              Estimated wait: {queueData.estimated_wait_time} minutes
            </span>
          </div>
        )}

        {/* Status Messages */}
        {queueData.status === 'waiting' && queueData.position <= 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              🔔 You're almost up! Please stay nearby.
            </p>
          </div>
        )}

        {queueData.status === 'notified' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">
              🎉 It's your turn! Please proceed to the counter.
            </p>
          </div>
        )}

        {queueData.status === 'completed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800">
              ✅ Thank you for using our queue system!
            </p>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={fetchQueueData}
          className="w-full btn-secondary"
        >
          Refresh Status
        </button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• This page updates automatically every 30 seconds</li>
            <li>• You'll be notified when you're 3rd in line</li>
            <li>• Save this link to check your status later</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QueueTrack