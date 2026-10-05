import { ArrowRight, CheckCircle, Zap, Shield, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onGetStarted: () => void;
  onOpenAuth?: (mode: 'login' | 'signup', type: 'student' | 'admin') => void;
}

export function Hero({ onGetStarted, onOpenAuth }: HeroProps) {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Welcome Message for Logged-in Users */}
        {isAuthenticated && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon className="text-white" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Welcome back, {user?.name}! 👋
                </h3>
                <p className="text-white/90">
                  {isAdmin 
                    ? `You're logged in as ${user?.adminRole?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}. Manage all university operations.`
                    : 'You can now submit applications, track their status, and manage your academic activities.'
                  }
                </p>
              </div>
              {isAdmin ? (
                <Badge className="bg-white/20 text-white border-white/30 hidden md:block">
                  Admin Account
                </Badge>
              ) : (
                <Badge className="bg-white/20 text-white border-white/30 hidden md:block">
                  Student Account
                </Badge>
              )}
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              Streamlined Student Services
            </div>
            <h1 className="text-gray-900 mb-6">
              Comprehensive Web-Based System
            </h1>
            <p className="text-gray-600 mb-8">
              A comprehensive web-based system that automates and streamlines student applications, 
              approvals, and administrative processes with efficiency and transparency.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700">Automated approval workflows</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700">Real-time status tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700">Multi-level approvals system</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700">Conflict detection & resolution</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={onGetStarted}>
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 mb-2">4</div>
              <p className="text-gray-600">Automated Modules</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600">System Availability</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-green-600 mb-2">100%</div>
              <p className="text-gray-600">Digital Process</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-orange-600 mb-2">Fast</div>
              <p className="text-gray-600">Approval Times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}