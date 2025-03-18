
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PhoneInput from '@/components/PhoneInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Account = () => {
  const { session, loading } = useSessionContext();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [initialPhone, setInitialPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fullName, setFullName] = useState('');
  const [initialFullName, setInitialFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session?.user?.id]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone, full_name')
        .eq('id', session!.user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        if (data.phone) {
          setPhone(data.phone);
          setInitialPhone(data.phone);
        }
        
        if (data.full_name) {
          setFullName(data.full_name);
          setInitialFullName(data.full_name);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // E.164 format validation: + followed by digits
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    
    if (!phone || !e164Regex.test(phone.replace(/\s+/g, ''))) {
      setPhoneError('Please enter a valid phone number with country code');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handleSavePhone = async () => {
    // Skip if no changes
    if (phone === initialPhone) {
      toast({
        title: "No changes",
        description: "The phone number hasn't changed.",
      });
      return;
    }

    // Validate phone format
    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!validatePhoneNumber(cleanedPhone)) {
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          phone: cleanedPhone,
          // Reset verification when phone changes
          phone_verified: false,
          phone_verification_code: null,
          phone_verification_expires_at: null
        })
        .eq('id', session!.user.id);
      
      if (error) throw error;
      
      setInitialPhone(cleanedPhone);
      
      toast({
        title: "Phone number updated",
        description: "Your phone number has been successfully saved.",
      });
    } catch (error: any) {
      console.error('Error updating phone:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveName = async () => {
    // Skip if no changes
    if (fullName === initialFullName) {
      toast({
        title: "No changes",
        description: "The name hasn't changed.",
      });
      return;
    }

    setIsSavingName(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', session!.user.id);
      
      if (error) throw error;
      
      setInitialFullName(fullName);
      
      toast({
        title: "Name updated",
        description: "Your name has been successfully saved.",
      });
    } catch (error: any) {
      console.error('Error updating name:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    // Clear error when user types
    if (phoneError) {
      setPhoneError('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                    {session?.user.email}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Preferences</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                  <p className="text-sm text-gray-500">This is the name your coach will address you with.</p>
                  <Button 
                    onClick={handleSaveName} 
                    disabled={isSavingName || (fullName === initialFullName)}
                    className="mt-2"
                  >
                    {isSavingName ? "Saving..." : "Save Name"}
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <PhoneInput 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    error={phoneError} 
                  />
                  <p className="text-sm text-gray-500 mt-1">This is the phone number your coach will call you on.</p>
                  <Button 
                    onClick={handleSavePhone} 
                    disabled={isSaving || (phone === initialPhone)}
                    className="mt-2"
                  >
                    {isSaving ? "Saving..." : "Save Phone Number"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Subscription</h2>
              <p className="text-gray-500 italic">Subscription management will be available in a future update.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
