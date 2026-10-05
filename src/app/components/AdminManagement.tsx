import { useState, useEffect } from 'react';
import { UserPlus, Users, Key, Shield, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  password: string;
  department: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

export function AdminManagement() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  
  // Student management
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  
  // Teacher management
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherRole, setTeacherRole] = useState('');
  const [teacherDepartment, setTeacherDepartment] = useState('');
  
  // Password change
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
  ];

  const roles = [
    'teacher',
    'course_coordinator',
    'director',
    'department_head',
    'vice_chancellor',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStudents = localStorage.getItem('university-students');
    const storedTeachers = localStorage.getItem('university-teachers');
    
    setStudents(storedStudents ? JSON.parse(storedStudents) : []);
    setTeachers(storedTeachers ? JSON.parse(storedTeachers) : []);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !studentEmail.trim() || !studentId.trim() || !studentPassword.trim() || !studentDepartment) {
      toast.error('Please fill all fields');
      return;
    }

    // Check if email already exists
    if (students.some(s => s.email === studentEmail)) {
      toast.error('Student with this email already exists');
      return;
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: studentName.trim(),
      email: studentEmail.trim(),
      studentId: studentId.trim(),
      password: studentPassword.trim(),
      department: studentDepartment,
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('university-students', JSON.stringify(updatedStudents));

    // Also add to login registry
    const users = JSON.parse(localStorage.getItem('link-one-users') || '{}');
    users[studentEmail] = {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      studentId: newStudent.studentId,
      role: 'student',
      department: newStudent.department,
    };
    localStorage.setItem('link-one-users', JSON.stringify(users));

    toast.success(`Student ${studentName} added successfully!`);
    
    // Reset form
    setStudentName('');
    setStudentEmail('');
    setStudentId('');
    setStudentPassword('');
    setStudentDepartment('');
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherName.trim() || !teacherEmail.trim() || !teacherPassword.trim() || !teacherRole || !teacherDepartment) {
      toast.error('Please fill all fields');
      return;
    }

    // Check if email already exists
    if (teachers.some(t => t.email === teacherEmail)) {
      toast.error('Teacher with this email already exists');
      return;
    }

    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name: teacherName.trim(),
      email: teacherEmail.trim(),
      password: teacherPassword.trim(),
      role: teacherRole,
      department: teacherDepartment,
    };

    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);
    localStorage.setItem('university-teachers', JSON.stringify(updatedTeachers));

    toast.success(`Teacher ${teacherName} added successfully!`);
    
    // Reset form
    setTeacherName('');
    setTeacherEmail('');
    setTeacherPassword('');
    setTeacherRole('');
    setTeacherDepartment('');
  };

  const handleChangePassword = () => {
    if (!selectedUser || !newPassword.trim()) {
      toast.error('Please select a user and enter new password');
      return;
    }

    // Update in students
    const updatedStudents = students.map(s => {
      if (s.id === selectedUser) {
        return { ...s, password: newPassword.trim() };
      }
      return s;
    });
    setStudents(updatedStudents);
    localStorage.setItem('university-students', JSON.stringify(updatedStudents));

    // Update in teachers
    const updatedTeachers = teachers.map(t => {
      if (t.id === selectedUser) {
        return { ...t, password: newPassword.trim() };
      }
      return t;
    });
    setTeachers(updatedTeachers);
    localStorage.setItem('university-teachers', JSON.stringify(updatedTeachers));

    toast.success('Password updated successfully!');
    setSelectedUser('');
    setNewPassword('');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      localStorage.setItem('university-students', JSON.stringify(updatedStudents));
      toast.success('Student deleted successfully');
    }
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      const updatedTeachers = teachers.filter(t => t.id !== id);
      setTeachers(updatedTeachers);
      localStorage.setItem('university-teachers', JSON.stringify(updatedTeachers));
      toast.success('Teacher deleted successfully');
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-gray-900 mb-2">Admin Access Required</h3>
            <p className="text-gray-600">Only administrators can access this section</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-600">
            Manage all students and teachers across all departments
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add Student Form */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <UserPlus className="text-blue-600" size={24} />
                  <h3 className="text-gray-900">Add New Student</h3>
                </div>

                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name *</Label>
                    <Input
                      id="student-name"
                      placeholder="Ali Ahmad"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-email">University Email *</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="ali.ahmad@university.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID *</Label>
                    <Input
                      id="student-id"
                      placeholder="2021-CS-123"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password *</Label>
                    <Input
                      id="student-password"
                      type="text"
                      placeholder="Enter password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-dept">Department *</Label>
                    <Select value={studentDepartment} onValueChange={setStudentDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Add Student
                  </Button>
                </form>
              </Card>

              {/* Students List */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-blue-600" size={24} />
                  <h3 className="text-gray-900">All Students ({students.length})</h3>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {students.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No students added yet</p>
                  ) : (
                    students.map((student) => (
                      <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{student.studentId}</Badge>
                              <Badge variant="outline">{student.department}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Password: {student.password}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Change Password Section */}
            <Card className="p-6 mt-8">
              <div className="flex items-center gap-2 mb-6">
                <Key className="text-orange-600" size={24} />
                <h3 className="text-gray-900">Change Student Password</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Button onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add Teacher Form */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <UserPlus className="text-purple-600" size={24} />
                  <h3 className="text-gray-900">Add New Teacher</h3>
                </div>

                <form onSubmit={handleAddTeacher} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-name">Teacher Name *</Label>
                    <Input
                      id="teacher-name"
                      placeholder="Dr. Hassan Ali"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">University Email *</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="hassan.ali@university.edu"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password *</Label>
                    <Input
                      id="teacher-password"
                      type="text"
                      placeholder="Enter password"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-role">Role *</Label>
                    <Select value={teacherRole} onValueChange={setTeacherRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-dept">Department *</Label>
                    <Select value={teacherDepartment} onValueChange={setTeacherDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Add Teacher
                  </Button>
                </form>
              </Card>

              {/* Teachers List */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-purple-600" size={24} />
                  <h3 className="text-gray-900">All Teachers ({teachers.length})</h3>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {teachers.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No teachers added yet</p>
                  ) : (
                    teachers.map((teacher) => (
                      <div key={teacher.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                            <p className="text-sm text-gray-600">{teacher.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className="bg-purple-100 text-purple-700">
                                {teacher.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </Badge>
                              <Badge variant="outline">{teacher.department}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Password: {teacher.password}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
