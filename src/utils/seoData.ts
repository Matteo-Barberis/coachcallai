
interface SEOData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const generateSEOData = (route: string): SEOData => {
  let seoData: SEOData;
  
  switch (route) {
    case '/':
      seoData = {
        title: 'Coach Call AI | Personalized AI Life Companion',
        description: 'Your ever-present AI companion on WhatsApp and voice calls. Get personalized support, gentle reminders, and empathetic conversations tailored to your unique style and needs.',
        ogTitle: 'Coach Call AI | Personalized AI Life Companion',
        ogDescription: 'Build your custom AI companion with personalized coaching styles. Get support, reminders, and guidance tailored exactly to your needs.',
        twitterTitle: 'Coach Call AI | Personalized AI Life Companion',
        twitterDescription: 'Build your custom AI companion with personalized coaching styles. Get support, reminders, and guidance tailored exactly to your needs.'
      };
      break;
    
    case '/accountability':
      seoData = {
        title: 'Coach Call AI | AI Accountability Partner with Phone Calls & WhatsApp',
        description: 'Coach Call AI keeps you accountable through WhatsApp messages and phone calls, helping you achieve your goals and build lasting habits.',
        ogTitle: 'Coach Call AI | AI Accountability Partner with Phone Calls & WhatsApp',
        ogDescription: 'Stay on track with your AI accountability partner. Get tough love reminders, progress tracking, and motivation to achieve your goals.',
        twitterTitle: 'Coach Call AI | AI Accountability Partner with Phone Calls & WhatsApp',
        twitterDescription: 'Stay on track with your AI accountability partner. Get tough love reminders, progress tracking, and motivation to achieve your goals.'
      };
      break;
    
    case '/mindfulness':
      seoData = {
        title: 'Coach Call AI | AI Mindfulness & Meditation Guide with Phone Calls & WhatsApp',
        description: 'Your personal AI mindfulness companion for daily guidance, gratitude practices, and mindful moments. Nurture inner peace and self-love through WhatsApp and voice call support.',
        ogTitle: 'Coach Call AI | AI Mindfulness & Meditation Guide with Phone Calls & WhatsApp',
        ogDescription: 'Find inner peace with your AI mindfulness companion. Get guided meditation, breathing exercises, and gentle reminders for mental wellness.',
        twitterTitle: 'Coach Call AI | AI Mindfulness & Meditation Guide with Phone Calls & WhatsApp',
        twitterDescription: 'Find inner peace with your AI mindfulness companion. Get guided meditation, breathing exercises, and gentle reminders for mental wellness.'
      };
      break;
    
    default:
      seoData = {
        title: 'Coach Call AI | Your Personal AI Companion for Friendship & Support with Phone Calls & WhatsApp',
        description: 'Meet your AI companion that\'s always by your side on WhatsApp and voice calls. Get personalized support, gentle reminders, and empathetic conversations tailored to your unique style and needs.',
        ogTitle: 'Coach Call AI | Your Personal AI Companion for Friendship & Support with Phone Calls & WhatsApp',
        ogDescription: 'Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it.',
        twitterTitle: 'Coach Call AI | Your Personal AI Companion for Friendship & Support with Phone Calls & WhatsApp',
        twitterDescription: 'Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it.'
      };
      break;
  }
  
  return seoData;
};
