import './animation.css';

const OtpLoading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-[100dvh] w-[100dvw] fixed top-0 left-0 z-50 bg-black/30">
            <div className="text-center bg-white md:p-14 p-10 rounded-xl shadow-md max-sm:w-[90dvw]">

                {/* Loading animation */}
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full bounce-tall" style={{ animationDelay: "-0.3s" }}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full bounce-tall" style={{ animationDelay: "-0.15s" }}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full bounce-tall"></div>
                </div>

                <h2 className="text-lg font-semibold text-gray-700 mt-8">Sending OTP to your email...</h2>
                <p className="text-sm text-gray-500 mt-2">Please wait while we generate your secure OTP.</p>
            </div>
        </div>
    );
};

export default OtpLoading;