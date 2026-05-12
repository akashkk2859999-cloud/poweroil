import { Link } from 'react-router-dom';
import { Video, Upload, ClipboardList, Share2, Trophy, CheckCircle, XCircle, ChefHat } from 'lucide-react';

const steps = [
  {
    icon: Video,
    number: '01',
    title: 'Create Your Cooking Video',
    description: 'Cook your favourite Nigerian dish using PowerOil. Film the process from preparation to the finished plate. Make sure the video is clear, well-lit, and shows your cooking skills.',
    tips: ['Video must be at least 30 seconds long', 'Show the cooking process clearly', 'Feature PowerOil in your video', 'Ensure good lighting and sound'],
  },
  {
    icon: Upload,
    number: '02',
    title: 'Post on Social Media',
    description: 'Upload your cooking video to any of the supported social media platforms: Instagram, TikTok, Facebook, YouTube, or X (Twitter). Make your post public so judges and voters can see it.',
    tips: ['Post must be public', 'Caption your post with #PowerOilMasterChef', 'Accepted platforms: Instagram, TikTok, Facebook, YouTube, X', 'Copy the URL of your post'],
  },
  {
    icon: ClipboardList,
    number: '03',
    title: 'Register on This Site',
    description: 'Visit the registration page and fill in your details including your name, phone number, state, and the social media post URL. Your entry will be reviewed by our team within 24-48 hours.',
    tips: ['One entry per participant', 'Provide accurate personal details', 'Phone number must be valid', 'You must be 18 years or older'],
  },
  {
    icon: Share2,
    number: '04',
    title: 'Share Your Voting Link',
    description: 'Once your entry is approved, you\'ll receive a unique voting page link. Share this link with your friends, family, and followers and ask them to vote for you!',
    tips: ['Share on WhatsApp, Facebook, Instagram', 'Each voter can vote once per participant', 'Voters need to provide a phone number', 'More votes = better chance of winning'],
  },
  {
    icon: Trophy,
    number: '05',
    title: 'Win Amazing Prizes',
    description: 'The participant with the most votes at the end of the campaign wins the PowerOil MasterChef Nigeria crown and amazing prizes. Winners will be announced on our social media channels.',
    tips: ['Voting closes on the campaign end date', 'Top 3 participants win prizes', 'Results announced live', 'Winners must be reachable via phone/email'],
  },
];

const eligibility = [
  { icon: CheckCircle, text: 'Nigerian resident aged 18 or older', positive: true },
  { icon: CheckCircle, text: 'Must use PowerOil in your cooking video', positive: true },
  { icon: CheckCircle, text: 'Active social media account (public)', positive: true },
  { icon: CheckCircle, text: 'Valid phone number for registration', positive: true },
  { icon: XCircle, text: 'Employees of PowerOil and their families are not eligible', positive: false },
  { icon: XCircle, text: 'Purchased or incentivised votes will lead to disqualification', positive: false },
  { icon: XCircle, text: 'Duplicate entries will be removed', positive: false },
];

export default function HowItWorksPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge-yellow mb-3">Guide</div>
          <h1 className="section-heading mb-4">How It Works</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Follow these simple steps to enter the PowerOil MasterChef Nigeria competition and compete for the crown.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 md:gap-10">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center flex-shrink-0 shadow-green-lg">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                {i < steps.length - 1 && <div className="flex-1 w-0.5 bg-gray-200 mt-4" />}
              </div>
              <div className="pb-12 flex-1">
                <div className="text-brand-green text-xs font-bold tracking-widest mb-1">STEP {step.number}</div>
                <h3 className="font-display font-black text-2xl text-brand-black mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <ul className="space-y-2">
                    {step.tips.map((tip, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <div className="card p-8 mb-12">
          <h2 className="font-display font-black text-2xl text-brand-black mb-6">Eligibility Criteria</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eligibility.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${item.positive ? 'text-brand-green' : 'text-brand-red'}`} />
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-brand-green rounded-2xl p-10 text-white shadow-green-lg">
          <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="font-display font-black text-3xl mb-4">Ready to compete?</h3>
          <p className="text-green-100 mb-8">Register now and let Nigeria vote for your best dish!</p>
          <Link to="/register" className="btn-yellow inline-flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
