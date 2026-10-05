import { ArrowLeft, CheckCircle2, XCircle, Clock, Download, User, Mail, Calendar, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';

interface ApplicationDetailsProps {
  application: any;
  onBack: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApplicationDetails({ application, onBack, onApprove, onReject }: ApplicationDetailsProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  const handleApprove = () => {
    onApprove(application.id);
    onBack();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onReject(application.id);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Application Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-gray-900">{application.id}</h2>
                {getStatusBadge(application.status)}
              </div>
              <p className="text-gray-600">{application.type}</p>
            </div>
            <Button variant="outline">
              <Download className="mr-2" size={20} />
              Export PDF
            </Button>
          </div>

          {/* Student Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-gray-600">Student Name</p>
                    <p className="text-gray-900">{application.studentName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-gray-600">Student ID</p>
                    <p className="text-gray-900">{application.studentId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="text-gray-900">{application.studentEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-gray-900 mb-4">Application Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-gray-600">Submitted Date</p>
                    <p className="text-gray-900">
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {application.courseName && (
                  <>
                    <div className="flex items-start gap-3">
                      <FileText className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-gray-600">Course Name</p>
                        <p className="text-gray-900">{application.courseName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-gray-600">Course Code</p>
                        <p className="text-gray-900">{application.courseCode}</p>
                      </div>
                    </div>
                  </>
                )}
                {application.leaveType && (
                  <>
                    <div className="flex items-start gap-3">
                      <FileText className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-gray-600">Leave Type</p>
                        <p className="text-gray-900">{application.leaveType}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="text-gray-900">{application.leaveDuration}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Approval Timeline */}
        <Card className="p-8 mb-6">
          <h3 className="text-gray-900 mb-6">Approval Timeline</h3>
          <div className="space-y-6">
            {application.stages.map((stage: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                {/* Timeline Line */}
                <div className="relative">
                  {index < application.stages.length - 1 && (
                    <div className="absolute left-[9px] top-[28px] w-0.5 h-full bg-gray-200" />
                  )}
                  <div className="relative z-10 bg-white">
                    {getStatusIcon(stage.status)}
                  </div>
                </div>

                {/* Stage Info */}
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="text-gray-900">{stage.name}</p>
                      {stage.approver && (
                        <p className="text-gray-600">Reviewer: {stage.approver}</p>
                      )}
                      {stage.date && (
                        <p className="text-gray-500">
                          {stage.status === 'approved' ? 'Approved' : 'Reviewed'} on{' '}
                          {new Date(stage.date).toLocaleDateString()}
                        </p>
                      )}
                      {!stage.date && stage.status === 'pending' && (
                        <p className="text-gray-500">Awaiting review...</p>
                      )}
                    </div>
                    {getStatusBadge(stage.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rejection Reason if exists */}
        {application.rejectionReason && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <XCircle className="text-red-500 mt-0.5" size={20} />
              <div>
                <p className="text-red-700">Rejection Reason:</p>
                <p className="text-red-600">{application.rejectionReason}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {application.status === 'pending' && (
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Review Actions</h3>
            
            {!showRejectForm ? (
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                >
                  <CheckCircle2 className="mr-2" size={20} />
                  Approve Application
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setShowRejectForm(true)}
                >
                  <XCircle className="mr-2" size={20} />
                  Reject Application
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Please provide a detailed reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={handleReject}
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
