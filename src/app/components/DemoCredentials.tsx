import { Info, User, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function DemoCredentials() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Info className="text-amber-600" size={24} />
        </div>
        <div>
          <h3 className="text-amber-900 font-semibold mb-1">Demo System - Test Credentials</h3>
          <p className="text-amber-700">
            Use these credentials to explore the system as different user types
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Student Credentials */}
        <Card className="p-4 bg-white border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-blue-600" size={20} />
            <h4 className="text-blue-900 font-semibold">Student Access</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600">Email:</p>
              <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">student@university.edu</code>
            </div>
            <div>
              <p className="text-gray-600">Password:</p>
              <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">password123</code>
            </div>
            <Badge className="bg-blue-100 text-blue-700 mt-2">
              Submit appeals & FYP proposals
            </Badge>
          </div>
        </Card>

        {/* Admin Credentials */}
        <Card className="p-4 bg-white border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-purple-600" size={20} />
            <h4 className="text-purple-900 font-semibold">Admin Access</h4>
          </div>
          <div className="space-y-3 text-sm">
            {/* Teacher/Supervisor */}
            <div className="pb-2 border-b border-gray-100">
              <Badge className="bg-green-100 text-green-700 mb-2">Teacher (Supervisor)</Badge>
              <div className="space-y-1">
                <div>
                  <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">teacher@university.edu</code>
                </div>
                <div>
                  <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">teacher123</code>
                </div>
              </div>
            </div>

            {/* Department Head */}
            <div className="pb-2 border-b border-gray-100">
              <Badge className="bg-indigo-100 text-indigo-700 mb-2">Department Head</Badge>
              <div className="space-y-1">
                <div>
                  <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">hod@university.edu</code>
                </div>
                <div>
                  <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">hod123</code>
                </div>
              </div>
            </div>

            {/* Vice Chancellor */}
            <div>
              <Badge className="bg-purple-100 text-purple-700 mb-2">Vice Chancellor</Badge>
              <div className="space-y-1">
                <div>
                  <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">vc@university.edu</code>
                </div>
                <div>
                  <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">vc123</code>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <p className="text-amber-700 text-sm mt-4 text-center">
        💡 Any password will work in demo mode. Try logging in as different roles to see role-based features!
      </p>
    </div>
  );
}
