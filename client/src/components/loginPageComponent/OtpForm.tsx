import { useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react';
import emailSecurityIcon from '../../assets/loginPageImage/protection.png';

const OtpForm = () => {
    const length = 6;
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length).split('');
        const updatedOtp = otp.map((_, i) => pastedData[i] || '');
        setOtp(updatedOtp);
        pastedData.forEach((char, i) => {
        if (inputsRef.current[i]) {
            inputsRef.current[i]!.value = char;
        }
        });
        inputsRef.current[Math.min(pastedData.length, length - 1)]?.focus();
    };


    return (
        <div className="w-[100dvw] h-[100dvh] fixed top-0 left-0 z-50 bg-black/30 flex justify-center items-center">
            <div className="bg-white md:w-[35dvw] w-[90dvw] p-10 flex flex-col gap-6 justify-center items-center rounded-xl">
                <img src={emailSecurityIcon} alt="security icon" width={70} />
                <h1 className="text-xl font-extrabold">E-Mail Verification</h1>
                <p className="text-center text-sm text-gray-600">
                    An OTP has been sent to your email address. Please check your inbox and enter the OTP below to continue.
                    For your security, the OTP is valid for 5 minutes only. Do not share this OTP with anyone.
                </p>
                <h3 className="font-bold">Enter Code:</h3>

                <div className="flex gap-2" onPaste={handlePaste}>
                {
                    otp.map((digit, index) => (
                        <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        ref={(el) => {inputsRef.current[index] = el}}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    ))
                }
                </div>

                <button className="bg-orange-300 hover:bg-orange-500 text-white py-2 w-full font-bold rounded-md">
                    Verify OTP
                </button>

                <p className="text-slate-700 font-medium text-sm">
                    Didn't receive the OTP?{' '}
                    <span className="underline underline-offset-2 cursor-pointer text-blue-600">Resend</span>
                </p>
            </div>
        </div>
    );
};

export default OtpForm;