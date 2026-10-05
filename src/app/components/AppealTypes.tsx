import { BookOpen, CheckSquare, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';
import { AppealForm } from './AppealForm';

interface AppealTypesProps {
  onSelectAppeal: () => void;
}

export function AppealTypes({ onSelectAppeal }: AppealTypesProps) {
  const [selectedAppealType, setSelectedAppealType] = useState<string | null>(null);

  const appealTypes = [
    {
      id: 'cross-department',
      icon: BookOpen,
      title: 'Cross-Department Registration',
      description: 'Students can register for failed courses in other departments with automated approval workflow',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'multi-level',
      icon: CheckSquare,
      title: 'Multi-Level Approvals',
      description: 'Sequential approvals from course coordinators, directors, and department heads',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 'leave-management',
      icon: FileText,
      title: 'Leave Management',
      description: 'Submit and track medical/other leave applications through proper channels',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      id: 'timetable-clash',
      icon: Calendar,
      title: 'Timetable Clash Detection',
      description: 'Automatically detect and resolve course scheduling conflicts',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  if (selectedAppealType) {
    const appeal = appealTypes.find(a => a.id === selectedAppealType);
    return (
      <AppealForm 
        appealType={appeal!} 
        onBack={() => setSelectedAppealType(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Application Modules
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a module below to submit your application. Each application follows a multi-level approval workflow.
          </p>
        </div>

        {/* Appeal Types - Vertical Layout */}
        <div className="space-y-4 mb-16">
          {appealTypes.map((appeal) => {
            const Icon = appeal.icon;
            return (
              <div
                key={appeal.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden"
                onClick={() => setSelectedAppealType(appeal.id)}
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Icon Section */}
                  <div className={`flex-shrink-0 p-4 rounded-xl ${appeal.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={appeal.iconColor} size={32} />
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:${appeal.color} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                      {appeal.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {appeal.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white mb-4">How It Works</h3>
            <p className="text-blue-50 mb-6 leading-relaxed">
              Each application goes through a structured approval process. You'll receive a unique tracking ID 
              to monitor your application status at every stage. Our system ensures transparency and timely processing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => {/* Navigate to status */}}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Track Application
              </button>
              <button className="px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}