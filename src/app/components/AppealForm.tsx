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

interface AppealFormProps {
  appealType: {
    id: string;
    title: string;
    description: string;
    iconColor: string;
  };
  onBack: () => void;
}

export function AppealForm({ appealType, onBack }: AppealFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    email: '',
    department: '',
    program: '',
    semester: '',
    reason: '',
    additionalInfo: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate tracking ID
    const newTrackingId = generateTrackingId(appealType.title);
    setTrackingId(newTrackingId);
    
    // Store application data
    const applicationData = {
      type: appealType.title,
      studentId: formData.studentId,
      studentName: formData.studentName,
      studentEmail: formData.email,
      department: formData.department,
      status: 'pending',
      currentStage: 'Course Coordinator',
      stages: [
        { name: 'Course Coordinator', status: 'pending', date: null, approver: null },
        { name: 'Director', status: 'pending', date: null, approver: null },
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
      reason: '',
      additionalInfo: '',
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
          Back to Appeals
        </button>

        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-gray-900 mb-2">{appealType.title}</h2>
          <p className="text-gray-600">{appealType.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          <div className="space-y-6">
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
                      <SelectItem value="phd">PhD</SelectItem>
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
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                      <SelectItem value="3">3rd Semester</SelectItem>
                      <SelectItem value="4">4th Semester</SelectItem>
                      <SelectItem value="5">5th Semester</SelectItem>
                      <SelectItem value="6">6th Semester</SelectItem>
                      <SelectItem value="7">7th Semester</SelectItem>
                      <SelectItem value="8">8th Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Appeal Details */}
            <div>
              <h3 className="text-gray-900 mb-4">Appeal Details</h3>
              <div className="space-y-4">
                {appealType.id === 'cross-department' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course Name *</Label>
                      <Input
                        id="courseName"
                        required
                        placeholder="e.g., Data Structures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseCode">Course Code *</Label>
                      <Input
                        id="courseCode"
                        required
                        placeholder="e.g., CS-201"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetDepartment">Target Department *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="ee">Electrical Engineering</SelectItem>
                          <SelectItem value="me">Mechanical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {appealType.id === 'leave-management' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="leaveType">Leave Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Medical Leave</SelectItem>
                          <SelectItem value="emergency">Emergency Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input id="startDate" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input id="endDate" type="date" required />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Appeal *</Label>
                  <Textarea
                    id="reason"
                    required
                    placeholder="Please provide detailed reasons for your appeal..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional information that supports your appeal..."
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    rows={3}
                  />
                </div>
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
                <p className="text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
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
              <Button type="submit" className="flex-1">
                <Send className="mr-2" size={20} />
                Submit Appeal
              </Button>
            </div>
          </div>
        </form>

        {/* Success Animation */}
        {showSuccess && (
          <SuccessAnimation
            title="Application Submitted!"
            message="Your application has been submitted and is pending approval. You can track its status in the Status section."
            trackingId={trackingId}
            onComplete={handleSuccessComplete}
          />
        )}
      </div>
    </div>
  );
}