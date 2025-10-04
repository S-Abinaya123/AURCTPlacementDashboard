import { Loader2 } from "lucide-react"; // spinner icon

export default function VerifyingUser() {
  return (
    <div className="flex items-center justify-center h-[100dvh] w-[100dvw] fixed inset-0 bg-black/30 z-50">
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-lg border border-orange-200">
        
        {/* Spinner */}
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />

        {/* Message */}
        <h2 className="text-xl font-semibold text-orange-800">
          Verifying Otp
        </h2>
        <p className="text-sm text-orange-600">
          Please wait while we verify your otp...
        </p>
      </div>
    </div>
  );
}
