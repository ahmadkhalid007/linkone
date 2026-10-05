import { useState } from 'react';
import { Lightbulb, Users, CheckCircle2, ArrowRight, GraduationCap, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FYPProposalForm } from './FYPProposalForm';
import { MyFYP } from './MyFYP';

export function FYP() {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (showProposalForm) {
    return <FYPProposalForm onBack={() => setShowProposalForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-gray-900 mb-4">Final Year Project (FYP) Allocation</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit your project proposal, select your preferred supervisor, and track your FYP approval process
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <Lightbulb size={18} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="my-fyp" className="gap-2">
              <FileText size={18} />
              My FYP
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Propose Your Idea</h3>
                    <p className="text-gray-600">
                      Submit your innovative project idea with detailed description and objectives
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Select Supervisor</h3>
                    <p className="text-gray-600">
                      Choose your preferred supervisor based on their expertise and availability
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Get Approval</h3>
                    <p className="text-gray-600">
                      Your proposal will be reviewed by your supervisor and HOD for approval
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Approval Process */}
            <Card className="p-8 mb-8">
              <h2 className="text-gray-900 mb-6">FYP Approval Process</h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-gray-900 mb-2">Submit Proposal</h3>
                  <p className="text-gray-600">
                    Fill in project details and select supervisor
                  </p>
                </div>

                <ArrowRight className="text-gray-400 hidden md:block" size={24} />

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-gray-900 mb-2">Supervisor Review</h3>
                  <p className="text-gray-600">
                    Supervisor evaluates your proposal
                  </p>
                </div>

                <ArrowRight className="text-gray-400 hidden md:block" size={24} />

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-gray-900 mb-2">HOD Approval</h3>
                  <p className="text-gray-600">
                    Final approval from Head of Department
                  </p>
                </div>

                <ArrowRight className="text-gray-400 hidden md:block" size={24} />

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="text-white" size={32} />
                  </div>
                  <h3 className="text-gray-900 mb-2">Project Allocated</h3>
                  <p className="text-gray-600">
                    Begin working on your FYP
                  </p>
                </div>
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="p-8 mb-8">
              <h2 className="text-gray-900 mb-4">Submission Guidelines</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>Ensure your project title is clear and concise</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>Provide a detailed description of your project objectives and methodology</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>Select a supervisor whose expertise aligns with your project domain</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>Include relevant technologies, tools, and expected outcomes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>Attach any supporting documents (research papers, diagrams, etc.)</span>
                </li>
              </ul>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setShowProposalForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Submit FYP Proposal
              </Button>
            </div>
          </TabsContent>

          {/* My FYP Tab */}
          <TabsContent value="my-fyp">
            <MyFYP />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}