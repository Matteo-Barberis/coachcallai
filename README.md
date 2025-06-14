
# CoachCall.ai

**AI-Powered Personal Coaching Through Voice & WhatsApp**

CoachCall.ai is an innovative AI coaching platform that provides personalized guidance through natural voice conversations and WhatsApp messaging. Our AI coaches help users achieve their goals across multiple domains including accountability, mindfulness, and custom coaching experiences.

## 🚀 Features

### Core Functionality
- **Voice-First Coaching**: Natural AI conversations through phone calls
- **WhatsApp Integration**: Seamless coaching through familiar messaging
- **Multi-Modal Coaching**: Accountability, Mindfulness, and Custom coaching modes
- **Progress Tracking**: Comprehensive analytics and insights
- **Personalized Experience**: Tailored coaching based on user goals and preferences

### Platform Capabilities
- **Smart Scheduling**: Automated call scheduling and reminders
- **Real-time Analytics**: Track progress, trends, and achievements
- **Custom Coach Voices**: Multiple AI coach personalities and voices
- **Goal Management**: Set, track, and achieve personal objectives
- **Achievement System**: Milestone tracking and celebration

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query** for state management
- **Recharts** for data visualization

### Backend & Infrastructure
- **Supabase** for database and authentication
- **VAPI** for AI voice integration
- **Stripe** for payment processing
- **Vercel** for deployment

### Key Libraries
- Lucide React (icons)
- React Hook Form (forms)
- Zod (validation)
- Date-fns (date handling)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- VAPI account (for voice features)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Add other required environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── custom/         # Custom coaching mode components
│   └── mindfulness/    # Mindfulness coaching components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── context/            # React context providers
├── config/             # Configuration files
└── integrations/       # Third-party integrations
```

## 🎯 Features by Mode

### Accountability Coaching
- Goal setting and tracking
- Progress monitoring
- Habit formation support
- Regular check-ins and motivation

### Mindfulness Coaching
- Meditation guidance
- Stress management techniques
- Mindful living practices
- Emotional regulation support

### Custom Coaching
- Personalized coaching experiences
- Flexible goal frameworks
- Adaptive conversation flows
- Custom achievement metrics

## 🚀 Deployment

### Quick Deploy with Lovable
1. Open [Lovable Project](https://lovable.dev/projects/f26063bd-2813-491b-a2c3-c41d55d29dfa)
2. Click Share → Publish
3. Your app will be live instantly

### Custom Domain Deployment
For custom domains, we recommend Netlify:
1. Connect your repository to Netlify
2. Configure build settings
3. Set up environment variables
4. Deploy

See [Custom Domain Guide](https://docs.lovable.dev/tips-tricks/custom-domain/) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write clean, self-documenting code
- Test new features thoroughly
- Maintain responsive design principles

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

Need help? Reach out to us:
- **Email**: support@coachcall.ai
- **Website**: [coachcall.ai](https://coachcall.ai)

---

**Built with ❤️ using React, TypeScript, and VAPI**
