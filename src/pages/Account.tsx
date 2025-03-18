
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
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const validateName = (): boolean => {
    if (!fullName || fullName.trim() === '') {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const validatePhoneNumber = (): boolean => {
    // Extract just the national number part (without country code)
    const extractNationalNumber = (value: string) => {
      const matchedCode = countryCodes.find(c => value.startsWith(c.code));
      return matchedCode ? value.substring(matchedCode.code.length).trim() : value;
    };
    
    const nationalNumber = extractNationalNumber(phone.replace(/\s+/g, ''));
    
    if (!nationalNumber || nationalNumber.length === 0) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // E.164 format validation: + followed by digits
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    const cleanedPhone = phone.replace(/\s+/g, '');
    
    if (!cleanedPhone || !e164Regex.test(cleanedPhone)) {
      setPhoneError('Please enter a valid phone number with country code');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const validateForm = (): boolean => {
    const nameValid = validateName();
    const phoneValid = validatePhoneNumber();
    
    return nameValid && phoneValid;
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

    // Validate all fields before saving
    if (!validateForm()) {
      return;
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
    // Clear error when user types
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    // Clear error when user types
    if (nameError) {
      setNameError('');
    }
  };

  const handleNameBlur = () => {
    validateName();
  };
  
  const handlePhoneBlur = () => {
    validatePhoneNumber();
  };

  // We need this for the phone component validation
  const countryCodes = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+91', country: 'India' },
    { code: '+52', country: 'Mexico' },
    { code: '+55', country: 'Brazil' },
    { code: '+34', country: 'Spain' },
    { code: '+39', country: 'Italy' },
    { code: '+7', country: 'Russia' },
    { code: '+27', country: 'South Africa' },
    { code: '+31', country: 'Netherlands' },
    { code: '+65', country: 'Singapore' },
  ];

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
                    onBlur={handleNameBlur}
                    placeholder="Your full name"
                    className={nameError ? "border-red-300" : ""}
                  />
                  {nameError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{nameError}</AlertDescription>
                    </Alert>
                  )}
                  <p className="text-sm text-gray-500">This is the name your coach will address you with.</p>
                </div>

                <div className="pt-2">
                  <PhoneInput 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    error={phoneError}
                    onBlur={handlePhoneBlur}
                  />
                  <p className="text-sm text-gray-500 mt-1">This is the phone number your coach will call you on.</p>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving || !hasChanges || phoneError !== '' || nameError !== ''}
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
