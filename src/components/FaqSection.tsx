
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTheme } from '@/hooks/useTheme';

const FaqSection = () => {
  const theme = useTheme();
  
  const faqs = [
    {
      question: "How does Coach Call AI make phone calls?",
      answer: "Coach Call AI uses advanced voice AI technology to make real phone calls to your designated number. The calls sound natural and conversational, creating an authentic accountability experience."
    },
    {
      question: "Do I need to install any special apps?",
      answer: "No. Coach Call AI works with WhatsApp, which you likely already have. For phone calls, we use your existing phone number, so there's no need for additional apps or devices."
    },
    {
      question: "Can I customize when I receive calls and messages?",
      answer: "Absolutely! You can set your preferred times for calls and WhatsApp check-ins. The AI coach will respect your schedule and reach out during your specified hours."
    },
    {
      question: "What kinds of goals can Coach Call AI help with?",
      answer: "Coach Call AI can help with a wide range of goals, including fitness, productivity, business, education, personal development, and more. The system is flexible and can be customized to your specific needs."
    },
    {
      question: "How does Coach Call AI help people with ADHD or chronic procrastination?",
      answer: "Coach Call AI is particularly effective for individuals with ADHD or chronic procrastination. The system provides structure through consistent check-ins, breaking down goals into manageable steps, and offering real-time accountability via phone calls and WhatsApp messages. The varied communication methods help combat attention challenges, while the personalized coach voices and adaptive reminders work with your unique motivation style. Many users report significant improvements in task completion and reduced procrastination within days of starting."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes. We take privacy very seriously. All your conversations and goal information are encrypted and never shared with third parties. You can request data deletion at any time."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time with no questions asked. We also offer a 14-day free trial, so you can experience the full benefits of Coach Call AI before committing."
    },
    {
      question: "Does Coach Call AI work globally?",
      answer: "Coach Call AI works in any country where WhatsApp is available. Phone calls are currently available in North America, Europe, Australia, and select Asian countries, with more regions being added regularly."
    },
    {
      question: "How does Coach Call AI compare to a human coach?",
      answer: "While Coach Call AI doesn't replace the expertise of a human coach, it excels at consistency, availability, and frequent check-ins. Many users combine Coach Call AI with occasional sessions with human coaches for optimal results."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Coach Call AI
          </p>
        </div>

        <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className={`text-left py-5 text-lg font-medium ${theme.hoverPrimary}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
