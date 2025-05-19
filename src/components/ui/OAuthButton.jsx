export function OAuthButton({ provider, icon: Icon, onClick }) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-600 bg-neutral-900 py-2 text-white transition hover:bg-neutral-800"
      >
        <Icon className="h-5 w-5" />
        <span>Continue with {provider}</span>
      </button>
    );
  }
  