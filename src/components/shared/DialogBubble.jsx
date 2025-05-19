// src/components/shared/DialogBubble.jsx
import React from 'react';

const DialogBubble = ({ speaker, text }) => {
  const isMan = speaker === 'man';

  return (
    <div
      className={`absolute text-lg font-medium p-4 rounded-xl shadow-lg max-w-xs transition-all duration-500
        ${isMan ? 'left-[25%] top-[30%] bg-blue-100 text-blue-900' : 'right-[25%] top-[30%] bg-pink-100 text-pink-900'}`}
    >
      <div className="relative">
        <div className="bg-white p-3 rounded-md shadow-md">{text}</div>
        <div
          className={`absolute w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent
          ${isMan ? 'border-t-[12px] border-t-blue-100 -bottom-3 left-3' : 'border-t-[12px] border-t-pink-100 -bottom-3 right-3'}`}
        ></div>
      </div>
    </div>
  );
};

export default DialogBubble;
