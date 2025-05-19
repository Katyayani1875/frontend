import React, { useEffect, useState } from 'react';

const PointerAnimator = ({ text = '', speed = 70, className = '' }) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <div
      className={`text-white font-mono text-lg md:text-2xl lg:text-3xl whitespace-pre-wrap ${className}`}
    >
      {displayed}
      <span className="animate-blink text-blue-400 ml-1">|</span>
    </div>
  );
};

export default PointerAnimator;
