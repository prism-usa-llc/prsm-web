import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface DashboardStats {
  total_submissions: number;
  unread_submissions: number;
  flagged_submissions: number;
  submissions_today: number;
  submissions_this_week: number;
  submissions_this_month: number;
}

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        onLogout();
      } else {
        setError('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('An error occurred while fetching stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchStats}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats?.total_submissions}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Submissions</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats?.unread_submissions}</div>
                  <div className="text-sm text-gray-500 mt-1">Unread</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats?.flagged_submissions}</div>
                  <div className="text-sm text-gray-500 mt-1">Flagged</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats?.submissions_today}</div>
                  <div className="text-sm text-gray-500 mt-1">Today</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats?.submissions_this_week}</div>
                  <div className="text-sm text-gray-500 mt-1">This Week</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats?.submissions_this_month}</div>
                  <div className="text-sm text-gray-500 mt-1">This Month</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  View All Submissions
                </Button>
                <Button className="w-full" variant="outline">
                  View Unread Messages
                </Button>
                <Button className="w-full" variant="outline">
                  View Flagged Messages
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-sm text-gray-600">
                <p className="mb-2">• {stats?.submissions_today} new submissions today</p>
                <p className="mb-2">• {stats?.unread_submissions} messages awaiting review</p>
                <p>• {stats?.flagged_submissions} messages flagged for attention</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}