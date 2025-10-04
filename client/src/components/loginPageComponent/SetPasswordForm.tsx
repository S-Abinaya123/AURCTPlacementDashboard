import React, { useState, useCallback } from 'react';

// The main component which includes all state and logic for the modal.
const SetPasswordForm= () => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to close the modal and reset state
  // This function is now only called internally after successful password set.
  const onClose = useCallback(() => {
    setIsOpen(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  }, []);

  // Password validation logic
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

  // Handler for setting the password
  const handleSetPassword = () => {
    setSuccess(''); // Clear any previous success message

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Success state - simulate password being set
    setSuccess("Password successfully set! Modal will close shortly.");
    setError('');

    // Simulate closing after success (only way to close the modal now)
    setTimeout(onClose, 1500);
  };

  // Removed handleBackdropClick and its use, preventing backdrop close.
  const isButtonDisabled = !password || !confirmPassword || !!error || !!success;

  if (!isOpen) {
    // When closed, render nothing so the underlying application content is fully visible.
    return null;
  }

  return (
    // Backdrop with required opacity (30% transparency using RGBA)
    <div 
        className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4"
        // Removed onClick handler here to prevent closing on backdrop click
        style={{ 
            fontFamily: 'Inter, sans-serif',
            // RGBA for Black (0, 0, 0) with 30% (0.3) opacity
            backgroundColor: 'rgba(0, 0, 0, 0.3)' 
        }}
    >
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto transition-all duration-300 transform scale-100"
      >
        {/* Close Button ('X') - REMOVED onClick={onClose} */}
        <button
          // Removed onClick={onClose} to disable the X button functionality
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer" 
          aria-label="Close modal"
          disabled 
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Title: Matches screenshot "Set password" */}
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Set password</h2>
        
        {/* Rules List: Matches screenshot styling */}
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 text-sm ml-2">
          <li>Minimum length is 8 characters.</li>
          <li>Password must have upper case, lower case, and numbers.</li>
        </ul>

        {/* Success Message Area - Visible only on success */}
        {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-semibold animate-pulse">
                {success}
            </div>
        )}

        <div className="space-y-4">
          
          {/* Password Input */}
          <div className="relative">
            {/* Label: Matches screenshot "password:" */}
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              Password:
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSuccess('');
                if (confirmPassword && e.target.value !== confirmPassword) {
                    setError("Passwords do not match.");
                } else {
                    setError(validatePassword(e.target.value));
                }
              }}
              // Input style matched to screenshot
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {/* Show/Hide Password Toggle: Positioned to be centered on the input field */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-[26px] pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d={showPassword ? "M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c4.41 0 8.04-2.85 9.54-7-1.5-4.15-5.13-7-9.54-7zM12 15a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" : "M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c1.67 0 3.25-.37 4.67-1.03l-1.46-1.46A3.502 3.502 0 0012 15a3.502 3.502 0 00-3.5 3.5c0 .35.05.69.13 1.01l-1.63 1.63C4.54 18.25 3.5 16.29 2.46 14.28L.5 16.24c.75 1.55 1.77 2.92 2.99 4.14l1.41-1.41c1.22 1.22 2.6 2.24 4.14 2.99l1.63-1.63c.32.08.66.13 1.01.13A3.502 3.502 0 0015 15c0-1.67-.37-3.25-1.03-4.67L15 8.87c1.42 1.42 2.65 3.01 3.65 4.72l-1.47 1.47c-.8-1.55-1.74-2.8-2.8-3.79l1.41-1.41c1.06.99 2 2.15 2.8 3.54l-1.47 1.47c-1.39 1.39-2.92 2.41-4.64 3.06L20.8 22.45c-1.12.56-2.31.91-3.56.91-4.41 0-8.04-2.85-9.54-7L12 13.97z"}></path>
              </svg>
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            {/* Label: Matches screenshot "Confirm password:" */}
            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirm-password">
              Confirm password:
            </label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setSuccess('');
                if (password && e.target.value !== password) {
                  setError("Passwords do not match.");
                } else {
                  setError(validatePassword(password)); // Re-validate the original password
                }
              }}
              // Input style matched to screenshot
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {/* Show/Hide Password Toggle: Positioned to be centered on the input field */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-[26px] pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d={showPassword ? "M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c4.41 0 8.04-2.85 9.54-7-1.5-4.15-5.13-7-9.54-7zM12 15a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" : "M12 4.5c-4.41 0-8.04 2.85-9.54 7C3.96 14.65 7.59 17.5 12 17.5c1.67 0 3.25-.37 4.67-1.03l-1.46-1.46A3.502 3.502 0 0012 15a3.502 3.502 0 00-3.5 3.5c0 .35.05.69.13 1.01l-1.63 1.63C4.54 18.25 3.5 16.29 2.46 14.28L.5 16.24c.75 1.55 1.77 2.92 2.99 4.14l1.41-1.41c1.22 1.22 2.6 2.24 4.14 2.99l1.63-1.63c.32.08.66.13 1.01.13A3.502 3.502 0 0015 15c0-1.67-.37-3.25-1.03-4.67L15 8.87c1.42 1.42 2.65 3.01 3.65 4.72l-1.47 1.47c-.8-1.55-1.74-2.8-2.8-3.79l1.41-1.41c1.06.99 2 2.15 2.8 3.54l-1.47 1.47c-1.39 1.39-2.92 2.41-4.64 3.06L20.8 22.45c-1.12.56-2.31.91-3.56.91-4.41 0-8.04-2.85-9.54-7L12 13.97z"}></path>
              </svg>
            </button>
          </div>
          
          {/* Error Message Area - Visible only on error */}
          {error && (
            <p className="text-red-500 text-sm font-medium p-2 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold mr-1">Error:</span> {error}
            </p>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            {/* Cancel Button: REMOVED onClick={onClose} and set cursor to default */}
            <button
              // Removed onClick={onClose} to disable the Cancel button functionality
              className="px-6 py-2 rounded-lg text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              disabled
            >
              cancel
            </button>
            
            {/* Set Password Button: Still the only way to close the modal (after success) */}
            <button
              onClick={handleSetPassword}
              disabled={isButtonDisabled}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 shadow-md ${
                isButtonDisabled
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
              }`}
            >
              Set Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordForm;