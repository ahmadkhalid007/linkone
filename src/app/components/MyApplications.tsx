import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, XCircle, Search, Eye, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { getAllApplicationsArray } from '../utils/trackingIdGenerator';

export function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    loadApplications();
    
    // Set up interval to refresh applications every 5 seconds
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const loadApplications = () => {
    if (!user) return;
    
    const allApps = getAllApplicationsArray();
    // Filter applications by current user's email or student ID
    const myApps = allApps.filter(app => 
      app.studentEmail === user.email || 
      app.studentId === user.studentId ||
      app.submittedBy === user.id
    );
    setApplications(myApps);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="text-green-600" size={24} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={24} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={24} />;
      default:
        return <Clock className="text-gray-400" size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Unknown</Badge>;
    }
  };

  const filteredApps = applications.filter(app =>
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (selectedApp) {
    return <ApplicationDetailView app={selectedApp} onBack={() => setSelectedApp(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-gray-900">My Applications</h2>
              <p className="text-gray-600">Track all your submitted applications and appeals</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-blue-600 mb-2">{stats.total}</p>
              <p className="text-gray-600">Total</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-yellow-600 mb-2">{stats.pending}</p>
              <p className="text-gray-600">Pending</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-green-600 mb-2">{stats.approved}</p>
              <p className="text-gray-600">Approved</p>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <p className="text-red-600 mb-2">{stats.rejected}</p>
              <p className="text-gray-600">Rejected</p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by tracking ID or application type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-2">No applications found</p>
            <p className="text-gray-400">Submit an application to see it here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(app.status)}
                  </div>

                  {/* Application Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900 font-semibold">{app.id}</h4>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-gray-700 mb-1">{app.type}</p>
                    {app.projectTitle && (
                      <p className="text-gray-600 mb-1">Project: {app.projectTitle}</p>
                    )}
                    <div className="flex items-center gap-4 text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Submitted: {new Date(app.submittedDate).toLocaleDateString()}</span>
                      </div>
                      {app.status === 'pending' && (
                        <span className="text-yellow-600">
                          Current Stage: {app.currentStage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                      className="gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {app.status === 'pending' && app.stages && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Progress</p>
                      <p className="text-gray-500">
                        {app.stages.filter((s: any) => s.status === 'approved').length} of {app.stages.length} stages completed
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(app.stages.filter((s: any) => s.status === 'approved').length / app.stages.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationDetailView({ app, onBack }: { app: any; onBack: () => void }) {
  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600 animate-pulse" size={20} />;
      default:
        return <Clock className="text-gray-300" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="outline" onClick={onBack} className="mb-6">
          ← Back to My Applications
        </Button>

        {/* Header */}
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-gray-900 mb-2">{app.id}</h2>
              <p className="text-gray-600">{app.type}</p>
            </div>
            <Badge className={
              app.status === 'approved' ? 'bg-green-100 text-green-700' :
              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }>
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </Badge>
          </div>

          {/* Application Details */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-gray-600 mb-1">Submitted On</p>
              <p className="text-gray-900">
                {new Date(app.submittedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {app.projectTitle && (
              <div>
                <p className="text-gray-600 mb-1">Project Title</p>
                <p className="text-gray-900">{app.projectTitle}</p>
              </div>
            )}

            {app.projectCategory && (
              <div>
                <p className="text-gray-600 mb-1">Category</p>
                <p className="text-gray-900">{app.projectCategory}</p>
              </div>
            )}

            {app.supervisor && (
              <div>
                <p className="text-gray-600 mb-1">Supervisor</p>
                <p className="text-gray-900">{app.supervisor}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Approval Timeline */}
        {app.stages && (
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Approval Timeline</h3>
            
            {/* Progress Bar */}
            <div className="bg-gray-100 rounded-full h-2 mb-8">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(app.stages.filter((s: any) => s.status === 'approved').length / app.stages.length) * 100}%` 
                }}
              />
            </div>

            <div className="space-y-6">
              {app.stages.map((stage: any, index: number) => {
                const isCurrentStage = stage.name === app.currentStage;
                const isPending = stage.status === 'pending';

                return (
                  <div 
                    key={index} 
                    className={`relative flex items-start gap-4 pb-6 last:pb-0 ${
                      isCurrentStage ? 'bg-blue-50 -mx-4 px-4 py-4 rounded-lg' : ''
                    }`}
                  >
                    {/* Timeline Line */}
                    {index < app.stages.length - 1 && (
                      <div 
                        className={`absolute left-[9px] top-[28px] w-0.5 h-full ${
                          stage.status === 'approved' ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    {/* Status Icon */}
                    <div className="relative z-10 bg-white">
                      {getStageStatusIcon(stage.status)}
                      {isCurrentStage && isPending && (
                        <div className="absolute -inset-1 bg-yellow-400 rounded-full opacity-25 animate-ping" />
                      )}
                    </div>

                    {/* Stage Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`${isCurrentStage ? 'font-semibold' : ''} text-gray-900`}>
                          {stage.name}
                        </p>
                        {isCurrentStage && isPending && (
                          <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>
                        )}
                      </div>

                      {stage.approver && (
                        <p className="text-gray-600">Reviewed by: {stage.approver}</p>
                      )}

                      {stage.date && (
                        <p className="text-gray-500 mt-1">
                          {stage.status === 'approved' ? '✓ Approved' : '✗ Rejected'} on{' '}
                          {new Date(stage.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}

                      {!stage.date && stage.status === 'pending' && (
                        <p className="text-gray-500 mt-1">
                          {isCurrentStage ? 'Currently under review...' : 'Awaiting approval...'}
                        </p>
                      )}

                      {stage.comments && (
                        <p className="text-gray-600 mt-2 italic bg-gray-50 p-2 rounded">
                          "{stage.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Rejection Reason */}
        {app.status === 'rejected' && app.rejectionReason && (
          <Card className="p-6 mt-6 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <XCircle className="text-red-600 mt-0.5" size={24} />
              <div>
                <p className="text-red-700 font-semibold mb-1">Application Rejected</p>
                <p className="text-red-600">{app.rejectionReason}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {app.status === 'approved' && (
          <Card className="p-6 mt-6 bg-green-50 border-2 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-0.5" size={24} />
              <div>
                <p className="text-green-700 font-semibold mb-1">Application Approved!</p>
                <p className="text-green-600">
                  Your application has been fully approved. Please check your email for further instructions.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
