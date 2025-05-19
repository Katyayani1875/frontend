import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C1A2B] text-white">
      <Header />
      <main className="flex-1 px-4 sm:px-10 py-6">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
