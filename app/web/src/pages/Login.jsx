import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, BarChart3, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // On success, AuthContext updates isAuthenticated → App.jsx redirects,
      // but we also push explicitly for immediate navigation.
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      {/* Floating grid pattern */}
      <div className="login-grid-overlay" />

      <div className="login-container">
        {/* Left — Branding panel */}
        <div className="login-branding">
          <div className="login-brand-content">
            <div className="login-logo-wrapper">
              <div className="login-logo-icon">
                <BarChart3 size={32} color="#fff" />
              </div>
              <h1 className="login-brand-name">DecisionPilot</h1>
            </div>

            <p className="login-brand-tagline">
              Business Intelligence Dashboard
            </p>

            <div className="login-brand-features">
              <div className="login-feature">
                <div className="login-feature-dot" />
                <span>Real-time KPI Analytics</span>
              </div>
              <div className="login-feature">
                <div className="login-feature-dot" />
                <span>Regional Sales Insights</span>
              </div>
              <div className="login-feature">
                <div className="login-feature-dot" />
                <span>AI-Powered Recommendations</span>
              </div>
              <div className="login-feature">
                <div className="login-feature-dot" />
                <span>Interactive India Map View</span>
              </div>
            </div>

            <div className="login-brand-stats">
              <div className="login-stat">
                <span className="login-stat-value">13+</span>
                <span className="login-stat-label">States Covered</span>
              </div>
              <div className="login-stat-divider" />
              <div className="login-stat">
                <span className="login-stat-value">6</span>
                <span className="login-stat-label">KPI Metrics</span>
              </div>
              <div className="login-stat-divider" />
              <div className="login-stat">
                <span className="login-stat-value">24/7</span>
                <span className="login-stat-label">Live Tracking</span>
              </div>
            </div>
          </div>

          <p className="login-brand-footer">
            © 2026 DecisionPilot · Built for Business Analysts
          </p>
        </div>

        {/* Right — Login form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            {/* Mobile logo */}
            <div className="login-mobile-logo">
              <BarChart3 size={28} color="#2563eb" />
              <span>DecisionPilot</span>
            </div>

            <div className="login-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to your analytics dashboard</p>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form" id="login-form">
              {/* Email field */}
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">
                  Email Address
                </label>
                <div className="login-input-wrapper">
                  <Mail size={18} className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="analyst@decisionpilot.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="login-field">
                <label htmlFor="login-password" className="login-label">
                  Password
                </label>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="login-options">
                <label className="login-remember" htmlFor="login-remember">
                  <input
                    type="checkbox"
                    id="login-remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="login-checkmark" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="login-forgot">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`login-submit ${isLoading ? "login-submit--loading" : ""}`}
                disabled={isLoading}
                id="login-submit-btn"
              >
                {isLoading ? (
                  <div className="login-spinner" />
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>or continue with</span>
            </div>

            {/* Social login placeholders */}
            <div className="login-social">
              <button
                type="button"
                className="login-social-btn"
                id="login-google-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="login-social-btn"
                id="login-microsoft-btn"
              >
                <svg width="18" height="18" viewBox="0 0 23 23">
                  <rect fill="#F25022" x="1" y="1" width="10" height="10" />
                  <rect fill="#7FBA00" x="12" y="1" width="10" height="10" />
                  <rect fill="#00A4EF" x="1" y="12" width="10" height="10" />
                  <rect fill="#FFB900" x="12" y="12" width="10" height="10" />
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            <p className="login-signup-text">
              Don't have an account?{" "}
              <Link to="/signup" className="login-signup-link">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
