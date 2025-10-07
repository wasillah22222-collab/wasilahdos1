import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, CreditCard, Smartphone } from 'lucide-react';

const DonationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && widgetRef.current) {
      widgetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [isOpen]);

  const paymentMethods = [
    {
      name: 'Easypaisa',
      icon: Smartphone,
      account: '03349682146',
      type: 'mobile',
      instructions: 'Send your donation to this Easypaisa number',
      color: 'bg-green-600'
    },
    {
      name: 'Mastercard',
      icon: CreditCard,
      account: '19367902143803',
      bank: 'Habib Bank Limited',
      type: 'card',
      instructions: 'Bank transfer to this account number',
      color: 'bg-blue-600'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Account number copied to clipboard!');
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-[calc(50%+100px)] z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-full shadow-luxury-glow flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse group"
          title="Support Our Mission"
        >
          <Heart className="w-6 h-6 mr-2" fill="currentColor" />
          <span className="font-luxury-semibold text-lg whitespace-nowrap">DONATE NOW!</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={widgetRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md max-h-[90vh] overflow-y-auto luxury-card bg-cream-white rounded-luxury-lg shadow-luxury-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-luxury-heading text-lg">Support Wasilah</h3>
                <p className="text-sm opacity-90">Make a difference today</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-black font-luxury-body mb-6 text-center">
              Your generous donations help us continue our mission of empowering communities and creating lasting positive change.
            </p>

            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-luxury p-4 hover:border-vibrant-orange transition-colors">
                  <div className="flex items-center mb-3">
                    <div className={`${method.color} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-luxury-heading text-black">{method.name}</h4>
                      {method.bank && (
                        <p className="text-xs text-gray-600 font-luxury-body">{method.bank}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-luxury p-3 mb-2">
                    <p className="text-xs text-gray-600 font-luxury-body mb-1">{method.instructions}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-luxury-semibold text-black text-lg">{method.account}</p>
                      <button
                        onClick={() => copyToClipboard(method.account)}
                        className="text-vibrant-orange hover:text-vibrant-orange-dark text-sm font-luxury-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-vibrant-orange/10 rounded-luxury">
              <p className="text-sm text-black font-luxury-body text-center">
                After making a donation, please email us at{' '}
                <a href="mailto:donations@wasilah.org" className="text-vibrant-orange-dark font-luxury-semibold">
                  donations@wasilah.org
                </a>{' '}
                with your transaction details for acknowledgment.
              </p>
            </div>
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default DonationWidget;
