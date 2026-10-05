import { Menu, X, LogOut, User, FileText, Users, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: 'home' | 'appeal' | 'fyp' | 'thesis' | 'status' | 'contact' | 'about' | 'admin' | 'admin-management' | 'my-applications') => void;
  onOpenAuth: (type: 'student' | 'admin') => void;
}

export function Navigation({ currentSection, onNavigate, onOpenAuth }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', showForAdmin: true, showForStudent: true },
    { id: 'appeal', label: 'Appeal', showForAdmin: false, showForStudent: true },
    { id: 'fyp', label: 'FYP', showForAdmin: true, showForStudent: true },
    { id: 'thesis', label: 'Thesis', showForAdmin: true, showForStudent: true },
    ...(isAuthenticated && !isAdmin ? [{ id: 'my-applications', label: 'My Applications', showForAdmin: false, showForStudent: true }] : []),
    { id: 'status', label: 'Status', showForAdmin: false, showForStudent: true },
    { id: 'contact', label: 'Contact Us', showForAdmin: true, showForStudent: true },
    { id: 'about', label: 'About', showForAdmin: true, showForStudent: true },
    ...(isAdmin ? [
      { id: 'admin', label: 'Dashboard', showForAdmin: true, showForStudent: false },
      { id: 'admin-management', label: 'User Management', showForAdmin: true, showForStudent: false }
    ] : []),
  ] as const;

  // Filter nav items based on user type
  const filteredNavItems = navItems.filter(item => {
    if (!isAuthenticated) return item.showForStudent; // Show student nav for non-authenticated users
    if (isAdmin) return item.showForAdmin;
    return item.showForStudent;
  });

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">L1</span>
            </div>
            <span className="ml-2 text-gray-900 font-bold">Link One</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`px-4 py-2 rounded-md transition-colors font-bold ${
                  currentSection === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Button variant="outline" onClick={() => onNavigate('status')}>
                    Track Status
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white">{user?.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {isAdmin ? 'Admin Account' : 'My Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2" size={16} />
                      Profile
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => onNavigate('status')}
                      >
                        My Applications
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => onNavigate('admin')}
                      >
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="mr-2" size={16} />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onOpenAuth('student')}>
                  Log In
                </Button>
                <Button onClick={() => onOpenAuth('student')}>
                  Sign Up
                </Button>
                <Button 
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={() => onOpenAuth('admin')}
                >
                  Admin
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md transition-colors font-bold ${
                  currentSection === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-gray-900">{user?.name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                    {isAdmin && user?.adminRole && (
                      <p className="text-blue-600 mt-1">
                        {user.adminRole.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </p>
                    )}
                  </div>
                  {!isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        onNavigate('status');
                        setMobileMenuOpen(false);
                      }}
                    >
                      My Applications
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      onOpenAuth('student');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      onOpenAuth('student');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                    onClick={() => {
                      onOpenAuth('admin');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Admin Login
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}