import { CheckCircle2, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface SuccessAnimationProps {
  title: string;
  message: string;
  trackingId: string;
  onComplete: () => void;
}

export function SuccessAnimation({ title, message, trackingId, onComplete }: SuccessAnimationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Fallback: create temporary input and select text
    const input = document.createElement('input');
    input.value = trackingId;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      document.body.removeChild(input);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-2xl p-12 max-w-md mx-4 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
        >
          <CheckCircle2 className="text-green-600" size={48} />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-900 mb-4"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-6"
        >
          {message}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <p className="text-gray-500 mb-2">Your Tracking ID:</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between gap-3">
            <span id="tracking-id-text" className="font-mono font-bold text-blue-600">{trackingId}</span>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white rounded transition-colors"
              title="Copy tracking ID"
            >
              {copied ? (
                <Check className="text-green-600" size={20} />
              ) : (
                <Copy className="text-blue-600" size={20} />
              )}
            </button>
          </div>
          <p className="text-gray-500 mt-2">Save this ID to track your application</p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}