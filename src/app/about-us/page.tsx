"use client";

import React from 'react';
import Image from 'next/image';
import { Users, Award, Heart, Shield, Truck, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "/team/alex.jpg",
      description: "Passionate about sustainable commerce and customer satisfaction."
    },
    {
      name: "Sarah Chen",
      role: "Head of Operations",
      image: "/team/sarah.jpg", 
      description: "Ensuring smooth operations and exceptional service delivery."
    },
    {
      name: "Mike Rodriguez",
      role: "Head of Technology",
      image: "/team/mike.jpg",
      description: "Building innovative solutions for modern e-commerce."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize customer satisfaction above everything else."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every product meets our high quality standards."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support when you need us."
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50K+", label: "Products Sold" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            About <span className="text-primary">Ecobazar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                         We&apos;re passionate about bringing you the best products while maintaining the highest standards of quality, sustainability, and customer service.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="px-8 py-3">
              Learn More About Our Story
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200 rounded-lg shadow-none text-center">
            <CardContent className="p-6">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Story Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2020, Ecobazar started with a simple mission: to provide high-quality products while maintaining sustainable practices and exceptional customer service.
          </p>
          <p className="text-gray-600 leading-relaxed">
            What began as a small local store has grown into a trusted online marketplace, serving thousands of customers worldwide. We believe in building lasting relationships with our customers and partners.
          </p>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Award Winning Service</h3>
              <p className="text-sm text-gray-600">Recognized for excellence in customer service</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Growing Community</h3>
              <p className="text-gray-600">Join thousands of satisfied customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Values
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These core values guide everything we do and help us deliver exceptional experiences to our customers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="border border-gray-200 rounded-lg shadow-none text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Ecobazar who work tirelessly to bring you the best shopping experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="border border-gray-200 rounded-lg shadow-none text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-sm">
                    {member.role}
                  </p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Shop with Us?
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of satisfied customers and discover amazing products at Ecobazar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              Start Shopping
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;