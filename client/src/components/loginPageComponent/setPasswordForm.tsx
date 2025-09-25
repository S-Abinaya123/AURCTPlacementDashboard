import { useState } from 'react';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetPasswordModal = ({ isOpen, onClose }: SetPasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pw: string) => {
    if (pw.length < 8) {
      return "Minimum length is 8 characters.";
    }
    if (!/[A-Z]/.test(pw)) {
      return "Password must have at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pw)) {
      return "Password must have at least one lowercase letter.";
    }
    if (!/[0-9]/.test(pw)) {
      return "Password must have at least one number.";
    }
    return '';
  };

  const handleSetPassword = () => {
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    alert("Password set successfully!");
    setError('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Set password</h2>
        
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 text-sm">
          <li>Minimum length is 8 characters.</li>
          <li>Password must have upper case, lower case, and numbers.</li>
        </ul>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              password:
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c4.41 0 8.04-2.85 9.54-7-1.5-4.15-5.13-7-9.54-7zM12 15a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c1.67 0 3.25-.37 4.67-1.03l-1.46-1.46A3.502 3.502 0 0012 15a3.502 3.502 0 00-3.5 3.5c0 .35.05.69.13 1.01l-1.63 1.63C4.54 18.25 3.5 16.29 2.46 14.28L.5 16.24c.75 1.55 1.77 2.92 2.99 4.14l1.41-1.41c1.22 1.22 2.6 2.24 4.14 2.99l1.63-1.63c.32.08.66.13 1.01.13A3.502 3.502 0 0015 15c0-1.67-.37-3.25-1.03-4.67L15 8.87c1.42 1.42 2.65 3.01 3.65 4.72l-1.47 1.47c-.8-1.55-1.74-2.8-2.8-3.79l1.41-1.41c1.06.99 2 2.15 2.8 3.54l-1.47 1.47c-1.39 1.39-2.92 2.41-4.64 3.06L20.8 22.45c-1.12.56-2.31.91-3.56.91-4.41 0-8.04-2.85-9.54-7L12 13.97z"></path>
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirm-password">
              Confirm password:
            </label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (password && e.target.value !== password) {
                  setError("Passwords do not match.");
                } else {
                  setError("");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c4.41 0 8.04-2.85 9.54-7-1.5-4.15-5.13-7-9.54-7zM12 15a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c1.67 0 3.25-.37 4.67-1.03l-1.46-1.46A3.502 3.502 0 0012 15a3.502 3.502 0 00-3.5 3.5c0 .35.05.69.13 1.01l-1.63 1.63C4.54 18.25 3.5 16.29 2.46 14.28L.5 16.24c.75 1.55 1.77 2.92 2.99 4.14l1.41-1.41c1.22 1.22 2.6 2.24 4.14 2.99l1.63-1.63c.32.08.66.13 1.01.13A3.502 3.502 0 0015 15c0-1.67-.37-3.25-1.03-4.67L15 8.87c1.42 1.42 2.65 3.01 3.65 4.72l-1.47 1.47c-.8-1.55-1.74-2.8-2.8-3.79l1.41-1.41c1.06.99 2 2.15 2.8 3.54l-1.47 1.47c-1.39 1.39-2.92 2.41-4.64 3.06L20.8 22.45c-1.12.56-2.31.91-3.56.91-4.41 0-8.04-2.85-9.54-7L12 13.97z"></path>
                </svg>
              )}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-gray-600  border-2 border-gray-300 hover:bg-red-500 hover:border-red-500   hover:text-white transition-colors duration-200"
            >
              cancel
            </button>
            <button
              onClick={handleSetPassword}
              className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              set password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SetPasswordForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center justify-center">
      <SetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SetPasswordForm;