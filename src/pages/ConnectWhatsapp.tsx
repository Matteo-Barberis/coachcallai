
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const ConnectWhatsapp = () => {
  const { session, loading } = useSessionContext();

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Connect to WhatsApp</CardTitle>
              <CardDescription>
                Link your WhatsApp account to receive coaching session reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1 space-y-4">
                  <p className="text-sm leading-relaxed">
                    Click on this link: <a 
                      href="https://wa.me/447981115130?text=Hello%20I%20want%20to%20chat" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Start chatting <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </p>
                  <p className="text-sm leading-relaxed">
                    Or scan the QR code to start texting with your coach.
                  </p>
                  <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> You need to send a first message to activate the coach.
                    </p>
                  </div>
                  <div className="md:hidden">
                    <Button
                      className="w-full"
                      onClick={() => window.open('https://wa.me/447981115130?text=Hello%20I%20want%20to%20chat', '_blank')}
                    >
                      Open WhatsApp
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//qr-code.png"
                    alt="WhatsApp QR Code" 
                    className="w-48 h-48 object-contain border rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ConnectWhatsapp;
