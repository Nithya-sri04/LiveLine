// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // ⏱️ OTP expires after 5 minutes (300 seconds)
  }
});

export default mongoose.model("Otp", otpSchema);
