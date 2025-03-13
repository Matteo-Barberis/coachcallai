
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SendIcon, MicIcon, PhoneCallIcon } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
};

const CoachInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI coach. How can I help you reach your goals today?",
      sender: 'coach',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const responses = [
        "That's a great goal! Let's break it down into smaller, manageable steps.",
        "I understand your challenge. Have you considered trying a different approach?",
        "It sounds like you're making good progress. What specific obstacle are you facing?",
        "Let's schedule a check-in call to discuss this in more detail.",
        "I've noted your update. Would you like some accountability reminders for this goal?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const coachMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'coach',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleScheduleCall = () => {
    toast({
      title: "Call Scheduled",
      description: "Your coach will call you tomorrow at 10:00 AM.",
      duration: 3000,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coach Chat</h2>
        <Button 
          variant="outline" 
          onClick={handleScheduleCall}
          className="flex items-center gap-2"
        >
          <PhoneCallIcon className="h-4 w-4" />
          Schedule Call
        </Button>
      </div>

      {/* Messages container */}
      <Card className="flex-grow overflow-hidden mb-4">
        <CardContent className="p-4 h-[460px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.sender === 'user' 
                      ? 'bg-brand-primary text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input area */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="flex-shrink-0"
          onClick={() => toast({
            title: "Voice Input",
            description: "Voice input functionality coming soon!",
          })}
        >
          <MicIcon className="h-5 w-5" />
        </Button>
        <Textarea 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
          className="min-h-[50px] flex-grow"
          maxLength={500}
        />
        <Button 
          className="flex-shrink-0" 
          disabled={!inputMessage.trim()} 
          onClick={handleSendMessage}
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CoachInterface;
