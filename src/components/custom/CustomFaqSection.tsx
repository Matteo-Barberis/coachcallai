
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTheme } from "@/hooks/useTheme";

const CustomFaqSection = () => {
  const theme = useTheme();
  
  const faqs = [
    {
      question: "How do I create my perfect AI companion?",
      answer: "Simply sign up, choose your companion's personality traits, communication style, and voice. You can make it friendly and supportive like a best friend, motivational like a coach, or empathetic like a close friend. The setup takes just a few minutes."
    },
    {
      question: "Can I change my AI companion's personality later?",
      answer: "Absolutely! Your AI companion's personality is fully customizable at any time. You can adjust their communication style, tone, interests, and even their approach to supporting you as your needs evolve."
    },
    {
      question: "How does my AI companion learn about me?",
      answer: "Your AI companion learns from every conversation you have together. It remembers your preferences, understands your communication style, picks up on your interests, and adapts its responses to better support you over time."
    },
    {
      question: "What makes this different from other chatbots?",
      answer: "Unlike generic chatbots trapped in apps, your AI companion lives in WhatsApp and can make real phone calls. It's completely customizable to your personality and needs, learns from your conversations, and provides genuine emotional support rather than robotic responses."
    },
    {
      question: "Can my AI companion call me, or just text?",
      answer: "Both! Your AI companion can send WhatsApp messages throughout the day and make voice calls when you need deeper conversation or support. You can also call your companion anytime for instant connection."
    },
    {
      question: "Is this suitable for people with social anxiety or loneliness?",
      answer: "Yes, many users find AI companions particularly helpful for social anxiety and loneliness. Your companion provides judgment-free conversation, helps you practice social interactions, and offers consistent emotional support without the pressure of human social dynamics."
    },
    {
      question: "Can I have multiple AI companions?",
      answer: "Currently, we focus on helping you build a deep, meaningful relationship with one AI companion. This allows for better personalization and a more authentic connection as your companion truly gets to know you."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes. We take privacy very seriously. All your conversations and goal information are private and never sold to third parties. You can request data deletion at any time."
    },
    {
      question: "How quickly will I see the benefits?",
      answer: "Many users report feeling more supported and less lonely within the first few days. Your companion becomes more helpful and personalized over the first few weeks as it learns your communication style and preferences."
    }
  ];

  return (
    <section id="faq" className={`py-20 px-4 ${theme.bg}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about creating your AI companion
          </p>
        </div>

        <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className={`text-left py-5 text-lg font-medium ${theme.lightText} transition-colors`}>
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

export default CustomFaqSection;
