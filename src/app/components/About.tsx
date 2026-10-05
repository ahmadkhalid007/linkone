import { Target, Users, Zap, Shield, CheckCircle2 } from 'lucide-react';
import projectImage from 'figma:asset/d48af28c189a8de30c53f3cc8d686c109ec0eded.png';

export function About() {
  const features = [
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Streamlined processes that reduce manual intervention and speed up approvals',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensuring your data is protected at all times',
    },
    {
      icon: Users,
      title: 'Multi-Level Approvals',
      description: 'Structured approval hierarchy with course coordinators, directors, and department heads',
    },
    {
      icon: Target,
      title: 'Conflict Detection',
      description: 'Intelligent system that automatically detects and helps resolve scheduling conflicts',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Students Served' },
    { value: '500+', label: 'Applications Processed' },
    { value: '95%', label: 'Approval Rate' },
    { value: '24hrs', label: 'Average Response Time' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-white mb-6">About Link One</h1>
            <p className="text-blue-50 max-w-3xl mx-auto">
              A comprehensive web-based system that automates and streamlines student applications, 
              approvals, and administrative processes with efficiency and transparency.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-blue-600 mb-2">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To revolutionize student administrative services by providing a seamless, automated, 
              and transparent platform that empowers students and streamlines institutional processes.
            </p>
            <p className="text-gray-600">
              We believe in removing barriers to education by making administrative tasks simple, 
              efficient, and accessible to all students.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              To become the leading student services platform that sets the standard for 
              digital transformation in educational institutions worldwide.
            </p>
            <p className="text-gray-600">
              We envision a future where every student can focus on learning without being 
              hindered by complex administrative procedures.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-gray-900 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-16">
          <h2 className="text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-gray-900 mb-3">Submit Application</h3>
              <p className="text-gray-600">
                Choose your appeal type and fill out the required information with supporting documents
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-gray-900 mb-3">Automated Routing</h3>
              <p className="text-gray-600">
                System automatically routes your application through the appropriate approval channels
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-gray-900 mb-3">Track & Receive</h3>
              <p className="text-gray-600">
                Monitor your application status in real-time and receive notifications at each stage
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-gray-900 mb-8">Benefits of Link One</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-gray-900 mb-1">Time Savings</h4>
                <p className="text-gray-600">Reduce processing time from weeks to days with automated workflows</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-gray-900 mb-1">Transparency</h4>
                <p className="text-gray-600">Track your application at every stage with real-time updates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-gray-900 mb-1">24/7 Accessibility</h4>
                <p className="text-gray-600">Submit and track applications anytime, anywhere</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-gray-900 mb-1">Error Reduction</h4>
                <p className="text-gray-600">Automated validation ensures accuracy and completeness</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-gray-900 mb-1">Digital Records</h4>
                <p className="text-gray-600">All documents and communications stored securely in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-gray-900 mb-1">Smart Routing</h4>
                <p className="text-gray-600">Intelligent system routes appeals to the right approvers automatically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}