

import React, { useState } from 'react';
import { CheckCircle, CreditCard, Wallet, Bitcoin, Lock, User, Mail, ShieldCheck, Globe, AlertTriangle } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/UIComponents';

export const CheckoutView: React.FC<{ onComplete: () => void; isDevMode?: boolean }> = ({ onComplete, isDevMode }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  
  return (
    <div className="max-w-6xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-white mb-8">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: Delivery Information & Order Review */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Delivery Info Card */}
            <Card title="1. Delivery Information">
              <div className="space-y-4">
                 <div className="bg-nexus-main/50 p-4 rounded-lg border border-nexus-border flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                    <div className="text-sm">
                       <p className="font-bold text-white mb-1">Seller Instructions:</p>
                       <p className="text-gray-400">Meet me in Stormwind City (Alliance) or Orgrimmar (Horde) near the Auction House. I will trade you the gold.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Character Name" placeholder="Exact Character Name" icon={User} />
                    <Input label="Server / Realm" placeholder="Select Server" icon={Globe} />
                 </div>
                 <Input label="Email for Receipt" placeholder="gamer@example.com" icon={Mail} />
              </div>
            </Card>

            {/* Review Card */}
            <Card title="2. Review Order">
               <div className="flex items-center gap-4 p-4 bg-nexus-main rounded-lg border border-nexus-border">
                   <div className="w-16 h-16 bg-gray-700 rounded-lg shrink-0 bg-[url('https://picsum.photos/200')] bg-cover"></div>
                   <div className="flex-1">
                      <div className="flex justify-between">
                         <h3 className="font-bold text-white">Fortnite Account - Galaxy Skin</h3>
                         <span className="font-bold text-white">$14.99</span>
                      </div>
                      <p className="text-sm text-gray-400">Seller: PixelStoreLAT</p>
                      <div className="flex gap-2 mt-2">
                         <Badge variant="purple">Qty: 1</Badge>
                         <Badge variant="success">Instant Delivery</Badge>
                      </div>
                   </div>
               </div>
            </Card>
         </div>

         {/* RIGHT COLUMN: Payment & Summary */}
         <div className="lg:col-span-4 space-y-6">
            <Card title="3. Payment Method" className="h-fit">
              <div className="space-y-3">
                 {[
                    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'wallet', name: 'Nexus Wallet ($150.00)', icon: Wallet },
                    { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin }
                 ].map(m => (
                    <div 
                       key={m.id}
                       onClick={() => setPaymentMethod(m.id)}
                       className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                          paymentMethod === m.id ? 'bg-nexus-primary/20 border-nexus-primary' : 'bg-nexus-main border-nexus-border hover:border-gray-500'
                       }`}
                    >
                       <div className="flex items-center gap-3">
                          <m.icon size={20} className={paymentMethod === m.id ? 'text-nexus-primary' : 'text-gray-400'} />
                          <span className={`font-medium ${paymentMethod === m.id ? 'text-white' : 'text-gray-400'}`}>{m.name}</span>
                       </div>
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === m.id ? 'border-nexus-primary' : 'border-gray-600'}`}>
                          {paymentMethod === m.id && <div className="w-2 h-2 bg-nexus-primary rounded-full"></div>}
                       </div>
                    </div>
                 ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-nexus-border space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                     <span>Subtotal</span>
                     <span>$14.99</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                     <span>Service Fee</span>
                     <span>$1.04</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-nexus-border border-dashed">
                     <span className="font-bold text-white">Total Pay</span>
                     <span className="font-black text-2xl text-nexus-primary">$16.03</span>
                  </div>

                  <Button 
                    fullWidth 
                    size="lg" 
                    className="mt-4 text-lg font-bold"
                    disabled={!paymentMethod} 
                    onClick={onComplete}
                  >
                     Pay Securely
                  </Button>

                  <div className="flex items-center justify-center text-xs text-green-500 pt-2">
                     <ShieldCheck size={14} className="mr-1.5" />
                     Payments processed securely by NexusGuard
                  </div>
              </div>
            </Card>
         </div>

      </div>
    </div>
  );
};