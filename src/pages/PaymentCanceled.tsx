
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 rounded-full p-3 mb-6">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Payment Canceled</h1>
            <p className="text-center text-gray-600 mb-8 max-w-md">
              Your payment process was canceled. No charges were made to your account.
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/account')}>
                Return to Account
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentCanceled;
