import { Search, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getAllApplicationsArray, getApplicationByTrackingId } from '../utils/trackingIdGenerator';

export function StatusTracking() {
  const [searchId, setSearchId] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchedApplication, setSearchedApplication] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Load applications from localStorage on mount
  useEffect(() => {
    const storedApps = getAllApplicationsArray();
    setApplications(storedApps);
  }, []);

  const handleSearch = () => {
    setShowResults(true);
    setNotFound(false);
    
    if (searchId.trim()) {
      const app = getApplicationByTrackingId(searchId.trim());
      if (app) {
        setSearchedApplication(app);
        setNotFound(false);
      } else {
        setSearchedApplication(null);
        setNotFound(true);
      }
    } else {
      setSearchedApplication(null);
    }
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
        return <Circle className="text-gray-400" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600 animate-pulse" size={20} />;
      default:
        return <Circle className="text-gray-300" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    const text = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Badge variant="outline" className={`${colors} border`}>
        {text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Track Your Application Status</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your application ID to track the status of your appeal. You can find your application ID 
            in the confirmation email sent after submission.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter Application ID (e.g., APP-2025-001)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="mr-2" size={20} />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Applications or Search Results */}
        <div>
          <h3 className="text-gray-900 mb-6">
            {showResults && searchId ? 'Search Results' : 'Recent Applications'}
          </h3>
          
          <div className="space-y-6">
            {showResults && notFound ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="text-red-500 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-700">Application not found:</p>
                    <p className="text-red-600">Please check the application ID and try again.</p>
                  </div>
                </div>
              </div>
            ) : (
              (searchedApplication ? [searchedApplication] : applications).map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm p-6">
                  {/* Application Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{app.id}</h4>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-gray-600">{app.type}</p>
                      <p className="text-gray-500">Submitted: {new Date(app.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Approval Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">Approval Progress:</p>
                      <p className="text-gray-500">
                        Current Stage: <span className="font-semibold text-gray-900">{app.currentStage}</span>
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="bg-gray-100 rounded-full h-2 mb-6">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(app.stages.filter(s => s.status === 'approved').length / app.stages.length) * 100}%` 
                        }}
                      />
                    </div>

                    <div className="relative">
                      {app.stages.map((stage, index) => {
                        const isCurrentStage = stage.name === app.currentStage;
                        const isPending = stage.status === 'pending';
                        const isApproved = stage.status === 'approved';
                        const isRejected = stage.status === 'rejected';
                        
                        return (
                          <div key={index} className={`flex items-start gap-4 pb-8 last:pb-0 ${isCurrentStage ? 'bg-blue-50 -mx-4 px-4 py-4 rounded-lg' : ''}`}>
                            {/* Timeline Line */}
                            {index < app.stages.length - 1 && (
                              <div 
                                className={`absolute left-[9px] top-[28px] w-0.5 ${
                                  isApproved ? 'bg-green-300' : 'bg-gray-200'
                                }`} 
                                style={{ 
                                  height: isCurrentStage ? 'calc(100% - 28px + 16px)' : 'calc(100% - 28px)',
                                  top: isCurrentStage ? '44px' : '28px'
                                }} 
                              />
                            )}
                            
                            {/* Status Icon with pulse animation for current stage */}
                            <div className={`relative z-10 bg-white ${isCurrentStage ? 'animate-pulse' : ''}`}>
                              {getStageStatusIcon(stage.status)}
                              {isCurrentStage && isPending && (
                                <div className="absolute -inset-1 bg-yellow-400 rounded-full opacity-25 animate-ping" />
                              )}
                            </div>

                            {/* Stage Info */}
                            <div className="flex-1 pt-0.5">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className={`${isCurrentStage ? 'font-semibold' : ''} text-gray-900`}>
                                      {stage.name}
                                    </p>
                                    {isCurrentStage && isPending && (
                                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                        In Progress
                                      </span>
                                    )}
                                  </div>
                                  
                                  {stage.approver && (
                                    <p className="text-gray-600 mt-1">
                                      Reviewed by: {stage.approver}
                                    </p>
                                  )}
                                  
                                  {stage.date && (
                                    <p className="text-gray-500 mt-1">
                                      {stage.status === 'approved' ? '✓ Approved' : stage.status === 'rejected' ? '✗ Rejected' : 'Reviewed'} on {new Date(stage.date).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  )}
                                  
                                  {!stage.date && stage.status === 'pending' && (
                                    <p className="text-gray-500 mt-1">
                                      {isCurrentStage ? 'Currently under review...' : 'Awaiting approval...'}
                                    </p>
                                  )}
                                  
                                  {stage.comments && (
                                    <p className="text-gray-600 mt-2 italic">
                                      "{stage.comments}"
                                    </p>
                                  )}
                                </div>
                                {getStatusBadge(stage.status)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rejection Reason if applicable */}
                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <XCircle className="text-red-500 mt-0.5" size={20} />
                        <div>
                          <p className="text-red-700">Rejection Reason:</p>
                          <p className="text-red-600">{app.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approval Message if applicable */}
                  {app.status === 'approved' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                        <div>
                          <p className="text-green-700">Your application has been approved!</p>
                          <p className="text-green-600">You will receive further instructions via email.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h3 className="text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            If you cannot find your application or have questions about the approval process, 
            please contact our support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              Contact Support
            </Button>
            <Button variant="outline">
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}