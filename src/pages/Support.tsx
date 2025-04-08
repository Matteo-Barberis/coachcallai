
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LightbulbIcon, Headphones } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help. Choose the support option that works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Discord Community Support */}
            <a 
              href="https://discord.gg/7g52pYK2yg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center group"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-8 w-8 text-indigo-600"
                >
                  <circle cx="9" cy="12" r="1"></circle>
                  <circle cx="15" cy="12" r="1"></circle>
                  <path d="M7.5 7.2C8.4 6.5 9.7 6 11 6c2.7 0 5.1 1.5 5.9 3.8"></path>
                  <path d="M14.5 16.8c-.9.7-2.2 1.2-3.5 1.2-2.7 0-5.1-1.5-5.9-3.8"></path>
                  <path d="M16.1 10s.9 1 .9 2-.9 2-.9 2"></path>
                  <path d="M7.9 10S7 11 7 12s.9 2 .9 2"></path>
                  <path d="M18.3 18.9c-1 .5-2.2.8-3.3.9-.8.1-1.8.1-2.7.1-1.7 0-3.5-.2-5.1-.6C4 17.9 2 15.7 2 13.6c0-1.8 1.3-3.4 3.4-4.2-1 .8-1.4 1.8-1.4 2.9 0 0 0 9.7 8 6.5q1.5 1.5 4 1.3c2-.1 3.8-1.3 4.8-3.1q3 5.1 6.7 4.2c-2.5 3-6.5 4.3-10 3.5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ask the Community</h3>
              <p className="text-gray-600">
                Get instant help from Coach Call AI users on Discord.
              </p>
            </a>

            {/* Feature Requests */}
            <a 
              href="https://coachcallai.featurebase.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center group"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 transition-colors">
                <LightbulbIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Feature Requests</h3>
              <p className="text-gray-600">
                Have an idea? Share it and let the community vote!
              </p>
            </a>

            {/* Direct Support */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Support</h3>
              <p className="text-gray-600">
                Direct support channel, for paying users.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
