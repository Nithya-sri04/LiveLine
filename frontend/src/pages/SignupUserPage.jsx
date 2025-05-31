import { useEffect, useState } from "react";
import { signupUser } from "../services/authUserService";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import { toast } from "react-toastify";
import axios from "axios";

const SignupUserPage = () => {
  const [showIntro, setShowIntro] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldError, setFieldError] = useState({});
  const [signupError, setSignupError] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [otpTimeout, setOtpTimeout] = useState(300); // 5 minutes
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [otpExpired, setOtpExpired] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let otpInterval;
    if (showOtpModal && otpTimeout > 0) {
      otpInterval = setInterval(() => {
        setOtpTimeout((prev) => prev - 1);
      }, 1000);
    }

    if (otpTimeout === 0) {
      setOtpExpired(true);
      toast.error("OTP has expired. Please request a new one.");
    }

    return () => clearInterval(otpInterval);
  }, [otpTimeout, showOtpModal]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    setFieldError({});
    setSignupError("");
    const errors = {};

    if (!email || !email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!username.trim()) {
      errors.username = "Username is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }

    try {
      const otpRes = await axios.post("http://localhost:5000/api/userAuth/send-otp", { email });
      const otpCode = otpRes.data.otp;
      console.log("OTP:", otpCode); // Dev only
      setGeneratedOtp(otpCode);
      setOtpSentTime(Date.now());
      setOtp("");
      setOtpExpired(false);
      setOtpTimeout(300); // Reset 5-min timer
      setShowOtpModal(true);
      toast.success("OTP sent to your email. Please verify.");
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Failed to send OTP.";
      setSignupError(msg);
    }
  };

  const handleOtpVerify = async () => {
    if (otpExpired) {
      setOtpError("OTP has expired. Request a new one.");
      toast.error("OTP expired.");
      return;
    }
    if (otp !== generatedOtp) {
      setOtpError("Incorrect OTP. Please try again.");
      toast.error("Incorrect OTP.");
      return;
    }
    try {
      await signupUser({ email, password, username, role: "user" });
      toast.success("OTP Verified! User account created.");
      setShowOtpModal(false);
      navigate("/login/user");
    } catch (error) {
      toast.error(error.message || "Signup failed.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const otpRes = await axios.post("http://localhost:5000/api/userAuth/send-otp", { email });
      setGeneratedOtp(otpRes.data.otp);
      setOtp("");
      setOtpExpired(false);
      setOtpTimeout(300); // Reset 5-min timer
      toast.info("A new OTP has been sent.");
    } catch (err) {
      toast.error("Failed to resend OTP.");
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Signup Box */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">User Sign Up</h2>

            {signupError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-2 text-sm text-center">
                {signupError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.email ? "border-2 border-red-500" : ""}`}
              />
              {fieldError.email && <p className="text-red-500 text-sm">{fieldError.email}</p>}

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.username ? "border-2 border-red-500" : ""}`}
              />
              {fieldError.username && <p className="text-red-500 text-sm">{fieldError.username}</p>}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.password ? "border-2 border-red-500" : ""}`}
              />
              {fieldError.password && <p className="text-red-500 text-sm">{fieldError.password}</p>}

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.confirmPassword ? "border-2 border-red-500" : ""}`}
              />
              {fieldError.confirmPassword && <p className="text-red-500 text-sm">{fieldError.confirmPassword}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition duration-300"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={() => navigate("/")} className="text-sm text-white/70 hover:text-white transition underline">
                ← Back to Role Selection
              </button>
            </div>
          </div>

          {/* OTP Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-[90%] sm:w-[350px] text-white relative">
                <h3 className="text-xl font-semibold mb-2 text-center">Verify OTP</h3>
                <p className="text-sm text-center mb-2">
                  Enter the OTP sent to <span className="font-bold">{email}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 mt-2 mb-2 rounded bg-white/20 outline-none focus:ring-2 focus:ring-blue-400 text-white"
                  placeholder="Enter OTP"
                />
                {otpError && <p className="text-red-400 text-sm">{otpError}</p>}
                <p className="text-center text-sm mb-2">Time remaining: <span className="font-bold">{formatTime(otpTimeout)}</span></p>

                <button
                  onClick={handleOtpVerify}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  Verify OTP
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={otpTimeout > 0 && !otpExpired}
                  className={`w-full py-2 mt-2 rounded-lg font-semibold transition ${otpTimeout > 0 && !otpExpired ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignupUserPage;

