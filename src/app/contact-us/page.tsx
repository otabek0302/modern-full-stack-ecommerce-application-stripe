"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "(123) 456-7890",
      description: "Call us anytime"
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@ecobazar.com",
      description: "Send us an email"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Samarkand, Uzbekistan",
      description: "Visit our office"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon - Fri: 9AM - 6PM",
      description: "Local time"
    }
  ];

  const departments = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Customer Support" },
    { value: "sales", label: "Sales" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Payments" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      department: ''
    });
    
    setIsSubmitting(false);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or need assistance? We&apos;re here to help! Reach out to us through any of the channels below.
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => (
          <Card key={index} className="border border-gray-200 rounded-lg shadow-none text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <info.icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {info.title}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {info.value}
                </p>
                <p className="text-gray-600 text-xs">
                  {info.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form and Office Info */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="border border-gray-200 rounded-lg shadow-none">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Send us a Message
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Message *
                </label>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Office Information */}
        <div className="space-y-6">
          <Card className="border border-gray-200 rounded-lg shadow-none">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Our Office
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Main Office</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Samarkand, Uzbekistan<br />
                      Central Business District<br />
                      Postal Code: 140100
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Contact Numbers</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Main: (123) 456-7890</p>
                      <p>Support: (123) 456-7891</p>
                      <p>Sales: (123) 456-7892</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 rounded-lg shadow-none">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Call Us Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Looking for Quick Answers?
          </h2>
          <p className="text-gray-600 text-lg">
            Check out our frequently asked questions for instant answers to common inquiries.
          </p>
          <Button size="lg" className="px-8 py-3">
            View FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;