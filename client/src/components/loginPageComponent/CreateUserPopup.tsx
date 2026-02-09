import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { isValidRegisterNo } from "../../utils/validation";
import OtpLoading from "../loadingComponent/loginPageLoading/OtpLoading";

type Props = {
    onClose: () => void;
    onFail: (title: string, message: string) => void;
};

// const CreateUserPopup = ({ onClose }: { onClose: () => void }) => {
const CreateUserPopup: React.FC<Props> = ({
    onClose,
    onFail
}) => {

    const [registerNo, setRegisterNo] = useState<string>('');

    const [otpLoading, setOtpLoading] = useState<boolean>(true);

    const handleClick = async () => {
        if(!isValidRegisterNo(registerNo.trim())) {
            onFail("Failed", "Enter a valid register number.");
            return;
        }
    }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl px-8 py-7 animate-popupScale"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <FaUserPlus className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">
          Create Student Account
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your university register number
        </p>

        <input
          type="text"
          value={registerNo}
          onChange={(e) => setRegisterNo(e.target.value)}
          placeholder="Register Number"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-200 mb-6"
        />

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button onClick={handleClick} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
            Create Account
          </button>
        </div>
      </div>
      { otpLoading && <OtpLoading /> }
    </div>
  );
};

export default CreateUserPopup;
