"use client";

import React, { useState } from 'react';
import { Search, HelpCircle, ShoppingBag, CreditCard, Truck, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      items: [
        {
          question: "What is Ecobazar?",
          answer: "Ecobazar is an online marketplace dedicated to providing high-quality products with sustainable practices. We offer a wide range of products from trusted vendors with exceptional customer service."
        },
        {
          question: "How do I create an account?",
          answer: "Creating an account is easy! Simply click on the 'Sign Up' button in the header, fill in your details, and you'll be ready to start shopping in minutes."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent."
        }
      ]
    },
    {
      title: "Shopping & Orders",
      icon: ShoppingBag,
      items: [
        {
          question: "How do I place an order?",
          answer: "Browse our products, add items to your cart, and proceed to checkout. You can pay using various methods including credit cards, PayPal, or cash on delivery."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 1 hour of placing it. After that, please contact our customer support team for assistance."
        },
        {
          question: "Do you offer discounts or promotions?",
          answer: "Yes! We regularly offer discounts, seasonal sales, and promotional codes. Sign up for our newsletter to stay updated on the latest offers."
        }
      ]
    },
    {
      title: "Payment & Billing",
      icon: CreditCard,
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and cash on delivery for eligible orders."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers."
        },
        {
          question: "Do you offer installment payments?",
          answer: "Currently, we don't offer installment payments, but we're working on adding this feature. Stay tuned for updates!"
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      items: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping typically takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking number via email to monitor your delivery status."
        }
      ]
    },
    {
      title: "Returns & Refunds",
      icon: Shield,
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Some items may have different return terms."
        },
        {
          question: "How do I return an item?",
          answer: "Contact our customer support team to initiate a return. We'll provide you with a return label and instructions."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are typically processed within 5-7 business days after we receive your returned item."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our products, services, and policies. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="border border-gray-200 rounded-lg shadow-none">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {category.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {category.items.map((item, itemIndex) => {
                const globalIndex = categoryIndex * 100 + itemIndex;
                const isExpanded = expandedItems.includes(globalIndex);
                
                return (
                  <div key={itemIndex} className="border border-gray-100 rounded-lg">
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 pr-4">
                        {item.question}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {searchTerm && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No questions found
          </h3>
          <p className="text-gray-600 mb-6">
            Try searching with different keywords or contact our support team.
          </p>
          <Button onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      )}

      {/* Contact Support CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 text-lg">
            Our customer support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              Contact Support
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;