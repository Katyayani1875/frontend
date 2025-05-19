import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import manAnimation from '../assets/animations/job-seeker.json';
import womanAnimation from '../assets/animations/job-helper.json';
import { Player } from '@lottiefiles/react-lottie-player';

const dialogues = [
  { speaker: 'man', text: "Hi Shanaya, I'm looking for a job." },
  { speaker: 'woman', text: "Hey!!! Karan welcome Job Hunt is the perfect place for you." },
  { speaker: 'woman', text: "We use AI to help you find the best opportunities." },
  { speaker: 'man', text: "That sounds amazing Shanaya, Lets go!!" },
];

const checklistItems = [
  'Get hired by top companies',
  'Resume analyzer powered by AI',
  'Smart job recommendations',
  'Chat Assistant like ChatGPT',
];

const SplashScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [checklistIndex, setChecklistIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= dialogues.length) {
          clearInterval(timer);
          setTimeout(() => {
            setShowWelcome(true);
          }, 5000);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showWelcome && checklistIndex < checklistItems.length) {
      const item = checklistItems[checklistIndex];
      if (charIndex < item.length) {
        const typingTimer = setTimeout(() => {
          setTypedText((prev) => prev + item.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        }, 50);
        return () => clearTimeout(typingTimer);
      } else {
        setTimeout(() => {
          setChecklistIndex((prev) => prev + 1);
          setCharIndex(0);
          setTypedText('');
        }, 700);
      }
    }
  }, [showWelcome, checklistIndex, charIndex]);

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C1A2B] text-white p-6 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-10 text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide">Welcome to Job Hunt</h1>

        <ul className="text-lg md:text-xl space-y-4 font-medium">
          {checklistItems.slice(0, checklistIndex).map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 animate-fade-in-up">
              <span className="text-green-400 text-2xl">✔</span> {item}
            </li>
          ))}
          {checklistIndex < checklistItems.length && (
            <li className="flex items-center gap-3 animate-fade-in-up">
              <span className="text-green-400 text-2xl">✔</span>
              <span className="whitespace-pre">{typedText}</span>
            </li>
          )}
        </ul>

        <button
          onClick={() => navigate('/register')}
          className="mt-12 px-8 py-4 bg-gradient-to-tr from-blue-600 to-purple-700 hover:scale-105 transition-transform duration-300 text-white font-semibold rounded-xl shadow-[0_5px_25px_rgba(59,130,246,0.6)]"
        >
           Explore Job Hunt
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#0C1A2B] relative overflow-hidden">
      <Player
        autoplay
        loop
        src={manAnimation}
        style={{ height: '280px', width: '280px', position: 'absolute', left: '10%', bottom: '10%' }}
      />
      <Player
        autoplay
        loop
        src={womanAnimation}
        style={{ height: '280px', width: '280px', position: 'absolute', right: '10%', bottom: '10%' }}
      />

      {dialogues[currentIndex] && (
        <div
          className={`absolute max-w-xs text-sm md:text-lg font-medium p-4 rounded-2xl shadow-xl transition-all duration-500 
            ${dialogues[currentIndex].speaker === 'man'
              ? 'left-[25%] top-[30%] bg-blue-200 text-blue-900'
              : 'right-[25%] top-[30%] bg-pink-200 text-pink-900'
            }`}
        >
          <div className="relative">
            <div className="p-3 rounded-lg shadow-md bg-white text-black">
              {dialogues[currentIndex].text}
            </div>
            <div
              className={`absolute w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent
                ${dialogues[currentIndex].speaker === 'man'
                  ? 'border-t-[12px] border-t-blue-200 -bottom-3 left-3'
                  : 'border-t-[12px] border-t-pink-200 -bottom-3 right-3'
                }`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
