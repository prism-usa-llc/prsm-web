import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";

interface DashboardStats {
  total_submissions: number;
  unread_submissions: number;
  flagged_submissions: number;
  submissions_today: number;
  submissions_this_week: number;
  submissions_this_month: number;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submission_time: string;
  is_read: boolean;
  is_flagged: boolean;
  status: string;
}

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "all" | "unread" | "flagged"
  >("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        onLogout();
      } else {
        setError("Failed to fetch dashboard stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("An error occurred while fetching stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (filter?: string) => {
    try {
      setLoading(true);
      let url = "/api/admin/submissions";

      if (filter === "unread") {
        url += "?is_read=false";
      } else if (filter === "flagged") {
        url += "?is_flagged=true";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else if (response.status === 401) {
        onLogout();
      } else {
        setError("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("An error occurred while fetching submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    setCurrentView("all");
    fetchSubmissions();
  };

  const handleViewUnread = () => {
    setCurrentView("unread");
    fetchSubmissions("unread");
  };

  const handleViewFlagged = () => {
    setCurrentView("flagged");
    fetchSubmissions("flagged");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSubmissions([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    onLogout();
  };

  const updateSubmission = async (
    submissionId: number,
    updates: { is_read?: boolean; is_flagged?: boolean }
  ) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      // Refresh the submissions list
      if (currentView === "all") {
        fetchSubmissions();
      } else if (currentView === "unread") {
        fetchSubmissions("unread");
      } else if (currentView === "flagged") {
        fetchSubmissions("flagged");
      }

      // Also refresh stats if we're updating read status
      if (updates.is_read !== undefined) {
        fetchStats();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update submission"
      );
    }
  };

  const handleMarkAsRead = (submissionId: number) => {
    updateSubmission(submissionId, { is_read: true });
  };

  const handleMarkAsUnread = (submissionId: number) => {
    updateSubmission(submissionId, { is_read: false });
  };

  const handleFlag = (submissionId: number) => {
    updateSubmission(submissionId, { is_flagged: true });
  };

  const handleUnflag = (submissionId: number) => {
    updateSubmission(submissionId, { is_flagged: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-green-400 font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-400 mb-2 font-mono">
              Error
            </h2>
            <p className="text-green-300 mb-4">{error}</p>
            <Button onClick={fetchStats}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (currentView !== "dashboard") {
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 border-b border-green-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleBackToDashboard}>
                  ← Back to Dashboard
                </Button>
                <h1 className="text-xl font-bold text-green-400 font-mono">
                  {currentView === "all" && "All Submissions"}
                  {currentView === "unread" && "Unread Messages"}
                  {currentView === "flagged" && "Flagged Messages"}
                </h1>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-2 text-green-400 font-mono">
                  Loading submissions...
                </p>
              </div>
            ) : submissions.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <p className="text-green-300">No submissions found.</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-green-400 font-mono">
                            {submission.name}
                          </h3>
                          <p className="text-sm text-green-300">
                            {submission.email}
                          </p>
                          {submission.phone && (
                            <p className="text-sm text-green-300">
                              {submission.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!submission.is_read && (
                            <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/50">
                              Unread
                            </span>
                          )}
                          {submission.is_flagged && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                              Flagged
                            </span>
                          )}
                          <span className="text-xs text-green-400 font-mono">
                            {new Date(
                              submission.submission_time
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-700 border border-green-500/30 rounded-lg p-4 mb-4">
                        <p className="text-green-300 whitespace-pre-wrap">
                          {submission.message}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-green-500/30">
                        {submission.is_read ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsUnread(submission.id)}
                          >
                            Mark as Unread
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsRead(submission.id)}
                          >
                            Mark as Read
                          </Button>
                        )}

                        {submission.is_flagged ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnflag(submission.id)}
                          >
                            Unflag
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlag(submission.id)}
                          >
                            Flag
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-green-400 font-mono">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono">
              Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">
                    {stats?.total_submissions}
                  </div>
                  <div className="text-sm text-green-300 mt-1">
                    Total Submissions
                  </div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 font-mono">
                    {stats?.unread_submissions}
                  </div>
                  <div className="text-sm text-green-300 mt-1">Unread</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 font-mono">
                    {stats?.flagged_submissions}
                  </div>
                  <div className="text-sm text-green-300 mt-1">Flagged</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">
                    {stats?.submissions_today}
                  </div>
                  <div className="text-sm text-green-300 mt-1">Today</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">
                    {stats?.submissions_this_week}
                  </div>
                  <div className="text-sm text-green-300 mt-1">This Week</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">
                    {stats?.submissions_this_month}
                  </div>
                  <div className="text-sm text-green-300 mt-1">This Month</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleViewAll}
                >
                  View All Submissions
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleViewUnread}
                >
                  View Unread Messages
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleViewFlagged}
                >
                  View Flagged Messages
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">
                Recent Activity
              </h3>
              <div className="text-sm text-green-300">
                <p className="mb-2">
                  • {stats?.submissions_today} new submissions today
                </p>
                <p className="mb-2">
                  • {stats?.unread_submissions} messages awaiting review
                </p>
                <p>
                  • {stats?.flagged_submissions} messages flagged for attention
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
