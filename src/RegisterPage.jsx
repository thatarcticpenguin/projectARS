import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  .signup-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  .signup-root::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,113,254,0.18) 0%, transparent 70%);
    top: -100px;
    left: -100px;
    pointer-events: none;
  }

  .signup-root::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(130,80,255,0.12) 0%, transparent 70%);
    bottom: -80px;
    right: -80px;
    pointer-events: none;
  }

  .su-grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .su-card {
    position: relative;
    z-index: 10;
    width: 420px;
    background: rgba(14, 21, 42, 0.85);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 48px 44px;
    backdrop-filter: blur(24px);
    box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
    animation: suCardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .su-card::-webkit-scrollbar { display: none; }

  @keyframes suCardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .su-header { margin-bottom: 32px; }

  .su-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #3871fe;
    font-weight: 500;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .su-eyebrow::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1px;
    background: #3871fe;
  }

  .su-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 600;
    color: #f0f4ff;
    line-height: 1.15;
    margin: 0;
  }

  .su-subtitle {
    margin-top: 8px;
    font-size: 13.5px;
    color: rgba(180,190,220,0.55);
    font-weight: 300;
  }

  .su-field {
    margin-bottom: 16px;
    animation: suFieldIn 0.4s ease both;
  }

  @keyframes suFieldIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .su-label {
    display: block;
    font-size: 11.5px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(180,190,220,0.5);
    font-weight: 500;
    margin-bottom: 8px;
  }

  .su-input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #e8eeff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
  }

  .su-input::placeholder { color: rgba(180,190,220,0.25); }

  .su-input:focus {
    border-color: rgba(56,113,254,0.6);
    background: rgba(56,113,254,0.06);
    box-shadow: 0 0 0 3px rgba(56,113,254,0.1);
  }

  .su-role-pills { display: flex; gap: 10px; }

  .su-pill {
    flex: 1;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: rgba(180,190,220,0.5);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .su-pill:hover {
    border-color: rgba(56,113,254,0.3);
    color: rgba(220,228,255,0.8);
  }

  .su-pill.active {
    border-color: #3871fe;
    background: rgba(56,113,254,0.15);
    color: #7aa3ff;
  }

  .su-section-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0 16px;
  }

  .su-section-divider::before, .su-section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .su-section-divider span {
    font-size: 10px;
    color: rgba(180,190,220,0.3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .su-btn {
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #3871fe 0%, #5a4fff 100%);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(56,113,254,0.35);
    letter-spacing: 0.3px;
  }

  .su-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(56,113,254,0.45);
  }

  .su-btn:active { transform: translateY(0); }

  .su-bottom-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 18px;
  }

  .su-bottom-divider::before, .su-bottom-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .su-bottom-divider span {
    font-size: 11px;
    color: rgba(180,190,220,0.3);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .su-login-link {
    text-align: center;
    font-size: 13.5px;
    color: rgba(180,190,220,0.45);
  }

  .su-login-link span {
    color: #7aa3ff;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s;
  }

  .su-login-link span:hover { color: #a8c4ff; }

  .su-message {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13.5px;
    line-height: 1.4;
    animation: suFadeIn 0.3s ease;
  }

  @keyframes suFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .su-message.success {
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    color: #6ee7a0;
  }

  .su-message.error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
  }

  .su-message.info {
    background: rgba(56,113,254,0.1);
    border: 1px solid rgba(56,113,254,0.2);
    color: #93b4ff;
  }

  .su-otp-hint {
    font-size: 11px;
    color: rgba(180,190,220,0.3);
    margin-top: 6px;
    text-align: right;
    letter-spacing: 0.5px;
  }
`;

function Signup({ switchToLogin }) {
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const setMsg = (text, type = "info") => setMessage({ text, type });

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      setMsg("Phone number must contain exactly 10 digits.", "error");
      return;
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      setMsg("Aadhaar number must contain exactly 12 digits.", "error");
      return;
    }
    setOtpSent(true);
    setMsg("OTP sent successfully! Demo OTP: 1234", "info");
  };

  const handleSignup = () => {
    if (otp !== "1234") {
      setMsg("Wrong OTP entered. Please try again.", "error");
      return;
    }
    if (password.length < 7) {
      setMsg("Password must be at least 7 characters.", "error");
      return;
    }
    if (password !== confirmPassword) {
      setMsg("Passwords do not match.", "error");
      return;
    }
    if (role === "admin") {
      if (hospitalName.trim() === "") {
        setMsg("Hospital Name is required for Admin.", "error");
        return;
      }
      if (employeeId.trim() === "") {
        setMsg("Employee ID is required for Admin.", "error");
        return;
      }
    }
    setMsg("✓ Registration successful! Welcome aboard.", "success");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">
        <div className="su-grid-overlay" />
        <div className="su-card">
          <div className="su-header">
            <div className="su-eyebrow">MediPortal</div>
            <h1 className="su-title">Create your{"\n"}account</h1>
            <p className="su-subtitle">Join MediPortal to get started</p>
          </div>

          {/* Role Selection */}
          <div className="su-field">
            <label className="su-label">Register as</label>
            <div className="su-role-pills">
              <button
                className={`su-pill ${role === "user" ? "active" : ""}`}
                onClick={() => setRole("user")}
              >
                Paramedic
              </button>
              <button
                className={`su-pill ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                Hospital Admin
              </button>
            </div>
          </div>

          {/* Admin-only fields */}
          {role === "admin" && (
            <>
              <div className="su-section-divider"><span>Admin Details</span></div>
              <div className="su-field">
                <label className="su-label">Hospital Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospitals"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="su-input"
                />
              </div>
              <div className="su-field">
                <label className="su-label">Employee ID</label>
                <input
                  type="text"
                  placeholder="e.g. EMP-00142"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="su-input"
                />
              </div>
            </>
          )}

          {/* Common fields */}
          <div className="su-section-divider"><span>Personal Info</span></div>

          <div className="su-field">
            <label className="su-label">Phone Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="su-input"
            />
          </div>

          <div className="su-field">
            <label className="su-label">Aadhaar Number</label>
            <input
              type="text"
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
              className="su-input"
            />
          </div>

          {!otpSent ? (
            <button className="su-btn" onClick={handleSendOtp}>
              Send OTP →
            </button>
          ) : (
            <>
              <div className="su-section-divider"><span>Verification & Password</span></div>

              <div className="su-field">
                <label className="su-label">One-Time Password</label>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="su-input"
                />
                <p className="su-otp-hint">Demo OTP: 1234</p>
              </div>

              <div className="su-field">
                <label className="su-label">Password</label>
                <input
                  type="password"
                  placeholder="Minimum 7 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="su-input"
                />
              </div>

              <div className="su-field">
                <label className="su-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="su-input"
                />
              </div>

              <button className="su-btn" onClick={handleSignup}>
                Create Account →
              </button>
            </>
          )}

          {message.text && (
            <div className={`su-message ${message.type}`}>{message.text}</div>
          )}

          <div className="su-bottom-divider"><span>or</span></div>
          <p className="su-login-link">
            Already registered?{" "}
            <span onClick={switchToLogin}>Sign in</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;