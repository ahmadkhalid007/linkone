import { Card } from './ui/card';
import { ArrowRight, UserCircle, FileText, CheckCircle, Eye } from 'lucide-react';

export function SystemWorkflowGuide() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A seamless workflow connecting students and administrators for efficient application processing
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircle className="text-blue-600" size={32} />
            </div>
            <h3 className="text-gray-900 mb-2">1. Student Submits</h3>
            <p className="text-gray-600">
              Students log in and submit appeals or FYP proposals through the system
            </p>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-purple-600" size={32} />
            </div>
            <h3 className="text-gray-900 mb-2">2. Admin Reviews</h3>
            <p className="text-gray-600">
              Applications appear in admin dashboard for review based on their role
            </p>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-gray-900 mb-2">3. Multi-Level Approval</h3>
            <p className="text-gray-600">
              Admins approve and forward applications through the approval hierarchy
            </p>
          </Card>

          {/* Step 4 */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="text-orange-600" size={32} />
            </div>
            <h3 className="text-gray-900 mb-2">4. Real-Time Tracking</h3>
            <p className="text-gray-600">
              Students track their applications in real-time with detailed progress updates
            </p>
          </Card>
        </div>

        {/* Role-Based Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
            <h3 className="text-blue-900 mb-4">For Students</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ArrowRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Submit appeals and FYP proposals</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Track application status with tracking IDs</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">View detailed approval timeline</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">See reviewer comments and feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Access allocated FYP details</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-purple-900 mb-4">For Administrators</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ArrowRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Role-based access and filtering</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Review applications at your approval level</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Approve, reject, or forward applications</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Add comments and feedback for students</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Export reports and analytics</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
