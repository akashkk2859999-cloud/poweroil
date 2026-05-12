import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChefHat, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerParticipant } from '../api/participants';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
  'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe','Imo','Jigawa','Kaduna','Kano',
  'Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(120),
  phone: z.string().min(8, 'Enter a valid phone number').max(20),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(2, 'City is required').max(80),
  ageConfirmed: z.literal(true, { errorMap: () => ({ message: 'You must be 18 or older to participate' }) }),
  socialPlatform: z.enum(['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X'], { errorMap: () => ({ message: 'Select a social platform' }) }),
  socialHandle: z.string().min(2, 'Social handle is required').max(80),
  socialPostUrl: z.string().url('Enter a valid URL to your social post').max(500),
  dishName: z.string().max(120).optional(),
  caption: z.string().max(500).optional(),
  consentContentUsage: z.literal(true, { errorMap: () => ({ message: 'Content usage consent is required' }) }),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms and conditions' }) }),
  marketingOptIn: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { marketingOptIn: false },
  });

  const platform = watch('socialPlatform');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await registerParticipant({
        ...data,
        ageConfirmed: true,
        consentContentUsage: true,
        acceptedTerms: true,
        email: data.email || undefined,
      });
      navigate('/register/success', { state: { participantCode: result.participantCode, fullName: data.fullName } });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformUrls: Record<string, string> = {
    Instagram: 'https://www.instagram.com/p/...',
    TikTok: 'https://www.tiktok.com/@user/video/...',
    Facebook: 'https://www.facebook.com/user/videos/...',
    YouTube: 'https://www.youtube.com/watch?v=...',
    X: 'https://x.com/user/status/...',
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-green-lg">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <h1 className="section-heading mb-3">Enter the Competition</h1>
          <p className="text-gray-500">Fill in the details below to submit your entry for PowerOil MasterChef Nigeria.</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="font-display font-black text-brand-black text-lg mb-4 pb-2 border-b border-gray-100">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Full Name *</label>
                  <input {...register('fullName')} className="input-field" placeholder="Your full name" />
                  {errors.fullName && <p className="text-brand-red text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input {...register('phone')} className="input-field" placeholder="+234 800 000 0000" type="tel" />
                  {errors.phone && <p className="text-brand-red text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input {...register('email')} className="input-field" placeholder="you@example.com" type="email" />
                  {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">State *</label>
                  <select {...register('state')} className="input-field bg-white">
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-brand-red text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="label">City *</label>
                  <input {...register('city')} className="input-field" placeholder="Your city" />
                  {errors.city && <p className="text-brand-red text-xs mt-1">{errors.city.message}</p>}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="font-display font-black text-brand-black text-lg mb-4 pb-2 border-b border-gray-100">Your Social Media Post</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Social Platform *</label>
                  <select {...register('socialPlatform')} className="input-field bg-white">
                    <option value="">Select platform</option>
                    {['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X'].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.socialPlatform && <p className="text-brand-red text-xs mt-1">{errors.socialPlatform.message}</p>}
                </div>
                <div>
                  <label className="label">Social Handle / Username *</label>
                  <input {...register('socialHandle')} className="input-field" placeholder="@yourhandle" />
                  {errors.socialHandle && <p className="text-brand-red text-xs mt-1">{errors.socialHandle.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Post URL *</label>
                  <input
                    {...register('socialPostUrl')}
                    className="input-field"
                    placeholder={platform ? platformUrls[platform] : 'https://...'}
                    type="url"
                  />
                  <p className="text-gray-400 text-xs mt-1">Paste the direct URL to your cooking video post</p>
                  {errors.socialPostUrl && <p className="text-brand-red text-xs mt-1">{errors.socialPostUrl.message}</p>}
                </div>
              </div>
            </div>

            {/* Dish Info */}
            <div>
              <h2 className="font-display font-black text-brand-black text-lg mb-4 pb-2 border-b border-gray-100">Your Dish (Optional)</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label">Dish Name</label>
                  <input {...register('dishName')} className="input-field" placeholder="e.g. Jollof Rice with Fried Chicken" />
                </div>
                <div>
                  <label className="label">Caption / Description</label>
                  <textarea {...register('caption')} className="input-field" rows={3} placeholder="Tell us about your dish and why it deserves to win..." />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <input {...register('ageConfirmed')} type="checkbox" id="ageConfirmed" className="mt-1 w-4 h-4 accent-brand-green" />
                <label htmlFor="ageConfirmed" className="text-sm text-gray-700">
                  <span className="font-semibold">I confirm I am 18 years or older.</span> *
                </label>
              </div>
              {errors.ageConfirmed && <p className="text-brand-red text-xs ml-7">{errors.ageConfirmed.message}</p>}

              <div className="flex items-start gap-3">
                <input {...register('consentContentUsage')} type="checkbox" id="consentContentUsage" className="mt-1 w-4 h-4 accent-brand-green" />
                <label htmlFor="consentContentUsage" className="text-sm text-gray-700">
                  <span className="font-semibold">I consent to PowerOil using my video</span> for marketing and promotional purposes. *
                </label>
              </div>
              {errors.consentContentUsage && <p className="text-brand-red text-xs ml-7">{errors.consentContentUsage.message}</p>}

              <div className="flex items-start gap-3">
                <input {...register('acceptedTerms')} type="checkbox" id="acceptedTerms" className="mt-1 w-4 h-4 accent-brand-green" />
                <label htmlFor="acceptedTerms" className="text-sm text-gray-700">
                  I have read and accept the{' '}
                  <Link to="/terms" target="_blank" className="text-brand-green underline font-semibold">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank" className="text-brand-green underline font-semibold">Privacy Policy</Link>. *
                </label>
              </div>
              {errors.acceptedTerms && <p className="text-brand-red text-xs ml-7">{errors.acceptedTerms.message}</p>}

              <div className="flex items-start gap-3">
                <input {...register('marketingOptIn')} type="checkbox" id="marketingOptIn" className="mt-1 w-4 h-4 accent-brand-green" />
                <label htmlFor="marketingOptIn" className="text-sm text-gray-500">
                  I'd like to receive updates, promotions, and news from PowerOil.
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}             className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 text-base">
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><ChefHat className="w-5 h-5" /> Submit My Entry</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
