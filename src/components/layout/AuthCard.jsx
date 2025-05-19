export function AuthCard({ children }) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#101927] to-[#0C1A2B] p-8 shadow-xl shadow-black/40 backdrop-blur">
        {children}
      </div>
    );
  }