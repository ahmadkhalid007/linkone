import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onClose: () => void;
}

export function AdminLogin({ onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminRole) {
      toast.error('Please select your role', {
        description: 'You must select your administrative role to continue.',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Check if teacher exists in university database
      const teachersData = localStorage.getItem('university-teachers');
      const teachers = teachersData ? JSON.parse(teachersData) : [];
      
      const teacher = teachers.find((t: any) => 
        t.email === email && 
        t.password === password &&
        t.role === adminRole
      );
      
      if (!teacher) {
        toast.error('Login failed', {
          description: 'Invalid credentials or role mismatch. Please contact the administrator.',
        });
        setIsLoading(false);
        return;
      }
      
      await login(email, password, 'admin', adminRole);
      toast.success('Admin login successful!', {
        description: 'Welcome to the admin dashboard.',
      });
      onClose();
    } catch (error) {
      toast.error('Login failed', {
        description: 'Invalid admin credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Shield className="text-white" size={32} />
        </div>
        <h2 className="text-gray-900 mb-2">Admin Portal</h2>
        <p className="text-gray-600">Log in to manage student applications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admin-role">Select Your Role</Label>
          <Select value={adminRole} onValueChange={setAdminRole}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your administrative role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course_coordinator">Course Coordinator</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="department_head">Department Head</SelectItem>
              <SelectItem value="vice_chancellor">Vice Chancellor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="admin-password">Password</Label>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Note:</strong> This login is for authorized administrators only. 
            Unauthorized access attempts will be logged.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In to Admin Portal'}
          {!isLoading && <ArrowRight className="ml-2" size={20} />}
        </Button>
      </form>
    </div>
  );
}