import { useState, useEffect } from 'react';
import { BookOpen, Send, Calendar, MessageSquare, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { SuccessAnimation } from './SuccessAnimation';

interface FYPProject {
  id: string;
  title: string;
  description: string;
  supervisor: string;
  studentId: string;
  studentName: string;
  status: string;
  submittedAt: string;
  supervisorRemarks?: { date: string; remark: string }[];
  meetings?: { date: string; agenda: string; notes: string }[];
  reviews?: { date: string; review: string; rating: number }[];
  vivaMarks?: number;
  committeeMembers?: string[];
}

export function SimplifiedFYP() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'view' | 'supervisor'>('submit');
  
  // Student submission form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  
  // Supervisor features
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [remark, setRemark] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [vivaMarks, setVivaMarks] = useState('');
  const [committeeSelection, setCommitteeSelection] = useState<string[]>([]);
  
  const [projects, setProjects] = useState<FYPProject[]>([]);
  const [myProject, setMyProject] = useState<FYPProject | null>(null);

  const supervisors = [
    'Dr. Hassan Ali',
    'Dr. Sarah Ahmed',
    'Prof. Amir Hassan',
    'Dr. Fahad Khan',
    'Dr. Ayesha Malik',
    'Dr. Usman Tariq',
  ];

  const committeeOptions = [
    'Dr. Hassan Ali',
    'Dr. Sarah Ahmed',
    'Prof. Amir Hassan',
    'Dr. Fahad Khan',
    'Dr. Ayesha Malik',
    'Dr. Usman Tariq',
    'Dr. Zainab Noor',
    'Dr. Ahmed Raza',
  ];

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    const stored = localStorage.getItem('fyp-projects');
    const allProjects = stored ? JSON.parse(stored) : [];
    setProjects(allProjects);

    // Find student's project
    if (user?.studentId) {
      const studentProject = allProjects.find((p: FYPProject) => p.studentId === user.studentId);
      setMyProject(studentProject || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || isAdmin) {
      toast.error('Only students can submit FYP proposals');
      return;
    }

    if (!title.trim() || !description.trim() || !supervisor) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newTrackingId = `FYP-${Date.now().toString().slice(-8)}`;
      setTrackingId(newTrackingId);

      const newProject: FYPProject = {
        id: newTrackingId,
        title: title.trim(),
        description: description.trim(),
        supervisor: supervisor,
        studentId: user?.studentId || '',
        studentName: user?.name || '',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        supervisorRemarks: [],
        meetings: [],
        reviews: [],
        committeeMembers: [],
      };

      const allProjects = [...projects, newProject];
      localStorage.setItem('fyp-projects', JSON.stringify(allProjects));
      setProjects(allProjects);
      setMyProject(newProject);

      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        setTitle('');
        setDescription('');
        setSupervisor('');
        setGroupMembers('');
        setShowSuccess(false);
        setActiveTab('view');
      }, 3000);
    }, 1500);
  };

  const handleAddRemark = () => {
    if (!selectedProject || !remark.trim()) {
      toast.error('Please select a project and enter a remark');
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject) {
        return {
          ...p,
          supervisorRemarks: [
            ...(p.supervisorRemarks || []),
            { date: new Date().toISOString(), remark: remark.trim() },
          ],
        };
      }
      return p;
    });

    localStorage.setItem('fyp-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setRemark('');
    toast.success('Remark added successfully');
  };

  const handleScheduleMeeting = () => {
    if (!selectedProject || !meetingDate || !meetingAgenda.trim()) {
      toast.error('Please fill all meeting details');
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject) {
        return {
          ...p,
          meetings: [
            ...(p.meetings || []),
            {
              date: meetingDate,
              agenda: meetingAgenda.trim(),
              notes: meetingNotes.trim(),
            },
          ],
        };
      }
      return p;
    });

    localStorage.setItem('fyp-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setMeetingDate('');
    setMeetingAgenda('');
    setMeetingNotes('');
    toast.success('Meeting scheduled successfully');
  };

  const handleAddReview = () => {
    if (!selectedProject || !review.trim() || !rating) {
      toast.error('Please provide review and rating');
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject) {
        return {
          ...p,
          reviews: [
            ...(p.reviews || []),
            {
              date: new Date().toISOString(),
              review: review.trim(),
              rating: parseInt(rating),
            },
          ],
        };
      }
      return p;
    });

    localStorage.setItem('fyp-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setReview('');
    setRating('');
    toast.success('Review added successfully');
  };

  const handleSetVivaMarks = () => {
    if (!selectedProject || !vivaMarks) {
      toast.error('Please enter viva marks');
      return;
    }

    const marks = parseInt(vivaMarks);
    if (marks < 0 || marks > 100) {
      toast.error('Marks must be between 0 and 100');
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject) {
        return { ...p, vivaMarks: marks };
      }
      return p;
    });

    localStorage.setItem('fyp-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setVivaMarks('');
    toast.success('Viva marks updated successfully');
  };

  const handleSetCommittee = () => {
    if (!selectedProject || committeeSelection.length === 0) {
      toast.error('Please select committee members');
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject) {
        return { ...p, committeeMembers: committeeSelection };
      }
      return p;
    });

    localStorage.setItem('fyp-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setCommitteeSelection([]);
    toast.success('Committee members assigned successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600">Please login to access FYP section</p>
          </Card>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SuccessAnimation 
            trackingId={trackingId}
            message="Your FYP proposal has been submitted successfully!"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-gray-900 mb-4">Final Year Project (FYP)</h2>
          <p className="text-gray-600">
            {isAdmin ? 'Manage student FYP projects' : 'Submit and track your FYP proposal'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {!isAdmin && (
              <TabsTrigger value="submit">Submit Proposal</TabsTrigger>
            )}
            <TabsTrigger value="view">{isAdmin ? 'All Projects' : 'My Project'}</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="supervisor">Supervisor Panel</TabsTrigger>
            )}
          </TabsList>

          {!isAdmin && (
            <TabsContent value="submit">
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter project title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project objectives and methodology..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Preferred Supervisor *</Label>
                    <Select value={supervisor} onValueChange={setSupervisor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors.map((sup) => (
                          <SelectItem key={sup} value={sup}>
                            {sup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="members">Group Members (Optional)</Label>
                    <Input
                      id="members"
                      placeholder="Enter group member names (comma-separated)"
                      value={groupMembers}
                      onChange={(e) => setGroupMembers(e.target.value)}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : (
                      <>
                        Submit Proposal
                        <Send className="ml-2" size={20} />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="view">
            {isAdmin ? (
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600">No FYP projects submitted yet</p>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card key={project.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-gray-600 mb-2">{project.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">{project.studentName}</Badge>
                            <Badge variant="outline">Supervisor: {project.supervisor}</Badge>
                            <Badge className="bg-blue-100 text-blue-700">{project.id}</Badge>
                          </div>
                        </div>
                        <Badge className={
                          project.status === 'approved' ? 'bg-green-100 text-green-700' :
                          project.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {project.status}
                        </Badge>
                      </div>

                      {project.supervisorRemarks && project.supervisorRemarks.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold mb-2">Supervisor Remarks:</h4>
                          {project.supervisorRemarks.map((r, i) => (
                            <div key={i} className="text-sm text-gray-600 mb-1">
                              • {r.remark} ({new Date(r.date).toLocaleDateString()})
                            </div>
                          ))}
                        </div>
                      )}

                      {project.vivaMarks !== undefined && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold">Viva Marks: <span className="text-green-600">{project.vivaMarks}/100</span></h4>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            ) : (
              myProject ? (
                <Card className="p-8">
                  <h3 className="text-gray-900 mb-4">{myProject.title}</h3>
                  <p className="text-gray-600 mb-4">{myProject.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Supervisor</p>
                      <p className="font-semibold">{myProject.supervisor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={
                        myProject.status === 'approved' ? 'bg-green-100 text-green-700' :
                        myProject.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {myProject.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project ID</p>
                      <p className="font-mono text-sm">{myProject.id}</p>
                    </div>
                    {myProject.vivaMarks !== undefined && (
                      <div>
                        <p className="text-sm text-gray-500">Viva Marks</p>
                        <p className="text-lg font-bold text-green-600">{myProject.vivaMarks}/100</p>
                      </div>
                    )}
                  </div>

                  {myProject.supervisorRemarks && myProject.supervisorRemarks.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Supervisor Remarks</h4>
                      <div className="space-y-2">
                        {myProject.supervisorRemarks.map((r, i) => (
                          <div key={i} className="bg-blue-50 p-3 rounded">
                            <p className="text-gray-700">{r.remark}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(r.date).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {myProject.meetings && myProject.meetings.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Scheduled Meetings</h4>
                      <div className="space-y-2">
                        {myProject.meetings.map((m, i) => (
                          <div key={i} className="bg-purple-50 p-3 rounded">
                            <p className="font-semibold">{new Date(m.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-700">Agenda: {m.agenda}</p>
                            {m.notes && <p className="text-sm text-gray-600 mt-1">Notes: {m.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {myProject.reviews && myProject.reviews.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Reviews</h4>
                      <div className="space-y-2">
                        {myProject.reviews.map((r, i) => (
                          <div key={i} className="bg-green-50 p-3 rounded">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-gray-700">{r.review}</p>
                              <Badge className="bg-green-200 text-green-800">{r.rating}/10</Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(r.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {myProject.committeeMembers && myProject.committeeMembers.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Committee Members</h4>
                      <div className="flex gap-2 flex-wrap">
                        {myProject.committeeMembers.map((member, i) => (
                          <Badge key={i} variant="outline">{member}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">You haven't submitted any FYP proposal yet</p>
                  <Button onClick={() => setActiveTab('submit')} className="mt-4">
                    Submit Proposal
                  </Button>
                </Card>
              )
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="supervisor">
              <Card className="p-8">
                <h3 className="text-gray-900 mb-6">Supervisor Panel</h3>

                <div className="space-y-6">
                  {/* Project Selection */}
                  <div className="space-y-2">
                    <Label>Select Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project to manage" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title} - {p.studentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProject && (
                    <div className="space-y-8 pt-4">
                      {/* Add Remark */}
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={20} className="text-blue-600" />
                          <h4 className="font-semibold">Add Remark</h4>
                        </div>
                        <Textarea
                          placeholder="Enter your remark..."
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={handleAddRemark}>Add Remark</Button>
                      </div>

                      {/* Schedule Meeting */}
                      <div className="space-y-3 p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar size={20} className="text-purple-600" />
                          <h4 className="font-semibold">Schedule Meeting</h4>
                        </div>
                        <Input
                          type="datetime-local"
                          value={meetingDate}
                          onChange={(e) => setMeetingDate(e.target.value)}
                        />
                        <Input
                          placeholder="Meeting agenda"
                          value={meetingAgenda}
                          onChange={(e) => setMeetingAgenda(e.target.value)}
                        />
                        <Textarea
                          placeholder="Additional notes (optional)"
                          value={meetingNotes}
                          onChange={(e) => setMeetingNotes(e.target.value)}
                          rows={2}
                        />
                        <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
                      </div>

                      {/* Add Review */}
                      <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={20} className="text-green-600" />
                          <h4 className="font-semibold">Add Review</h4>
                        </div>
                        <Textarea
                          placeholder="Write your review..."
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          rows={4}
                        />
                        <Select value={rating} onValueChange={setRating}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating (1-10)" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n}/10
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddReview}>Submit Review</Button>
                      </div>

                      {/* Set Viva Marks */}
                      <div className="space-y-3 p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award size={20} className="text-orange-600" />
                          <h4 className="font-semibold">Set Viva Marks</h4>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter marks (0-100)"
                          value={vivaMarks}
                          onChange={(e) => setVivaMarks(e.target.value)}
                        />
                        <Button onClick={handleSetVivaMarks}>Update Viva Marks</Button>
                      </div>

                      {/* Assign Committee */}
                      <div className="space-y-3 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users size={20} className="text-indigo-600" />
                          <h4 className="font-semibold">Assign Committee Members</h4>
                        </div>
                        <div className="space-y-2">
                          {committeeOptions.map((member) => (
                            <label key={member} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={committeeSelection.includes(member)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCommitteeSelection([...committeeSelection, member]);
                                  } else {
                                    setCommitteeSelection(committeeSelection.filter(m => m !== member));
                                  }
                                }}
                              />
                              <span>{member}</span>
                            </label>
                          ))}
                        </div>
                        <Button onClick={handleSetCommittee}>Assign Committee</Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
