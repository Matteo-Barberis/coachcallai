
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M15.9 14a24.1 24.1 0 0 1-3.9.6 24.1 24.1 0 0 1-3.9-.6"></path>
                  <path d="M9 10h.01"></path>
                  <path d="M15 10h.01"></path>
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
