import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from "../../lib/utils";


const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={cn(
            'w-full rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg transition-all',
            sizes[size]
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
