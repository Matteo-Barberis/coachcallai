
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <Separator className="mb-8" />
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Coach Call AI ("we," "our," or "us") values your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
          <p className="text-gray-600 mb-4">
            By using our service, you agree to the collection and use of information in accordance with this policy. 
            We will not use or share your information with anyone except as described in this Privacy Policy.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect several types of information for various purposes to provide and improve our service to you:
          </p>
          
          <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
          <p className="text-gray-600 mb-4">
            While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, including but not limited to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>WhatsApp account information</li>
            <li>Payment information</li>
          </ul>
          
          <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">2.2 Usage Data</h3>
          <p className="text-gray-600 mb-4">
            We may also collect information on how the service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Phone Call Data</h2>
          <p className="text-gray-600 mb-4">
            As part of our core service offering, we make AI-powered coaching calls to your provided phone number. Regarding these calls:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Call recordings and transcripts may be stored and processed to improve our service</li>
            <li>Call data is analyzed to provide personalized coaching feedback</li>
            <li>Call scheduling information is stored to ensure timely delivery of our services</li>
            <li>Call metadata (duration, time, frequency) is collected for service optimization</li>
          </ul>
          <p className="text-gray-600 mb-4">
            By scheduling calls through our service, you consent to the collection and processing of this data.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. WhatsApp Messaging Data</h2>
          <p className="text-gray-600 mb-4">
            Our service includes AI coaching through WhatsApp messages. When you use this feature:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Message content is stored and processed to provide coaching services</li>
            <li>Message history may be analyzed to track progress and provide better guidance</li>
            <li>WhatsApp account information is used solely for service delivery</li>
            <li>Message frequency and timing data may be collected for service optimization</li>
          </ul>
          <p className="text-gray-600 mb-4">
            By connecting your WhatsApp account to our service, you consent to the collection and processing of messaging data as described.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            Coach Call AI uses the collected data for various purposes, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To provide analysis or valuable information so that we can improve the service</li>
            <li>To monitor the usage of the service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To personalize your coaching experience</li>
            <li>To process payments and prevent fraud</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Retention</h2>
          <p className="text-gray-600 mb-4">
            Coach Call AI will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
          </p>
          <p className="text-gray-600 mb-4">
            We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our service, or we are legally obligated to retain this data for longer periods.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Data Security</h2>
          <p className="text-gray-600 mb-4">
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Depending on your location, you may have certain rights regarding your personal information, which may include:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>The right to access the personal information we have about you</li>
            <li>The right to request that we correct inaccurate or incomplete information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to object to or restrict processing of your information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="text-gray-600 mb-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
          <p className="text-gray-600 mb-4">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>By email: [Your Company Email]</li>
            <li>By visiting the contact section on our website</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
