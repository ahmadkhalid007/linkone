import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { SimplifiedAppealForm } from './components/SimplifiedAppealForm';
import { SimplifiedFYP } from './components/SimplifiedFYP';
import { ThesisManagement } from './components/ThesisManagement';
import { AdminManagement } from './components/AdminManagement';
import { StatusTracking } from './components/StatusTracking';
import { ContactUs } from './components/ContactUs';
import { About } from './components/About';
import { Footer } from './components/LinkOneFooter';
import { Login } from './components/Login';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { MyApplications } from './components/MyApplications';
import { Dialog, DialogContent, DialogTitle } from './components/ui/dialog';
import { SystemWorkflowGuide } from './components/SystemWorkflowGuide';

function AppContent() {
  const [currentSection, setCurrentSection] = useState<'home' | 'appeal' | 'fyp' | 'thesis' | 'status' | 'contact' | 'about' | 'admin' | 'admin-management' | 'my-applications'>('home');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authType, setAuthType] = useState<'student' | 'admin'>('student');
  const { isAdmin } = useAuth();

  const handleOpenAuth = (type: 'student' | 'admin' = 'student') => {
    setAuthType(type);
    setAuthDialogOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentSection={currentSection} 
        onNavigate={setCurrentSection}
        onOpenAuth={handleOpenAuth}
      />
      
      {currentSection === 'home' && (
        <>
          <Hero onGetStarted={() => setCurrentSection('appeal')} onOpenAuth={handleOpenAuth} />
          <SystemWorkflowGuide />
        </>
      )}
      
      {currentSection === 'appeal' && <SimplifiedAppealForm />}
      {currentSection === 'fyp' && <SimplifiedFYP />}
      {currentSection === 'thesis' && <ThesisManagement />}
      {currentSection === 'status' && <StatusTracking />}
      {currentSection === 'contact' && <ContactUs />}
      {currentSection === 'about' && <About />}
      {currentSection === 'admin' && isAdmin && <AdminDashboard />}
      {currentSection === 'admin-management' && isAdmin && <AdminManagement />}
      {currentSection === 'my-applications' && <MyApplications />}
      
      <Footer onNavigate={setCurrentSection} />

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogTitle className="sr-only">
            {authType === 'admin' ? 'Admin Login' : 'Student Login'}
          </DialogTitle>
          {authType === 'admin' ? (
            <AdminLogin onClose={handleCloseAuth} />
          ) : (
            <Login onClose={handleCloseAuth} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}