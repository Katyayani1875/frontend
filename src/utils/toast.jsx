import toast from 'react-hot-toast';

export const successToast = (message) => {
  toast.success(message, {
    style: {
      background: '#DCFCE7',
      color: '#065F46',
      border: '1px solid #BBF7D0',
      fontWeight: 500,
    },
    iconTheme: {
      primary: '#22C55E',
      secondary: '#F0FDF4',
    },
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    style: {
      background: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #FECACA',
      fontWeight: 500,
    },
    iconTheme: {
      primary: '#EF4444',
      secondary: '#FEF2F2',
    },
  });
};
