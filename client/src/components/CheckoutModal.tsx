import { useState, type FC } from 'react';
import type { PlanData, CustomizationState } from '../types';
import { X, Check, ShieldCheck, Download, CreditCard, Sparkles, Box, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanData;
  customization: CustomizationState;
  currency: 'USD' | 'INR' | 'EUR';
  onDownloadPdf: () => void;
  onDownloadBlenderScript: () => void;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  customization,
  currency,
  onDownloadPdf,
  onDownloadBlenderScript
}) => {
  const [selectedTier, setSelectedTier] = useState<'standard' | 'pro'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const pricing = {
    standard: {
      USD: 49,
      INR: 2499,
      EUR: 45,
      title: 'Standard Construction Blueprint Package',
      desc: 'Everything required to submit for permits and hand off to a builder.'
    },
    pro: {
      USD: 79,
      INR: 3999,
      EUR: 75,
      title: 'Pro Studio 4K Walkthrough & BIM Package',
      desc: 'Complete architectural blueprints + 1080p Walkthrough Video + Blender Script.'
    }
  };

  const currentPrice = pricing[selectedTier][currency];
  const currencySymbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : '€';

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const txn = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setTransactionId(txn);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/50">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {isSuccess ? 'Payment Verified • Construction Package Ready' : 'Unlock Construction Handoff Package'}
              </h2>
              <p className="text-xs text-slate-400">
                Plan Ref: <span className="font-mono text-cyan-400">{plan.meta.planId}</span> ({plan.plot.widthFt}' × {plan.plot.depthFt}' {plan.plot.facing} • {customization.roofType.replace('_', ' ')})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {!isSuccess ? (
            <>
              {/* Package Tier Selection */}
              <div className="grid grid-cols-2 gap-3">
                {/* Standard Tier */}
                <button
                  onClick={() => setSelectedTier('standard')}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    selectedTier === 'standard'
                      ? 'bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-300">Standard Pack</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {currencySymbol}{pricing.standard[currency]}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    2D Permitted Blueprint PDF + 3D Render Images + Bill of Quantities.
                  </div>
                </button>

                {/* Pro Tier (Recommended) */}
                <button
                  onClick={() => setSelectedTier('pro')}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    selectedTier === 'pro'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/50'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                  <div className="text-xs font-semibold text-indigo-300">Pro Studio Pack</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {currencySymbol}{pricing.pro[currency]}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Everything in Standard + 1080p 60FPS Video Tour + Blender Script (.py).
                  </div>
                </button>
              </div>

              {/* What is included in this package */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Contractor Construction Deliverables Checklist:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>2D Scaled Blueprint PDF (1:100 Scale)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Exact Room & Setback Dimensions</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>4K Exterior & Interior 3D Renders</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Material Estimation & Area Schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Executable Blender Python (.py) Script</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{plan.meta.vastuEnabled ? '16-Zone Vastu Compliance Audit' : 'Passive Solar Daylighting Report'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'card'
                        ? 'bg-slate-800 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-semibold">Credit / Debit Card</span>
                    <span className="text-[9px] text-slate-500">Stripe Global</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-slate-800 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-base font-bold"> / GPay</span>
                    <span className="text-[11px] font-semibold">1-Click Mobile</span>
                    <span className="text-[9px] text-slate-500">Apple & Google</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'upi'
                        ? 'bg-slate-800 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold text-amber-400 font-mono">UPI / QR</span>
                    <span className="text-[11px] font-semibold">GPay / PhonePe</span>
                    <span className="text-[9px] text-slate-500">Razorpay India</span>
                  </button>
                </div>
              </div>

              {/* Security Guarantee */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-bit SSL encrypted checkout. 100% money-back satisfaction guarantee.</span>
              </div>
            </>
          ) : (
            /* Post-Payment Success View */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Payment Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Transaction Ref: <span className="font-mono text-cyan-400 font-bold">{transactionId}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Your complete builder handoff files have been generated.
                </p>
              </div>

              {/* Direct Download Buttons */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={onDownloadPdf}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Blueprint PDF</span>
                </button>

                <button
                  onClick={onDownloadBlenderScript}
                  className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Download Blender Script (.py)</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-500 italic">
                A copy has also been sent to your registered email address.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Total Payable:</span>
              <div className="text-lg font-bold text-white">
                {currencySymbol}{currentPrice}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <span>Complete Payment & Unlock</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
