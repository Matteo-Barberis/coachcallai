
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
  const [hasChanges, setHasChanges] = useState(false);
  const [nameError, setNameError] = useState('');

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session?.user?.id]);

  // Check if any profile data has changed
  useEffect(() => {
    const phoneChanged = phone !== initialPhone;
    const nameChanged = fullName !== initialFullName;
    setHasChanges(phoneChanged || nameChanged);
  }, [phone, initialPhone, fullName, initialFullName]);

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
    
    if (!phone || phone.trim() === '') {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // Extract just the country code
    const countryCodeMatch = phone.match(/^\+\d+/);
    const countryCode = countryCodeMatch ? countryCodeMatch[0] : '';
    
    // Check if the phone is just a country code without actual number
    if (phone === countryCode) {
      setPhoneError('Please enter a phone number, not just country code');
      return false;
    }
    
    // Check if it matches E.164 format (removing spaces first)
    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!e164Regex.test(cleanedPhone)) {
      setPhoneError('Please enter a valid phone number with country code');
      return false;
    }
    
    setPhoneError('');
    return true;
  };
  
  const validateName = (name: string): boolean => {
    if (!name || name.trim() === '') {
      setNameError('Name is required');
      return false;
    }
    
    setNameError('');
    return true;
  };

  const handleSaveProfile = async () => {
    // Skip if no changes
    if (!hasChanges) {
      toast({
        title: "No changes",
        description: "No changes were made to your profile.",
      });
      return;
    }

    // Always validate both fields before saving
    const isPhoneValid = validatePhoneNumber(phone);
    const isNameValid = validateName(fullName);
    
    if (!isPhoneValid || !isNameValid) {
      return; // Exit if validation fails
    }

    setIsSaving(true);
    
    try {
      const updates: { phone?: string, phone_verified?: boolean, phone_verification_code?: null, 
                      phone_verification_expires_at?: null, full_name?: string } = {};
      
      // Only update phone if it changed
      if (phone !== initialPhone) {
        const cleanedPhone = phone.replace(/\s+/g, '');
        updates.phone = cleanedPhone;
        // Reset verification when phone changes
        updates.phone_verified = false;
        updates.phone_verification_code = null;
        updates.phone_verification_expires_at = null;
      }
      
      // Only update name if it changed
      if (fullName !== initialFullName) {
        updates.full_name = fullName;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session!.user.id);
      
      if (error) throw error;
      
      // Update initial values to match current values
      if (phone !== initialPhone) {
        setInitialPhone(phone.replace(/\s+/g, ''));
      }
      
      if (fullName !== initialFullName) {
        setInitialFullName(fullName);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    // Clear error if value is not empty and not just country code
    if (value && value.trim() !== '') {
      const countryCodeMatch = value.match(/^\+\d+/);
      const countryCode = countryCodeMatch ? countryCodeMatch[0] : '';
      
      if (value !== countryCode) {
        setPhoneError('');
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (e.target.value && e.target.value.trim() !== '') {
      setNameError('');
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
                    onChange={handleNameChange}
                    placeholder="Your full name"
                    className={nameError ? "border-red-300" : ""}
                    onBlur={() => validateName(fullName)}
                  />
                  {nameError ? (
                    <p className="text-sm text-red-500">{nameError}</p>
                  ) : (
                    <p className="text-sm text-gray-500">This is the name your coach will address you with.</p>
                  )}
                </div>

                <div className="pt-2">
                  <PhoneInput 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    error={phoneError}
                    onBlur={() => validatePhoneNumber(phone)}
                  />
                  {!phoneError && (
                    <p className="text-sm text-gray-500 mt-1">This is the phone number your coach will call you on.</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving || !hasChanges || !!nameError || !!phoneError}
                    className="w-full md:w-auto"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
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
