import { useState, useEffect } from 'react';
import { GraduationCap, Send, MessageSquare, Award } from 'lucide-react';
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

interface Thesis {
  id: string;
  title: string;
  abstract: string;
  researchArea: string;
  supervisor: string;
  studentId: string;
  studentName: string;
  status: string;
  submittedAt: string;
  supervisorReviews?: { date: string; review: string; rating: number }[];
  marks?: number;
}

export function ThesisManagement() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'view' | 'supervisor'>('submit');
  
  // Student submission
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  
  // Supervisor panel
  const [selectedThesis, setSelectedThesis] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [marks, setMarks] = useState('');
  
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [myThesis, setMyThesis] = useState<Thesis | null>(null);

  const supervisors = [
    'Dr. Hassan Ali',
    'Dr. Sarah Ahmed',
    'Prof. Amir Hassan',
    'Dr. Fahad Khan',
    'Dr. Ayesha Malik',
    'Dr. Usman Tariq',
  ];

  const researchAreas = [
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Networks',
    'Cybersecurity',
    'Database Systems',
    'Software Engineering',
    'Data Science',
    'Cloud Computing',
  ];

  useEffect(() => {
    loadTheses();
  }, [user]);

  const loadTheses = () => {
    const stored = localStorage.getItem('thesis-submissions');
    const allTheses = stored ? JSON.parse(stored) : [];
    setTheses(allTheses);

    if (user?.studentId) {
      const studentThesis = allTheses.find((t: Thesis) => t.studentId === user.studentId);
      setMyThesis(studentThesis || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || isAdmin) {
      toast.error('Only students can submit thesis proposals');
      return;
    }

    if (!title.trim() || !abstract.trim() || !researchArea || !supervisor) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newTrackingId = `THS-${Date.now().toString().slice(-8)}`;
      setTrackingId(newTrackingId);

      const newThesis: Thesis = {
        id: newTrackingId,
        title: title.trim(),
        abstract: abstract.trim(),
        researchArea: researchArea,
        supervisor: supervisor,
        studentId: user?.studentId || '',
        studentName: user?.name || '',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        supervisorReviews: [],
      };

      const allTheses = [...theses, newThesis];
      localStorage.setItem('thesis-submissions', JSON.stringify(allTheses));
      setTheses(allTheses);
      setMyThesis(newThesis);

      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        setTitle('');
        setAbstract('');
        setResearchArea('');
        setSupervisor('');
        setShowSuccess(false);
        setActiveTab('view');
      }, 3000);
    }, 1500);
  };

  const handleAddReview = () => {
    if (!selectedThesis || !review.trim() || !rating) {
      toast.error('Please provide review and rating');
      return;
    }

    const updatedTheses = theses.map((t) => {
      if (t.id === selectedThesis) {
        return {
          ...t,
          supervisorReviews: [
            ...(t.supervisorReviews || []),
            {
              date: new Date().toISOString(),
              review: review.trim(),
              rating: parseInt(rating),
            },
          ],
        };
      }
      return t;
    });

    localStorage.setItem('thesis-submissions', JSON.stringify(updatedTheses));
    setTheses(updatedTheses);
    setReview('');
    setRating('');
    toast.success('Review added successfully');
  };

  const handleSetMarks = () => {
    if (!selectedThesis || !marks) {
      toast.error('Please enter marks');
      return;
    }

    const marksValue = parseInt(marks);
    if (marksValue < 0 || marksValue > 100) {
      toast.error('Marks must be between 0 and 100');
      return;
    }

    const updatedTheses = theses.map((t) => {
      if (t.id === selectedThesis) {
        return { ...t, marks: marksValue, status: 'evaluated' };
      }
      return t;
    });

    localStorage.setItem('thesis-submissions', JSON.stringify(updatedTheses));
    setTheses(updatedTheses);
    setMarks('');
    toast.success('Marks updated successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600">Please login to access Thesis section</p>
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
            message="Your thesis proposal has been submitted successfully!"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-gray-900 mb-4">Thesis Management</h2>
          <p className="text-gray-600">
            {isAdmin ? 'Manage student thesis submissions' : 'Submit and track your thesis'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {!isAdmin && (
              <TabsTrigger value="submit">Submit Thesis</TabsTrigger>
            )}
            <TabsTrigger value="view">{isAdmin ? 'All Theses' : 'My Thesis'}</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="supervisor">Supervisor Panel</TabsTrigger>
            )}
          </TabsList>

          {!isAdmin && (
            <TabsContent value="submit">
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Thesis Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter thesis title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abstract">Abstract *</Label>
                    <Textarea
                      id="abstract"
                      placeholder="Provide a detailed abstract of your research..."
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      rows={8}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="research-area">Research Area *</Label>
                    <Select value={researchArea} onValueChange={setResearchArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select research area" />
                      </SelectTrigger>
                      <SelectContent>
                        {researchAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : (
                      <>
                        Submit Thesis Proposal
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
                {theses.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600">No thesis submissions yet</p>
                  </Card>
                ) : (
                  theses.map((thesis) => (
                    <Card key={thesis.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-2">{thesis.title}</h3>
                          <p className="text-gray-600 mb-2">{thesis.abstract}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">{thesis.studentName}</Badge>
                            <Badge variant="outline">Supervisor: {thesis.supervisor}</Badge>
                            <Badge variant="outline">{thesis.researchArea}</Badge>
                            <Badge className="bg-blue-100 text-blue-700">{thesis.id}</Badge>
                          </div>
                        </div>
                        <Badge className={
                          thesis.status === 'evaluated' ? 'bg-green-100 text-green-700' :
                          thesis.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {thesis.status}
                        </Badge>
                      </div>

                      {thesis.supervisorReviews && thesis.supervisorReviews.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold mb-2">Supervisor Reviews:</h4>
                          {thesis.supervisorReviews.map((r, i) => (
                            <div key={i} className="bg-green-50 p-3 rounded mb-2">
                              <div className="flex justify-between items-start">
                                <p className="text-gray-700">{r.review}</p>
                                <Badge className="bg-green-200 text-green-800">{r.rating}/10</Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(r.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {thesis.marks !== undefined && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold">
                            Final Marks: <span className="text-green-600">{thesis.marks}/100</span>
                          </h4>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            ) : (
              myThesis ? (
                <Card className="p-8">
                  <h3 className="text-gray-900 mb-4">{myThesis.title}</h3>
                  <p className="text-gray-600 mb-6">{myThesis.abstract}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Research Area</p>
                      <p className="font-semibold">{myThesis.researchArea}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Supervisor</p>
                      <p className="font-semibold">{myThesis.supervisor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={
                        myThesis.status === 'evaluated' ? 'bg-green-100 text-green-700' :
                        myThesis.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {myThesis.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thesis ID</p>
                      <p className="font-mono text-sm">{myThesis.id}</p>
                    </div>
                  </div>

                  {myThesis.marks !== undefined && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Final Evaluation</h4>
                      <p className="text-2xl font-bold text-green-600">{myThesis.marks}/100</p>
                    </div>
                  )}

                  {myThesis.supervisorReviews && myThesis.supervisorReviews.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Supervisor Reviews</h4>
                      <div className="space-y-3">
                        {myThesis.supervisorReviews.map((r, i) => (
                          <div key={i} className="bg-green-50 p-4 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-gray-700 flex-1">{r.review}</p>
                              <Badge className="bg-green-200 text-green-800 ml-2">
                                {r.rating}/10
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(r.date).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">You haven't submitted any thesis yet</p>
                  <Button onClick={() => setActiveTab('submit')} className="mt-4">
                    Submit Thesis
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
                  {/* Thesis Selection */}
                  <div className="space-y-2">
                    <Label>Select Thesis</Label>
                    <Select value={selectedThesis} onValueChange={setSelectedThesis}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a thesis to evaluate" />
                      </SelectTrigger>
                      <SelectContent>
                        {theses.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.title} - {t.studentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedThesis && (
                    <div className="space-y-6 pt-4">
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
                          rows={5}
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

                      {/* Set Final Marks */}
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award size={20} className="text-blue-600" />
                          <h4 className="font-semibold">Set Final Marks</h4>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter marks (0-100)"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                        />
                        <Button onClick={handleSetMarks}>Update Marks</Button>
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
