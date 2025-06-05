
interface SEOData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const generateSEOData = (route: string): SEOData => {
  console.log('generateSEOData called with route:', route);
  
  let seoData: SEOData;
  
  switch (route) {
    case '/':
      seoData = {
        title: 'Coach Call AI | Personalized AI Life Companion',
        description: 'Build your custom AI companion with personalized coaching styles. Get support, reminders, and guidance tailored exactly to your needs on WhatsApp and voice calls.',
        ogTitle: 'Coach Call AI | Personalized AI Life Companion',
        ogDescription: 'Build your custom AI companion with personalized coaching styles. Get support, reminders, and guidance tailored exactly to your needs.',
        twitterTitle: 'Coach Call AI | Personalized AI Life Companion',
        twitterDescription: 'Build your custom AI companion with personalized coaching styles. Get support, reminders, and guidance tailored exactly to your needs.'
      };
      break;
    
    case '/accountability':
      seoData = {
        title: 'Coach Call AI | AI Accountability Partner for Goal Achievement',
        description: 'Stay on track with your AI accountability partner. Get tough love reminders, progress tracking, and motivation to achieve your goals through WhatsApp and voice calls.',
        ogTitle: 'Coach Call AI | AI Accountability Partner for Goal Achievement',
        ogDescription: 'Stay on track with your AI accountability partner. Get tough love reminders, progress tracking, and motivation to achieve your goals.',
        twitterTitle: 'Coach Call AI | AI Accountability Partner for Goal Achievement',
        twitterDescription: 'Stay on track with your AI accountability partner. Get tough love reminders, progress tracking, and motivation to achieve your goals.'
      };
      break;
    
    case '/mindfulness':
      seoData = {
        title: 'Coach Call AI | AI Mindfulness & Meditation Guide',
        description: 'Find inner peace with your AI mindfulness companion. Get guided meditation, breathing exercises, and gentle reminders for mental wellness on WhatsApp and voice calls.',
        ogTitle: 'Coach Call AI | AI Mindfulness & Meditation Guide',
        ogDescription: 'Find inner peace with your AI mindfulness companion. Get guided meditation, breathing exercises, and gentle reminders for mental wellness.',
        twitterTitle: 'Coach Call AI | AI Mindfulness & Meditation Guide',
        twitterDescription: 'Find inner peace with your AI mindfulness companion. Get guided meditation, breathing exercises, and gentle reminders for mental wellness.'
      };
      break;
    
    default:
      seoData = {
        title: 'Coach Call AI | Your Personal AI Companion for Life Support & Guidance',
        description: 'Meet your AI companion that\'s always by your side on WhatsApp and voice calls. Get personalized support, gentle reminders, and empathetic conversations tailored to your unique style and needs.',
        ogTitle: 'Coach Call AI | Your Personal AI Companion for Life Support',
        ogDescription: 'Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it.',
        twitterTitle: 'Coach Call AI | Your Personal AI Companion for Life Support',
        twitterDescription: 'Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it.'
      };
      break;
  }
  
  console.log('Generated SEO data:', seoData);
  return seoData;
};
