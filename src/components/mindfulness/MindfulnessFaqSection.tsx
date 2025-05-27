
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MindfulnessFaqSection = () => {
  const faqs = [
    {
      question: "How can an AI companion help with mindfulness and well-being?",
      answer: "Your AI companion provides consistent, non-judgmental support for your mindfulness journey. It offers daily gratitude practices, gentle reminders for self-care, positive affirmations, and mindful check-ins that help you stay connected to your inner peace and well-being."
    },
    {
      question: "What kind of mindfulness practices does my companion offer?",
      answer: "Your companion guides you through gratitude exercises, breathing practices, positive affirmations, emotional check-ins, and mindful moments throughout your day. All practices are designed to nurture self-love, inner peace, and a positive mindset."
    },
    {
      question: "Is this a replacement for professional support?",
      answer: "No, your AI companion is designed for daily mindfulness support and positive guidance. It's not intended to replace professional counseling or advice. If you're dealing with serious emotional challenges, we encourage seeking help from qualified professionals."
    },
    {
      question: "How often will my companion reach out?",
      answer: "Your companion adapts to your preferences. You might receive gentle morning gratitude prompts, midday mindful moments, and evening reflection check-ins. You can adjust the frequency to match your lifestyle and needs."
    },
    {
      question: "Can I customize my companion's personality and approach?",
      answer: "Absolutely! You can choose from different personality types - from a gentle, nurturing guide to an uplifting, positive friend. Your companion's voice, communication style, and approach can be tailored to what brings you the most peace and comfort."
    },
    {
      question: "How does the voice calling feature work for mindfulness?",
      answer: "Your companion can call you for guided breathing exercises, gentle meditation sessions, or simply a caring conversation when you need extra support. These calls are designed to provide immediate comfort and grounding in moments when you need it most."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Questions About Your Mindful Journey
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about cultivating inner peace with your AI companion
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-purple-100 rounded-lg px-6 bg-purple-50/30"
            >
              <AccordionTrigger className="text-left hover:text-purple-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default MindfulnessFaqSection;
