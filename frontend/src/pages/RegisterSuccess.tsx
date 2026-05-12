import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ChefHat, Share2, Clock } from 'lucide-react';

export default function RegisterSuccessPage() {
  const location = useLocation();
  const { participantCode, fullName } = (location.state as { participantCode?: string; fullName?: string }) || {};

  if (!participantCode) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No registration data found.</p>
          <Link to="/register" className="btn-primary">Go to Registration</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 min-h-[70vh] flex items-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-green-lg">
            <CheckCircle className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-3xl text-brand-black mb-3">
            You're In, {fullName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your entry has been submitted successfully and is now <strong>pending review</strong> by our team.
            You'll receive a voting link once your entry is approved.
          </p>

          <div className="bg-brand-green-dark rounded-2xl p-5 mb-6">
            <p className="text-green-300 text-xs mb-1 uppercase tracking-wider font-semibold">Your Participant Code</p>
            <p className="font-display font-black text-brand-yellow text-3xl tracking-widest">{participantCode}</p>
            <p className="text-green-400 text-xs mt-1">Save this code — you may need it later</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 text-sm">What happens next?</p>
                <ul className="text-blue-700 text-sm mt-2 space-y-1">
                  <li>1. Our team will review your entry within 24–48 hours</li>
                  <li>2. If approved, a unique voting page will be created for you</li>
                  <li>3. Share your voting link with friends and family to collect votes</li>
                  <li>4. The contestant with the most votes wins!</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/entries" className="btn-secondary text-sm py-3">
              View All Entries
            </Link>
            <Link to="/" className="btn-primary text-sm py-3 flex items-center justify-center gap-2">
              <ChefHat className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
