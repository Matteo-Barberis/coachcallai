import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <Separator className="mb-8" />
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing or using Coach Call AI's services, including our website, mobile applications, 
            WhatsApp integration, and automated coaching calls (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you do not agree to these Terms, please do not use our Service.
          </p>
          <p className="text-gray-600 mb-4">
            These Terms constitute a legally binding agreement between you and Coach Call AI ("Company", "we", "us", or "our") 
            regarding your use of the Service.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Age Requirements</h2>
          <p className="text-gray-600 mb-4">
            You must be at least 18 years of age to use our Service. By using Coach Call AI, you represent and warrant that you are at least 18 years old.
          </p>
          <p className="text-gray-600 mb-4">
            If you are under 18 years of age, you are not permitted to use the Service under any circumstances. 
            We do not knowingly collect personal information from individuals under 18 years of age.
          </p>
          <p className="text-gray-600 mb-4">
            If we discover that a user is under 18 years of age, we will immediately terminate their account and delete any personal information we have collected from them.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Description of Service</h2>
          <p className="text-gray-600 mb-4">
            Coach Call AI provides AI-powered coaching services through WhatsApp messaging and automated phone calls. 
            Our Service is designed to help users set and achieve personal and professional goals through regular 
            check-ins, accountability tracking, and personalized advice.
          </p>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Account Registration and Security</h2>
          <p className="text-gray-600 mb-4">
            To use certain features of our Service, you may need to create an account. You are responsible for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Providing accurate and complete information</li>
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access or use of your account</li>
          </ul>
          <p className="text-gray-600 mb-4">
            We reserve the right to disable any user account at our sole discretion if we believe 
            you have violated these Terms or if we detect suspicious or harmful activity.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. WhatsApp Integration and Phone Call Service</h2>
          <p className="text-gray-600 mb-4">
            By using our WhatsApp messaging and automated phone call features, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Provide accurate phone number information</li>
            <li>Receive regular messages and calls from our AI coaching system</li>
            <li>Use these features in compliance with applicable laws and regulations</li>
          </ul>
          <p className="text-gray-600 mb-4">
            You acknowledge that standard messaging and calling rates from your service provider may apply. 
            We are not responsible for any charges incurred through your use of these features.
          </p>
          <p className="text-gray-600 mb-4">
            We reserve the right to limit, modify, or discontinue the frequency, timing, or content of messages and calls 
            at our discretion to maintain service quality and user experience.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Subscription and Payments</h2>
          <p className="text-gray-600 mb-4">
            Some aspects of our Service may require a paid subscription. By subscribing to our Service, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Pay all fees associated with your selected subscription plan</li>
            <li>Provide accurate and complete payment information</li>
            <li>Authorize us to charge your payment method for the subscription fees</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Subscriptions automatically renew unless canceled before the renewal date. 
            You may cancel your subscription at any time through your account settings or by contacting us.
          </p>
          <p className="text-gray-600 mb-4">
            We reserve the right to change our subscription fees upon reasonable notice. 
            Any changes will be communicated to you and will apply to the next billing cycle.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. User Conduct and Content</h2>
          <p className="text-gray-600 mb-4">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Upload or transmit viruses, malware, or other malicious code</li>
            <li>Collect or harvest data from other users without their consent</li>
          </ul>
          <p className="text-gray-600 mb-4">
            All content you provide through the Service, including messages, feedback, and personal information, 
            is subject to our Privacy Policy.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            All content, features, and functionality of our Service, including but not limited to text, graphics, logos, 
            icons, images, audio clips, digital downloads, data compilations, and software, are owned by Coach Call AI, 
            our licensors, or other providers of such material and are protected by copyright, trademark, patent, 
            trade secret, and other intellectual property laws.
          </p>
          <p className="text-gray-600 mb-4">
            These Terms do not transfer any ownership rights to you. You may not copy, modify, distribute, sell, or lease 
            any part of our Service without our prior written consent.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            To the maximum extent permitted by applicable law, Coach Call AI and its officers, directors, employees, agents, 
            and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
            including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          <p className="text-gray-600 mb-4">
            In no event shall our total liability to you for all claims exceed the amount you have paid to us 
            for the Service in the preceding twelve months.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Disclaimer of Warranties</h2>
          <p className="text-gray-600 mb-4">
            The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. 
            Coach Call AI does not warrant that the Service will be uninterrupted, secure, or error-free, that defects will be corrected, 
            or that the Service is free of viruses or other harmful components.
          </p>
          <p className="text-gray-600 mb-4">
            Coach Call AI makes no warranties or representations about the accuracy or completeness of the content available on or through the Service.
          </p>
          <p className="text-gray-600 mb-4 font-semibold">
            Coach Call AI is not a substitute for professional medical advice, diagnosis, or treatment. 
            The content provided through the Service is for informational and motivational purposes only.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We may modify these Terms from time to time. When we make changes, we will update the "Last Updated" 
            date at the top of this page. We will provide notice of material changes through the Service or by other means.
          </p>
          <p className="text-gray-600 mb-4">
            Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Termination</h2>
          <p className="text-gray-600 mb-4">
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, 
            for any reason, including, without limitation, if you breach these Terms.
          </p>
          <p className="text-gray-600 mb-4">
            Upon termination, your right to use the Service will immediately cease. All provisions of these Terms 
            which by their nature should survive termination shall survive, including, without limitation, ownership provisions, 
            warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Governing Law and Jurisdiction</h2>
          <p className="text-gray-600 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
            without regard to its conflict of law provisions.
          </p>
          <p className="text-gray-600 mb-4">
            Any legal action or proceeding relating to your access to or use of the Service shall be brought exclusively 
            in the courts located in [Your Jurisdiction City], and you consent to the jurisdiction of such courts.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Email: hello@coachcall.ai</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
