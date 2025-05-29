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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  interval: string;
  price: number;
  features: string[] | Json;
  stripe_price_id: string;
  is_active: boolean;
  created_at: string;
};

type Mode = {
  id: string;
  name: string;
  description: string;
};

const Account = () => {
  const { session, loading, userProfile, refreshProfile } = useSessionContext();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [initialPhone, setInitialPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fullName, setFullName] = useState('');
  const [initialFullName, setInitialFullName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [managingSubscription, setManagingSubscription] = useState(false);
  
  // New state variables for mode selection
  const [modes, setModes] = useState<Mode[]>([]);
  const [loadingModes, setLoadingModes] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);
  const [showModeChangeDialog, setShowModeChangeDialog] = useState(false);
  const [newModeId, setNewModeId] = useState<string | null>(null);
  const [updatingMode, setUpdatingMode] = useState(false);

  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile();
      fetchSubscriptionPlans();
      fetchModes();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (userProfile?.current_mode_id) {
      setSelectedModeId(userProfile.current_mode_id);
    }
  }, [userProfile]);

  useEffect(() => {
    const shouldScrollToBasicPlan = sessionStorage.getItem('scrollToBasicPlan');
    
    if (shouldScrollToBasicPlan && plans.length > 0 && !loadingPlans) {
      sessionStorage.removeItem('scrollToBasicPlan');
      
      setTimeout(() => {
        const firstPlanCard = document.querySelector('[id="subscription-section"] > div > div');
        if (firstPlanCard) {
          firstPlanCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [plans, loadingPlans]);

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

  const fetchSubscriptionPlans = async () => {
    setLoadingPlans(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchModes = async () => {
    setLoadingModes(true);
    try {
      const { data, error } = await supabase
        .from('modes')
        .select('id, name, description')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setModes(data || []);
    } catch (error) {
      console.error('Error fetching modes:', error);
      toast({
        title: "Error",
        description: "Failed to load available modes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingModes(false);
    }
  };

  const handleModeChange = (modeId: string) => {
    // If user selected the current mode, do nothing
    if (modeId === selectedModeId) {
      return;
    }
    
    // Store the new mode ID temporarily and show confirmation dialog
    setNewModeId(modeId);
    setShowModeChangeDialog(true);
  };

  const confirmModeChange = async () => {
    if (!newModeId || !session?.user?.id) return;
    
    setUpdatingMode(true);
    try {
      // Update the user's current mode ID in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ current_mode_id: newModeId })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      setSelectedModeId(newModeId);
      setNewModeId(null);
      
      // Close the dialog
      setShowModeChangeDialog(false);
      
      // Refresh the user profile in the session context
      await refreshProfile();
      
      toast({
        title: "Mode Updated",
        description: "Your coaching mode has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating mode:', error);
      toast({
        title: "Error",
        description: "Failed to update coaching mode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingMode(false);
    }
  };

  const cancelModeChange = () => {
    setNewModeId(null);
    setShowModeChangeDialog(false);
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
    const extractNationalNumber = (value: string) => {
      const matchedCode = countryCodes.find(c => value.startsWith(c.code));
      return matchedCode ? value.substring(matchedCode.code.length).trim() : value;
    };
    
    const nationalNumber = extractNationalNumber(phone.replace(/\s+/g, ''));
    
    if (!nationalNumber || nationalNumber.length === 0) {
      setPhoneError('Phone number is required');
      return false;
    }
    
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
    if (!hasChanges) {
      toast({
        title: "No changes",
        description: "No changes were made to your profile.",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      const updates: { phone?: string, phone_verified?: boolean, phone_verification_code?: null, 
                      phone_verification_expires_at?: null, full_name?: string } = {};
      
      if (phone !== initialPhone) {
        const cleanedPhone = phone.replace(/\s+/g, '');
        updates.phone = cleanedPhone;
        updates.phone_verified = false;
        updates.phone_verification_code = null;
        updates.phone_verification_expires_at = null;
      }
      
      if (fullName !== initialFullName) {
        updates.full_name = fullName;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session!.user.id);
      
      if (error) {
        if (error.code === '23505' && (
            error.message.includes('profiles_phone_key') || 
            error.message.includes('profiles_phone_unique')
        )) {
          setPhoneError('This phone number is already registered with another account');
          throw new Error('This phone number is already registered with another account');
        }
        
        throw error;
      }
      
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

  const handleStartCheckout = async (priceId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);

    try {
      console.log("Starting checkout process for price ID:", priceId);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId,
          userId: session.user.id
        }
      });

      if (error) {
        console.error("Checkout function error:", error);
        throw error;
      }
      
      if (data?.url) {
        console.log("Redirecting to checkout URL:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
      setProcessingPayment(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to manage your subscription",
        variant: "destructive",
      });
      return;
    }

    setManagingSubscription(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { 
          userId: session.user.id,
          returnUrl: window.location.origin + '/account'
        }
      });

      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: "Error",
        description: "Failed to access subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setManagingSubscription(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
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

  const getModePlanDescriptions = (planName: string) => {
    const currentMode = modes.find(mode => mode.id === selectedModeId)?.name?.toLowerCase() || 'custom';
    
    switch (currentMode) {
      case 'mindfulness':
        if (planName.toLowerCase().includes('basic') || planName.toLowerCase().includes('starter')) {
          return 'Perfect for beginning your mindfulness journey';
        } else if (planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('premium')) {
          return 'Advanced mindfulness coaching for deeper transformation';
        } else {
          return 'Comprehensive mindfulness solution for inner peace';
        }
      
      case 'accountability':
        if (planName.toLowerCase().includes('basic') || planName.toLowerCase().includes('starter')) {
          return 'For those committed to consistent accountability';
        } else if (planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('premium')) {
          return 'Advanced accountability for high performers';
        } else {
          return 'Comprehensive solution for serious achievers';
        }
      
      default: // custom mode
        if (planName.toLowerCase().includes('basic') || planName.toLowerCase().includes('starter')) {
          return 'Personalized coaching tailored to your unique goals';
        } else if (planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('premium')) {
          return 'Advanced custom coaching for ambitious individuals';
        } else {
          return 'Complete custom solution for your success';
        }
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
                    onBlur={handleNameBlur}
                    placeholder="Your full name"
                    className={nameError ? "border-red-300" : ""}
                  />
                  {nameError && (
                    <Alert variant="destructive" className="py-2">
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
            
            {/* New Mode Preferences Section */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Mode Preferences</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="modeSelect">Coaching Mode</Label>
                  {loadingModes ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading modes...</span>
                    </div>
                  ) : (
                    <>
                      <Select 
                        value={selectedModeId || undefined} 
                        onValueChange={handleModeChange}
                        disabled={updatingMode}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a coaching mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {modes.map((mode) => (
                            <SelectItem key={mode.id} value={mode.id}>
                              {mode.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        This determines which coaching style and coaches are available to you.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div id="subscription-section" className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Subscription</h2>
              
              {loadingPlans ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  <span className="text-gray-500">Loading subscription plans...</span>
                </div>
              ) : plans.length > 0 ? (
                <div className="space-y-6">
                  {userProfile?.subscription_status === 'active' ? (
                    <div className="space-y-4">
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription>
                          You currently have an active subscription. Thank you for your support!
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={handleManageSubscription}
                        disabled={managingSubscription}
                        className="flex items-center"
                      >
                        {managingSubscription ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            Manage Subscription
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <div 
                          key={plan.id} 
                          className="border rounded-lg p-4 flex flex-col"
                        >
                          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{getModePlanDescriptions(plan.name)}</p>
                          <div className="text-2xl font-bold mb-4">${plan.price.toFixed(2)}<span className="text-sm font-normal text-gray-500">/{plan.interval}</span></div>
                          <div className="flex-grow">
                            <h4 className="font-medium mb-2">Features:</h4>
                            <ul className="space-y-1 mb-6">
                              {Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button 
                            onClick={() => handleStartCheckout(plan.stripe_price_id)}
                            disabled={processingPayment}
                            className="w-full"
                          >
                            {processingPayment ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              `Subscribe`
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Subscription plans will be available soon.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mode Change Confirmation Dialog */}
      <AlertDialog open={showModeChangeDialog} onOpenChange={setShowModeChangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Coaching Mode</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-2">
                Are you sure you want to change your coaching mode? This will affect:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>The coaches available to you will change</li>
                <li>Any scheduled calls for your current mode will not transfer to the new mode</li>
                <li>Your scheduled calls for the current mode will be saved if you switch back later</li>
              </ul>
              <p>Do you want to continue?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelModeChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmModeChange}
              disabled={updatingMode}
            >
              {updatingMode ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Continue'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Account;
