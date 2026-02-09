const LoginLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white/10 px-10 py-8 shadow-xl">
        
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>

        {/* Text */}
        <p className="text-sm tracking-widest text-white animate-pulse">
          LOGGING IN...
        </p>
      </div>
    </div>
  );
};

export default LoginLoading;
