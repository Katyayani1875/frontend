import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-green-400 w-5 h-5" />,
  error: <XCircle className="text-red-400 w-5 h-5" />,
  info: <Info className="text-blue-400 w-5 h-5" />,
};

const Notification = ({ type = 'info', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideInUp">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl
        text-white backdrop-blur-sm transition-all duration-300
        bg-[#0C1A2BDD] border border-white/10
      `}>
        {icons[type]}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
