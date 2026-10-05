import { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, Clock, Filter, Download, Eye, UserCircle, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { ApplicationDetails } from './ApplicationDetails';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { getAllApplicationsArray, getStoredApplications } from '../utils/trackingIdGenerator';

export function AdminDashboard() {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  // Load applications from localStorage
  useEffect(() => {
    const loadedApps = getAllApplicationsArray();
    
    // Merge with sample data if empty
    if (loadedApps.length === 0) {
      const sampleApps = [
        {
          id: 'APP-2025-001',
          studentId: '2021-CS-001',
          studentName: 'Ali Ahmad',
          studentEmail: 'ali.ahmad@university.edu',
          type: 'Cross-Department Registration',
          submittedDate: '2025-10-05',
          status: 'approved',
          currentStage: 'Department Head',
          courseName: 'Data Structures',
          courseCode: 'CS-201',
          stages: [
            { name: 'Course Coordinator', status: 'approved', date: '2025-10-06', approver: 'Dr. Hassan Khan' },
            { name: 'Director', status: 'approved', date: '2025-10-08', approver: 'Prof. Amir Mahmood' },
            { name: 'Department Head', status: 'approved', date: '2025-10-10', approver: 'Dr. Fahad Sheikh' },
          ],
        },
        {
          id: 'FYP-2025-001',
          studentId: '2021-CS-078',
          studentName: 'Sara Iqbal',
          studentEmail: 'sara.iqbal@university.edu',
          type: 'FYP Proposal',
          submittedDate: '2025-11-01',
          status: 'pending',
          currentStage: 'Supervisor',
          projectTitle: 'AI-Powered Healthcare Management System',
          projectCategory: 'Artificial Intelligence & Machine Learning',
          supervisor: 'Dr. Hassan Khan',
          stages: [
            { name: 'Supervisor', status: 'pending', date: null, approver: null },
            { name: 'Department Head', status: 'pending', date: null, approver: null },
          ],
        },
      ];
      setApplications(sampleApps);
    } else {
      setApplications(loadedApps);
    }
  }, []);

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | 'pending' | 'forward' | null;
    applicationId: string | null;
  }>({
    open: false,
    action: null,
    applicationId: null,
  });
  const [actionNotes, setActionNotes] = useState('');

  // Get the next stage in the approval hierarchy
  const getNextStage = (currentRole: string, applicationType?: string): string | null => {
    // For FYP proposals, the hierarchy is: Supervisor -> Department Head
    if (applicationType === 'FYP Proposal') {
      const fypHierarchy: Record<string, string> = {
        'teacher': 'Department Head',
        'department_head': null, // Final stage for FYP
      };
      return fypHierarchy[currentRole] || null;
    }

    // Regular approval hierarchy
    const hierarchy: Record<string, string> = {
      'course_coordinator': 'Director',
      'teacher': 'Director',
      'director': 'Department Head',
      'department_head': 'Vice Chancellor',
      'vice_chancellor': null, // Final stage
    };
    
    return hierarchy[currentRole] || null;
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (!user?.adminRole) return 'Admin';
    return user.adminRole
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Filter applications based on user's role
  const getRelevantApplications = () => {
    if (user?.adminRole === 'vice_chancellor') {
      // Vice Chancellor sees all applications
      return applications;
    }

    // For teachers, check both regular stage and FYP supervisor stage
    if (user?.adminRole === 'teacher') {
      return applications.filter(app => {
        // For FYP proposals, check if current stage is Supervisor
        if (app.type === 'FYP Proposal') {
          return app.currentStage === 'Supervisor' && app.status === 'pending';
        }
        // For other applications, check if current stage is Course Coordinator
        return app.currentStage === 'Course Coordinator' && app.status === 'pending';
      });
    }

    // Other roles only see applications at their current stage
    const roleToStageMap: Record<string, string> = {
      course_coordinator: 'Course Coordinator',
      director: 'Director',
      department_head: 'Department Head',
    };

    const currentRoleStage = roleToStageMap[user?.adminRole || ''];
    if (!currentRoleStage) return applications;

    return applications.filter(app => 
      app.currentStage === currentRoleStage || 
      app.stages.some(stage => stage.name === currentRoleStage && stage.status !== 'approved' && stage.status !== 'rejected')
    );
  };

  const relevantApplications = getRelevantApplications();

  const filteredApplications = relevantApplications.filter((app) => {
    const matchesSearch = searchId === '' || app.id.toLowerCase().includes(searchId.toLowerCase()) || 
                         app.studentId.toLowerCase().includes(searchId.toLowerCase()) ||
                         app.studentName.toLowerCase().includes(searchId.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesType = filterType === 'all' || app.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: relevantApplications.length,
    pending: relevantApplications.filter(app => app.status === 'pending').length,
    approved: relevantApplications.filter(app => app.status === 'approved').length,
    rejected: relevantApplications.filter(app => app.status === 'rejected').length,
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

  const openActionDialog = (action: 'approve' | 'reject' | 'pending' | 'forward', appId: string) => {
    setActionDialog({ open: true, action, applicationId: appId });
    setActionNotes('');
  };

  const handleAction = () => {
    if (!actionDialog.applicationId || !actionDialog.action) return;

    const app = applications.find(a => a.id === actionDialog.applicationId);
    if (!app) return;

    // Update the application
    const updatedApplications = applications.map(a => {
      if (a.id === actionDialog.applicationId) {
        const updatedStages = [...a.stages];
        const roleToStageMap: Record<string, string> = {
          course_coordinator: 'Course Coordinator',
          teacher: 'Supervisor', // For FYP, teacher acts as Supervisor
          director: 'Director',
          department_head: 'Department Head',
          vice_chancellor: 'Vice Chancellor',
        };
        
        let currentRoleStage = roleToStageMap[user?.adminRole || ''];
        
        // Special handling for FYP proposals
        if (a.type === 'FYP Proposal' && user?.adminRole === 'teacher') {
          currentRoleStage = 'Supervisor';
        }

        // Handle forward action
        if (actionDialog.action === 'forward') {
          const nextStage = getNextStage(user?.adminRole || '', a.type);
          if (nextStage) {
            // Mark current stage as approved
            const currentStageIndex = updatedStages.findIndex(stage => stage.name === currentRoleStage);
            if (currentStageIndex !== -1) {
              updatedStages[currentStageIndex] = {
                ...updatedStages[currentStageIndex],
                status: 'approved',
                date: new Date().toISOString(),
                approver: user?.name || 'Admin',
                comments: actionNotes || undefined,
              };
            }

            // Update or add next stage
            const nextStageIndex = updatedStages.findIndex(stage => stage.name === nextStage);
            if (nextStageIndex === -1) {
              updatedStages.push({
                name: nextStage,
                status: 'pending',
                date: null,
                approver: null,
              });
            } else {
              updatedStages[nextStageIndex] = {
                ...updatedStages[nextStageIndex],
                status: 'pending',
              };
            }

            return {
              ...a,
              stages: updatedStages,
              currentStage: nextStage,
              status: 'pending',
            };
          }
        }

        // Handle other actions (approve, reject, pending)
        updatedStages.forEach((stage, index) => {
          if (stage.name === currentRoleStage) {
            updatedStages[index] = {
              ...stage,
              status: actionDialog.action!,
              date: new Date().toISOString(),
              approver: user?.name || 'Admin',
              comments: actionNotes || undefined,
            };
          }
        });

        // Determine overall status
        let newStatus = a.status;
        if (actionDialog.action === 'reject') {
          newStatus = 'rejected';
        } else if (actionDialog.action === 'approve') {
          // Check if all stages are approved
          const allApproved = updatedStages.every(stage => stage.status === 'approved');
          if (allApproved) {
            newStatus = 'approved';
          }
        }

        return {
          ...a,
          stages: updatedStages,
          status: newStatus,
          rejectionReason: actionDialog.action === 'reject' ? actionNotes : a.rejectionReason,
        };
      }
      return a;
    });

    // Save to localStorage
    const storedApps = getStoredApplications();
    updatedApplications.forEach(updatedApp => {
      storedApps[updatedApp.id] = updatedApp;
    });
    localStorage.setItem('link-one-applications', JSON.stringify(storedApps));

    // Update state
    setApplications(updatedApplications);

    let actionText = '';
    let nextStageName = '';
    if (actionDialog.action === 'forward') {
      nextStageName = getNextStage(user?.adminRole || '', app.type) || '';
      actionText = `forwarded to ${nextStageName}`;
    } else {
      actionText = actionDialog.action === 'approve' ? 'approved' : 
                  actionDialog.action === 'reject' ? 'rejected' : 'marked as pending';
    }

    toast.success(`Application ${actionText}`, {
      description: `Application ${actionDialog.applicationId} has been ${actionText}.`,
    });

    setActionDialog({ open: false, action: null, applicationId: null });
    setActionNotes('');
  };

  const handleExport = () => {
    toast.success('Exporting data', {
      description: 'Your report will be downloaded shortly.',
    });
  };

  if (selectedApplication) {
    const app = applications.find(a => a.id === selectedApplication);
    return (
      <ApplicationDetails 
        application={app!} 
        onBack={() => setSelectedApplication(null)}
        onApprove={(id) => openActionDialog('approve', id)}
        onReject={(id) => openActionDialog('reject', id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-gray-900">Admin Dashboard</h2>
            <Badge className="bg-purple-100 text-purple-700">{getRoleDisplayName()}</Badge>
          </div>
          <p className="text-gray-600">Manage and review student applications</p>
          {user?.adminRole !== 'vice_chancellor' && (
            <p className="text-gray-500 mt-1">
              Showing applications that require your review
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Filter className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-blue-600">{stats.total}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Pending</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
            <p className="text-yellow-600">{stats.pending}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Approved</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-green-600">{stats.approved}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Rejected</p>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={20} />
              </div>
            </div>
            <p className="text-red-600">{stats.rejected}</p>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search by ID, Student ID, or Name..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Cross-Department Registration">Cross-Department</SelectItem>
                <SelectItem value="Leave Management">Leave Management</SelectItem>
                <SelectItem value="Timetable Clash Detection">Timetable Clash</SelectItem>
                <SelectItem value="Academic Appeal">Academic Appeal</SelectItem>
                <SelectItem value="FYP Proposal">FYP Proposal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2" size={20} />
              Export Report
            </Button>
          </div>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ApplicationsList 
              applications={filteredApplications}
              getStatusBadge={getStatusBadge}
              onViewDetails={setSelectedApplication}
              onApprove={(id) => openActionDialog('approve', id)}
              onReject={(id) => openActionDialog('reject', id)}
              onPending={(id) => openActionDialog('pending', id)}
              onForward={(id) => openActionDialog('forward', id)}
              userRole={user?.adminRole}
              getNextStage={() => getNextStage(user?.adminRole || '')}
            />
          </TabsContent>

          <TabsContent value="pending">
            <ApplicationsList 
              applications={filteredApplications.filter(app => app.status === 'pending')}
              getStatusBadge={getStatusBadge}
              onViewDetails={setSelectedApplication}
              onApprove={(id) => openActionDialog('approve', id)}
              onReject={(id) => openActionDialog('reject', id)}
              onPending={(id) => openActionDialog('pending', id)}
              onForward={(id) => openActionDialog('forward', id)}
              userRole={user?.adminRole}
              getNextStage={() => getNextStage(user?.adminRole || '')}
            />
          </TabsContent>

          <TabsContent value="approved">
            <ApplicationsList 
              applications={filteredApplications.filter(app => app.status === 'approved')}
              getStatusBadge={getStatusBadge}
              onViewDetails={setSelectedApplication}
              onApprove={(id) => openActionDialog('approve', id)}
              onReject={(id) => openActionDialog('reject', id)}
              onPending={(id) => openActionDialog('pending', id)}
              onForward={(id) => openActionDialog('forward', id)}
              userRole={user?.adminRole}
              getNextStage={() => getNextStage(user?.adminRole || '')}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <ApplicationsList 
              applications={filteredApplications.filter(app => app.status === 'rejected')}
              getStatusBadge={getStatusBadge}
              onViewDetails={setSelectedApplication}
              onApprove={(id) => openActionDialog('approve', id)}
              onReject={(id) => openActionDialog('reject', id)}
              onPending={(id) => openActionDialog('pending', id)}
              onForward={(id) => openActionDialog('forward', id)}
              userRole={user?.adminRole}
              getNextStage={() => getNextStage(user?.adminRole || '')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, action: null, applicationId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'approve' ? 'Approve Application' :
               actionDialog.action === 'reject' ? 'Reject Application' :
               actionDialog.action === 'forward' ? 'Forward Application' :
               'Mark as Pending'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'approve' 
                ? 'Are you sure you want to approve this application?' 
                : actionDialog.action === 'reject'
                ? 'Please provide a reason for rejection.'
                : actionDialog.action === 'forward'
                ? `Forward this application to ${getNextStage(user?.adminRole || '')} for the next level of approval.`
                : 'Mark this application as pending for further review.'}
            </DialogDescription>
          </DialogHeader>
          
          {actionDialog.action === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a detailed reason for rejection..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
                required
              />
            </div>
          )}

          {actionDialog.action !== 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="action-notes">Notes (Optional)</Label>
              <Textarea
                id="action-notes"
                placeholder="Add any additional notes or comments..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({ open: false, action: null, applicationId: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAction}
              disabled={actionDialog.action === 'reject' && !actionNotes.trim()}
              className={
                actionDialog.action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                actionDialog.action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                actionDialog.action === 'forward' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-yellow-600 hover:bg-yellow-700'
              }
            >
              {actionDialog.action === 'approve' ? 'Approve' :
               actionDialog.action === 'reject' ? 'Reject' :
               actionDialog.action === 'forward' ? 'Forward' :
               'Mark Pending'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ApplicationsList({ 
  applications, 
  getStatusBadge, 
  onViewDetails,
  onApprove,
  onReject,
  onPending,
  onForward,
  userRole,
  getNextStage,
}: { 
  applications: any[]; 
  getStatusBadge: (status: string) => JSX.Element;
  onViewDetails: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPending: (id: string) => void;
  onForward: (id: string) => void;
  userRole?: string;
  getNextStage: () => string | null;
}) {
  const canTakeAction = (app: any) => {
    if (app.status !== 'pending') return false;

    const roleToStageMap: Record<string, string> = {
      course_coordinator: 'Course Coordinator',
      teacher: 'Course Coordinator',
      director: 'Director',
      department_head: 'Department Head',
      vice_chancellor: 'Vice Chancellor',
    };

    const currentRoleStage = roleToStageMap[userRole || ''];
    return app.currentStage === currentRoleStage;
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-gray-900">{app.id}</h4>
                {getStatusBadge(app.status)}
              </div>
              <p className="text-gray-600 mb-1">{app.type}</p>
              <p className="text-gray-500">
                Student: {app.studentName} ({app.studentId})
              </p>
              <p className="text-gray-500">
                Submitted: {new Date(app.submittedDate).toLocaleDateString()}
              </p>
              {app.status === 'pending' && (
                <p className="text-gray-500">
                  Current Stage: {app.currentStage}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(app.id)}
              >
                <Eye className="mr-2" size={16} />
                View Details
              </Button>

              {canTakeAction(app) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApprove(app.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle2 className="mr-2" size={16} />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(app.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="mr-2" size={16} />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPending(app.id)}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  >
                    <Clock className="mr-2" size={16} />
                    Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onForward(app.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <ArrowRight className="mr-2" size={16} />
                    Forward
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}