import { validateEmail, validatePassword, validateOtp, validateRefreshToken } from './src/utils/validation.js';

const runTests = () => {
    console.log("--- Email Tests ---");
    console.log("test@example.com:", validateEmail("test@example.com")); // true
    console.log("invalid-email:", validateEmail("invalid-email")); // false
    console.log("test@sub.domain.com:", validateEmail("test@sub.domain.com")); // true
    console.log("empty:", validateEmail("")); // false

    console.log("\n--- Password Tests ---");
    console.log("Pass1!:", validatePassword("Pass1!")); // true (6 chars)
    console.log("weak:", validatePassword("weak")); // false
    console.log("NoSpecial1:", validatePassword("NoSpecial1")); // false
    console.log("NoNumber!:", validatePassword("NoNumber!")); // false
    console.log("noupper1!:", validatePassword("noupper1!")); // false
    console.log("Valid1@Password:", validatePassword("Valid1@Password")); // true
    console.log("With_Underscore1!:", validatePassword("With_Underscore1!")); // false (current regex might fail)
    console.log("With-Dash1!:", validatePassword("With-Dash1!")); // false (current regex might fail)

    console.log("\n--- OTP Tests ---");
    console.log("123456:", validateOtp("123456")); // true
    console.log("12345:", validateOtp("12345")); // false
    console.log("1234567:", validateOtp("1234567")); // false
    console.log("abcdef:", validateOtp("abcdef")); // false

    console.log("\n--- Refresh Token Tests ---");
    console.log("a.b.c:", validateRefreshToken("a.b.c")); // true
    console.log("a.b:", validateRefreshToken("a.b")); // false
    console.log("empty:", validateRefreshToken("")); // false
};

runTests();
