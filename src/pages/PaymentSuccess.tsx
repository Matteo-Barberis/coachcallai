
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { useSessionContext } from '@/context/SessionContext';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSessionContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    // Only proceed with verification when session loading is complete
    if (sessionLoading) {
      return; // Wait until session is loaded
    }

    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Invalid session ID');
        setLoading(false);
        return;
      }

      if (!session?.user.id) {
        setError('Not logged in');
        setLoading(false);
        return;
      }

      try {
        // Get session details from Stripe to find the price ID and verify subscription
        const { data: sessionData, error: sessionError } = await supabase.functions
          .invoke('get-checkout-session', {
            body: { 
              sessionId,
              userId: session.user.id 
            },
          });

        if (sessionError) {
          throw new Error(`Failed to get session details: ${sessionError.message}`);
        }

        if (!sessionData.priceId) {
          throw new Error('Could not determine subscription plan from checkout session');
        }

        console.log('Retrieved price ID from Stripe:', sessionData.priceId);
        console.log('Subscription verified:', sessionData.subscriptionVerified);

        if (sessionData.subscriptionVerified) {
          toast({
            title: 'Subscription activated',
            description: 'Your subscription has been successfully verified and activated!',
          });
        } else {
          console.log('Subscription was not verified as active');
          // We don't throw an error here since the purchase might still be valid
          // but just not a subscription (or still pending)
        }

        setVerificationComplete(true);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (!verificationComplete) {
      verifyPayment();
    }
  }, [sessionId, session, toast, sessionLoading, verificationComplete]);

  // Show loading state while session is being loaded
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-brand-primary animate-spin mb-4" />
              <h2 className="text-xl font-semibold">Loading your session...</h2>
              <p className="text-gray-500 mt-2">Please wait while we verify your authentication</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-brand-primary animate-spin mb-4" />
              <h2 className="text-xl font-semibold">Verifying your payment...</h2>
              <p className="text-gray-500 mt-2">Please wait while we confirm your subscription</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 w-full">
                <h3 className="font-semibold">Error</h3>
                <p>{error}</p>
              </div>
              <Button onClick={() => navigate('/account')}>
                Return to Account
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-green-50 rounded-full p-3 mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-center text-gray-600 mb-8 max-w-md">
                Thank you for subscribing. Your account has been upgraded and you now have access to all premium features.
              </p>
              <div className="flex space-x-4">
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/account')}>
                  View Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
