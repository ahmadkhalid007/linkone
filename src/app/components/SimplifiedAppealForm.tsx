import { useState } from 'react';
import { FileText, Send, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { SuccessAnimation } from './SuccessAnimation';

export function SimplifiedAppealForm() {
  const { isAuthenticated, user } = useAuth();
  const [appealType, setAppealType] = useState('');
  const [customAppealType, setCustomAppealType] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  // Load custom appeal types from localStorage
  const getCustomAppealTypes = () => {
    const stored = localStorage.getItem('custom-appeal-types');
    return stored ? JSON.parse(stored) : [];
  };

  const [customTypes, setCustomTypes] = useState<string[]>(getCustomAppealTypes());

  const defaultAppealTypes = [
    'Cross-Department Registration',
    'Leave Application',
    'Grade Reconsideration',
    'Course Withdrawal',
    'Fee Concession',
    'Examination Appeal',
  ];

  const allAppealTypes = [...defaultAppealTypes, ...customTypes];

  const handleCreateCustomType = () => {
    if (customAppealType.trim()) {
      const updatedTypes = [...customTypes, customAppealType.trim()];
      setCustomTypes(updatedTypes);
      localStorage.setItem('custom-appeal-types', JSON.stringify(updatedTypes));
      setAppealType(customAppealType.trim());
      setCustomAppealType('');
      setIsCreatingCustom(false);
      toast.success('Custom appeal type created!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit an appeal');
      return;
    }

    if (!appealType) {
      toast.error('Please select an appeal type');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate tracking ID
      const newTrackingId = `AP-${Date.now().toString().slice(-8)}`;
      setTrackingId(newTrackingId);

      // Save to localStorage
      const appeals = JSON.parse(localStorage.getItem('student-appeals') || '[]');
      const newAppeal = {
        id: newTrackingId,
        studentId: user?.studentId,
        studentName: user?.name,
        studentEmail: user?.email,
        type: appealType,
        reason: reason,
        attachments: attachments ? Array.from(attachments).map(f => f.name) : [],
        status: 'pending',
        currentStage: 'course_coordinator',
        submittedAt: new Date().toISOString(),
        timeline: [
          {
            stage: 'submitted',
            status: 'completed',
            date: new Date().toISOString(),
            actor: user?.name,
          },
        ],
      };

      appeals.push(newAppeal);
      localStorage.setItem('student-appeals', JSON.stringify(appeals));

      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form after showing success
      setTimeout(() => {
        setAppealType('');
        setReason('');
        setAttachments(null);
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600">
              Please login to submit an appeal
            </p>
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
            message="Your appeal has been submitted successfully!"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-gray-900 mb-4">Submit Appeal</h2>
          <p className="text-gray-600">
            Select an appeal type and provide necessary details
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appeal Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="appeal-type">Appeal Type *</Label>
              {!isCreatingCustom ? (
                <div className="flex gap-2">
                  <Select value={appealType} onValueChange={setAppealType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select appeal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAppealTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreatingCustom(true)}
                  >
                    <Plus size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom appeal type"
                    value={customAppealType}
                    onChange={(e) => setCustomAppealType(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleCreateCustomType}>
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreatingCustom(false);
                      setCustomAppealType('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason / Details *</Label>
              <Textarea
                id="reason"
                placeholder="Provide detailed reason for your appeal..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={6}
                required
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Optional)</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={(e) => setAttachments(e.target.files)}
              />
              <p className="text-sm text-gray-500">
                Upload supporting documents (PDF, images, etc.)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit Appeal
                    <Send className="ml-2" size={20} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
