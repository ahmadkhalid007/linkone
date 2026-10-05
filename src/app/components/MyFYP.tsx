import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, User, Lightbulb, Target, Wrench } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getAllApplicationsArray } from '../utils/trackingIdGenerator';

export function MyFYP() {
  const [fypProject, setFypProject] = useState<any | null>(null);

  useEffect(() => {
    // Load FYP applications from localStorage
    const applications = getAllApplicationsArray();
    const approvedFYP = applications.find(
      (app) => app.type === 'FYP Proposal' && app.status === 'approved'
    );
    setFypProject(approvedFYP);
  }, []);

  if (!fypProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Lightbulb className="text-gray-400" size={48} />
            </div>
            <h2 className="text-gray-900 mb-4">No FYP Allocated Yet</h2>
            <p className="text-gray-600 mb-8">
              You don't have an approved FYP project yet. Submit your proposal in the FYP section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="text-gray-900">My Final Year Project</h2>
              <p className="text-gray-600">Your approved FYP details and progress</p>
            </div>
          </div>
        </div>

        {/* Project Status Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Project Status</p>
              <p className="text-green-600">Approved & Allocated</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Tracking ID</p>
              <p className="font-mono font-semibold text-gray-900">{fypProject.id}</p>
            </div>
          </div>
        </Card>

        {/* Project Details */}
        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="text-blue-600" size={20} />
                <h3 className="text-gray-900">Project Title</h3>
              </div>
              <p className="text-gray-700 pl-7">{fypProject.formData?.projectTitle || fypProject.projectTitle}</p>
            </div>

            {/* Category */}
            <div>
              <p className="text-gray-600 mb-2">Category</p>
              <Badge className="bg-blue-100 text-blue-700">
                {fypProject.formData?.projectCategory || fypProject.projectCategory}
              </Badge>
            </div>

            {/* Supervisor */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="text-purple-600" size={20} />
                <h3 className="text-gray-900">Supervisor</h3>
              </div>
              <p className="text-gray-700 pl-7">{fypProject.supervisor}</p>
            </div>

            {/* Submission Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-gray-600" size={20} />
                <h3 className="text-gray-900">Submitted On</h3>
              </div>
              <p className="text-gray-700 pl-7">
                {new Date(fypProject.submittedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Project Description */}
        {fypProject.formData?.projectDescription && (
          <Card className="p-8 mb-6">
            <h3 className="text-gray-900 mb-4">Project Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fypProject.formData.projectDescription}
            </p>
          </Card>
        )}

        {/* Objectives */}
        {fypProject.formData?.objectives && (
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-blue-600" size={20} />
              <h3 className="text-gray-900">Objectives</h3>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
              {fypProject.formData.objectives}
            </p>
          </Card>
        )}

        {/* Methodology */}
        {fypProject.formData?.methodology && (
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="text-purple-600" size={20} />
              <h3 className="text-gray-900">Methodology</h3>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
              {fypProject.formData.methodology}
            </p>
          </Card>
        )}

        {/* Technologies */}
        {fypProject.formData?.technologies && (
          <Card className="p-8 mb-6">
            <h3 className="text-gray-900 mb-4">Technologies</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fypProject.formData.technologies}
            </p>
          </Card>
        )}

        {/* Expected Outcomes */}
        {fypProject.formData?.expectedOutcomes && (
          <Card className="p-8 mb-6">
            <h3 className="text-gray-900 mb-4">Expected Outcomes</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fypProject.formData.expectedOutcomes}
            </p>
          </Card>
        )}

        {/* Team Members */}
        {fypProject.formData?.teamMembers && (
          <Card className="p-8">
            <h3 className="text-gray-900 mb-4">Team Members</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fypProject.formData.teamMembers}
            </p>
          </Card>
        )}

        {/* Success Message */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 mt-0.5" size={24} />
            <div>
              <p className="text-green-700 font-semibold mb-1">Project Approved!</p>
              <p className="text-green-600">
                Your FYP proposal has been approved. Please coordinate with your supervisor{' '}
                <span className="font-semibold">{fypProject.supervisor}</span> for next steps and timeline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
