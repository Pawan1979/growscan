import React, { useState } from 'react';
import { X, Phone, KeyRound } from 'lucide-react';
import { auth } from '../config/firebase';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

interface LoginModalProps {
  appVerifier: RecaptchaVerifier | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ appVerifier, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!appVerifier) {
      setError('reCAPTCHA not ready yet. Please wait a moment and try again.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6 || !confirmationResult) return;
    setError('');
    setLoading(true);

    try {
      // Wrap in a 15-second timeout to prevent infinite spinner
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Verification timed out. Please try again.')), 15000)
      );
      await Promise.race([confirmationResult.confirm(otp), timeoutPromise]);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-sm text-slate-400">
            You've reached your free daily search limit (3). Please log in with your mobile number to continue.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Mobile Number</label>
              <div className="flex bg-slate-950 border-2 border-slate-800 focus-within:border-indigo-500 rounded-xl overflow-hidden transition-colors">
                <span className="flex items-center px-4 text-slate-500 font-semibold bg-slate-900">+91</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phoneNumber.length < 10}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Enter OTP</label>
              <div className="flex bg-slate-950 border-2 border-slate-800 focus-within:border-indigo-500 rounded-xl overflow-hidden transition-colors">
                <span className="flex items-center px-4 text-slate-500">
                  <KeyRound className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-slate-600 focus:outline-none tracking-[0.5em] font-mono text-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
