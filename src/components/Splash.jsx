import { useTranslation } from 'react-i18next';

const Splash = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 to-white text-center p-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">{t('welcome')}</h1>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg transition-all shadow-md mt-4 animate-fadeIn delay-200">
        {t('explore')}
      </button>
    </div>
  );
};

export default Splash;
