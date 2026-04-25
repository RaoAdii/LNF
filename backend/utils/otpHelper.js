const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/** Generate a cryptographically random 6-digit OTP string */
function generateOTP() {
  return String(crypto.randomInt(100000, 999999));
}

/** Hash OTP with bcrypt (rounds=10) before storing in DB */
async function hashOTP(otp) {
  return bcrypt.hash(otp, 10);
}

/** Compare plain OTP against stored hash */
async function verifyOTPHash(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTPHash,
};
