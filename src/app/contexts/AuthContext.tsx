import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  role: 'student' | 'admin';
  adminRole?: 'teacher' | 'course_coordinator' | 'director' | 'department_head' | 'vice_chancellor';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'admin', adminRole?: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'admin', studentId?: string, department?: string, adminRole?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('link-one-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'admin' = 'student', adminRole?: string) => {
    // Mock login - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let userData: User;
    
    // Simulate successful login
    if (role === 'admin') {
      // Load from teachers database
      const teachersData = localStorage.getItem('university-teachers');
      const teachers = teachersData ? JSON.parse(teachersData) : [];
      const teacher = teachers.find((t: any) => t.email === email);
      
      userData = {
        id: teacher?.id || `admin-${Date.now()}`,
        name: teacher?.name || 'Admin User',
        email: email,
        role: 'admin',
        adminRole: (adminRole || teacher?.role) as any,
        department: teacher?.department || 'Administration',
      };
    } else {
      // Load from students database
      const studentsData = localStorage.getItem('university-students');
      const students = studentsData ? JSON.parse(studentsData) : [];
      const student = students.find((s: any) => s.email === email);
      
      userData = {
        id: student?.id || `student-${Date.now()}`,
        name: student?.name || 'Student User',
        email: email,
        studentId: student?.studentId || `STU-${Date.now().toString().slice(-6)}`,
        role: 'student',
        department: student?.department,
      };
    }
    
    setUser(userData);
    localStorage.setItem('link-one-user', JSON.stringify(userData));
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'admin' = 'student', studentId?: string, department?: string, adminRole?: string) => {
    // Mock signup - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful signup
    const userData: User = {
      id: role === 'admin' ? `admin-${Date.now()}` : `student-${Date.now()}`,
      name: name,
      email: email,
      studentId: studentId,
      role: role,
      department: department,
      adminRole: adminRole as any,
    };
    
    setUser(userData);
    localStorage.setItem('link-one-user', JSON.stringify(userData));
    
    // Store user in users registry
    const storedUsers = JSON.parse(localStorage.getItem('link-one-users') || '{}');
    storedUsers[email] = userData;
    localStorage.setItem('link-one-users', JSON.stringify(storedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('link-one-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}