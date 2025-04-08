import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LightbulbIcon, Headphones } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSessionContext } from '@/context/SessionContext';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SupportTicket = {
  user_id: string;
  title: string;
  message: string;
}

const Support = () => {
  const navigate = useNavigate();
  const { session, userProfile } = useSessionContext();
  const { toast } = useToast();
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [supportTitle, setSupportTitle] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDirectSupportClick = () => {
    if (session && userProfile?.subscription_status === 'active') {
      setSupportDialogOpen(true);
    } else {
      setAlertDialogOpen(true);
    }
  };

  const handleAlertConfirm = () => {
    navigate('/auth/sign-in');
  };

  const handleSubmitSupport = async () => {
    if (!supportTitle.trim() || !supportMessage.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a title and message for your support request.",
        variant: "destructive"
      });
      return;
    }

    if (!session?.user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a support request.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supportTicket: SupportTicket = {
        user_id: session.user.id,
        title: supportTitle,
        message: supportMessage
      };

      const { data, error } = await supabase
        .from('support_tickets')
        .insert(supportTicket as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your support request has been submitted. We'll get back to you soon.",
      });

      setSupportTitle('');
      setSupportMessage('');
      setSupportDialogOpen(false);
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your support request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <a 
              href="https://discord.gg/7g52pYK2yg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center group"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 -28.5 256 256" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="text-indigo-600"
                >
                  <g>
                    <path 
                      d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" 
                      fill="currentColor" 
                      fillRule="nonzero"
                    />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ask the Community</h3>
              <p className="text-gray-600">
                Get instant help from Coach Call AI users on Discord.
              </p>
            </a>

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

            <div 
              onClick={handleDirectSupportClick}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center group cursor-pointer"
            >
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

      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Support Request</DialogTitle>
            <DialogDescription>
              Please provide details about your issue and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right font-medium col-span-1">
                Title
              </label>
              <input
                id="title"
                value={supportTitle}
                onChange={(e) => setSupportTitle(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="message" className="text-right font-medium col-span-1">
                Message
              </label>
              <Textarea
                id="message"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              onClick={handleSubmitSupport} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Subscription Required</AlertDialogTitle>
            <AlertDialogDescription>
              Direct support is available only for authenticated users with an active subscription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertConfirm}>Sign In / Subscribe</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Support;
