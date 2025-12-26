/**
 * Validates email format using regex
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Min 6 chars, 1 uppercase, 1 number, 1 special char
 * @param {string} password 
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  // Min 6 chars, at least 1 uppercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates OTP format
 * Must be numeric and exactly 6 digits
 * @param {string} otp 
 * @returns {boolean}
 */
export const validateOtp = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Validates Refresh Token format
 * Must be a valid JWT string (3 parts separated by dots)
 * @param {string} token 
 * @returns {boolean}
 */
export const validateRefreshToken = (token) => {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
};
