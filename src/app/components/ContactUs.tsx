import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!', {
      description: 'Our support team will get back to you within 24 hours.',
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us through 
            any of the channels below or fill out the contact form.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="text-blue-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Our support team is available to assist you</p>
            <a href="mailto:support@linkone.edu" className="text-blue-600 hover:text-blue-700">
              support@linkone.edu
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="text-purple-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Mon-Fri from 8am to 5pm</p>
            <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700">
              +1 (234) 567-890
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-green-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">Academic Affairs Office</p>
            <p className="text-gray-700">
              Building A, Room 101<br />
              University Campus
            </p>
          </div>
        </div>

        {/* Contact Form and Info */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-600" size={24} />
                <h3 className="text-gray-900">Send us a Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Ali Ahmad"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appeal">Appeal Question</SelectItem>
                        <SelectItem value="status">Status Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      placeholder="Brief subject of your message"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Please describe your question or issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2" size={20} />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <Clock className="mb-4" size={32} />
              <h3 className="text-white mb-3">Office Hours</h3>
              <div className="space-y-2 text-blue-50">
                <p>Monday - Friday</p>
                <p>8:00 AM - 5:00 PM</p>
                <p className="mt-4">Saturday</p>
                <p>9:00 AM - 1:00 PM</p>
                <p className="mt-4">Sunday: Closed</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Appeal Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    User Manual
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="text-gray-900 mb-2">Emergency Contact</h4>
              <p className="text-gray-600 mb-3">
                For urgent matters outside office hours, please contact:
              </p>
              <p className="text-gray-900">+1 (234) 567-999</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}