import React from 'react';
import { PhoneCall, MessageCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Coach Call AI</span>
            </div>
            <p className="text-gray-600 mb-6">
              Your AI accountability partner that keeps you on track through WhatsApp messages and phone calls.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Features</h3>
            <ul className="space-y-4">
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">WhatsApp Integration</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">Phone Calls</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">Progress Tracking</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">Goal Setting</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">AI Technology</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">API</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-brand-primary">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">Careers</a></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-brand-primary">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 hover:text-brand-primary">Terms of Service</Link></li>
              <li><a href="#contact" className="text-gray-600 hover:text-brand-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Coach Call AI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-brand-primary">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-500 text-sm hover:text-brand-primary">Terms of Service</Link>
            <a href="#" className="text-gray-500 text-sm hover:text-brand-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
