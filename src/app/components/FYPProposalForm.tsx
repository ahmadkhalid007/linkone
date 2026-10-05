import { ArrowLeft, Upload, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SuccessAnimation } from './SuccessAnimation';
import { generateTrackingId, storeApplication } from '../utils/trackingIdGenerator';
import { useAuth } from '../contexts/AuthContext';

interface FYPProposalFormProps {
  onBack: () => void;
}

export function FYPProposalForm({ onBack }: FYPProposalFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    email: '',
    department: '',
    program: '',
    semester: '',
    projectTitle: '',
    projectCategory: '',
    projectDescription: '',
    objectives: '',
    methodology: '',
    expectedOutcomes: '',
    technologies: '',
    supervisor: '',
    coSupervisor: '',
    teamMembers: '',
  });

  // Auto-fill form with logged-in user's data
  useEffect(() => {
    if (user && user.role === 'student') {
      setFormData(prev => ({
        ...prev,
        studentId: user.studentId || '',
        studentName: user.name || '',
        email: user.email || '',
        department: user.department || '',
      }));
    }
  }, [user]);

  const [files, setFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const supervisors = [
    { id: 'supervisor1', name: 'Dr. Hassan Khan', expertise: 'Machine Learning, AI' },
    { id: 'supervisor2', name: 'Dr. Sana Malik', expertise: 'Software Engineering, Web Development' },
    { id: 'supervisor3', name: 'Dr. Fahad Sheikh', expertise: 'Computer Networks, Security' },
    { id: 'supervisor4', name: 'Prof. Amir Mahmood', expertise: 'Database Systems, Big Data' },
    { id: 'supervisor5', name: 'Dr. Bilal Haider', expertise: 'IoT, Embedded Systems' },
    { id: 'supervisor6', name: 'Dr. Ayesha Saeed', expertise: 'Mobile App Development, UI/UX' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate tracking ID
    const newTrackingId = generateTrackingId('FYP Proposal');
    setTrackingId(newTrackingId);
    
    // Get supervisor name
    const selectedSupervisor = supervisors.find(s => s.id === formData.supervisor);
    
    // Store application data
    const applicationData = {
      type: 'FYP Proposal',
      studentId: formData.studentId,
      studentName: formData.studentName,
      studentEmail: formData.email,
      department: formData.department,
      status: 'pending',
      currentStage: 'Supervisor',
      projectTitle: formData.projectTitle,
      projectCategory: formData.projectCategory,
      supervisor: selectedSupervisor?.name || '',
      stages: [
        { name: 'Supervisor', status: 'pending', date: null, approver: null },
        { name: 'Department Head', status: 'pending', date: null, approver: null },
      ],
      formData: formData,
    };
    
    storeApplication(newTrackingId, applicationData);
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // Reset form
    setFormData({
      studentId: '',
      studentName: '',
      email: '',
      department: '',
      program: '',
      semester: '',
      projectTitle: '',
      projectCategory: '',
      projectDescription: '',
      objectives: '',
      methodology: '',
      expectedOutcomes: '',
      technologies: '',
      supervisor: '',
      coSupervisor: '',
      teamMembers: '',
    });
    setFiles([]);
    onBack();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to FYP
        </button>

        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-gray-900 mb-2">FYP Proposal Submission</h2>
          <p className="text-gray-600">Fill in all the details about your Final Year Project proposal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          <div className="space-y-8">
            {/* Student Information */}
            <div>
              <h3 className="text-gray-900 mb-4">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    required
                    placeholder="e.g., 2021-CS-001"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Full Name *</Label>
                  <Input
                    id="studentName"
                    required
                    placeholder="Ali Ahmad"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="bioinformatics">Bioinformatics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program *</Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => setFormData({ ...formData, program: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bs">Bachelor of Science</SelectItem>
                      <SelectItem value="ms">Master of Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester *</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) => setFormData({ ...formData, semester: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7th Semester</SelectItem>
                      <SelectItem value="8">8th Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div>
              <h3 className="text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    required
                    placeholder="e.g., AI-Powered Student Management System"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectCategory">Project Category *</Label>
                  <Select
                    value={formData.projectCategory}
                    onValueChange={(value) => setFormData({ ...formData, projectCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-ml">Artificial Intelligence & Machine Learning</SelectItem>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                      <SelectItem value="mobile-dev">Mobile App Development</SelectItem>
                      <SelectItem value="iot">Internet of Things</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="cloud">Cloud Computing</SelectItem>
                      <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                      <SelectItem value="game-dev">Game Development</SelectItem>
                      <SelectItem value="robotics">Robotics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description *</Label>
                  <Textarea
                    id="projectDescription"
                    required
                    placeholder="Provide a detailed description of your project, including the problem statement..."
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">Project Objectives *</Label>
                  <Textarea
                    id="objectives"
                    required
                    placeholder="List the main objectives of your project..."
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodology">Methodology *</Label>
                  <Textarea
                    id="methodology"
                    required
                    placeholder="Describe the methodology and approach you will use to complete this project..."
                    value={formData.methodology}
                    onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
                  <Textarea
                    id="expectedOutcomes"
                    required
                    placeholder="What are the expected outcomes and deliverables of this project..."
                    value={formData.expectedOutcomes}
                    onChange={(e) => setFormData({ ...formData, expectedOutcomes: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies & Tools *</Label>
                  <Input
                    id="technologies"
                    required
                    placeholder="e.g., Python, TensorFlow, React, Node.js, MongoDB"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Supervisor Selection */}
            <div>
              <h3 className="text-gray-900 mb-4">Supervisor Selection</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Primary Supervisor *</Label>
                  <Select
                    value={formData.supervisor}
                    onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.name} - {supervisor.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coSupervisor">Co-Supervisor (Optional)</Label>
                  <Select
                    value={formData.coSupervisor}
                    onValueChange={(value) => setFormData({ ...formData, coSupervisor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select co-supervisor (if any)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {supervisors.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.name} - {supervisor.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div>
              <h3 className="text-gray-900 mb-4">Team Information</h3>
              <div className="space-y-2">
                <Label htmlFor="teamMembers">Team Members (Optional)</Label>
                <Textarea
                  id="teamMembers"
                  placeholder="List your team members with their IDs and names (one per line)&#10;e.g., 2021-CS-002 - Fatima Noor"
                  value={formData.teamMembers}
                  onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                  rows={4}
                />
                <p className="text-gray-500">Maximum 3 members per team (including you)</p>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-gray-900 mb-4">Supporting Documents</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">Upload files</span>
                  <span className="text-gray-600"> or drag and drop</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-gray-500 mt-2">PDF, DOC, DOCX (Research papers, diagrams, etc.)</p>
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-700">{files.length} file(s) selected</p>
                    <ul className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <li key={index} className="text-gray-600">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Send className="mr-2" size={20} />
                Submit FYP Proposal
              </Button>
            </div>
          </div>
        </form>
      </div>
      {showSuccess && (
        <SuccessAnimation 
          title="FYP Proposal Submitted!"
          message="Your proposal has been submitted and is pending supervisor review. You can track its status in the Status section."
          trackingId={trackingId}
          onComplete={handleSuccessComplete} 
        />
      )}
    </div>
  );
}