
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const result = await handleLogin({ email, password })

    if (result.ok) {
      navigate('/')
    } else {
      setFormError(
        result.error || 'Unable to sign in. Please check your details.'
      )
    }
  }

  return (
    <main className="auth-page auth-page-v2">

      {/* LEFT BRAND PANEL */}
      <section className="auth-story auth-story-v2">

        <Link to="/login" className="brand brand-v2">
          <span className="brand-mark">✳</span>
          <span>orbit<em>prep</em></span>
        </Link>

        <div className="story-copy story-copy-v2">

          <span className="eyebrow">
            AI POWERED INTERVIEW PREPARATION
          </span>

          <h1>
            Prepare smarter.
            <br />
            Interview better.
            <br />
            <span className="gradient-text">
              Get hired.
            </span>
          </h1>

          <p>
            Your personal AI career companion. Analyze your resume,
            discover skill gaps, and prepare for your next opportunity
            with confidence.
          </p>

          {/* Decorative AI card */}
          <div className="login-visual-card">

            <div className="visual-card-top">
              <span className="visual-status">
                <span className="status-dot"></span>
                AI WORKSPACE
              </span>
              <span className="visual-icon">✦</span>
            </div>

            <div className="visual-orbit">
              <div className="orbit-ring orbit-ring-one"></div>
              <div className="orbit-ring orbit-ring-two"></div>
              <div className="orbit-core">AI</div>
              <span className="orbit-node node-one">✦</span>
              <span className="orbit-node node-two">⌘</span>
              <span className="orbit-node node-three">↗</span>
            </div>

            <div className="visual-card-bottom">
              <div>
                <strong>Your career journey</strong>
                <span>One step closer to your dream role</span>
              </div>
              <span className="visual-arrow">↗</span>
            </div>

          </div>
        </div>

        <div className="story-footer-v2">
          <span>✳</span>
          Built for your next big opportunity.
        </div>

      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="auth-side auth-side-v2">

        <div className="auth-card auth-card-v2">

          <div className="login-mobile-brand">
            <span className="brand-mark">✳</span>
            orbit<em>prep</em>
          </div>

          <div className="login-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Good to see you <span>again.</span></h2>
            <p>
              Sign in to continue your interview preparation journey.
            </p>
          </div>

          <form className="auth-form auth-form-v2" onSubmit={handleSubmit}>

            {formError && (
              <div className="notice-error" role="alert">
                {formError}
              </div>
            )}

            <div className="login-field-group">
              <label className="field-label" htmlFor="email">
                Email address
              </label>

              <div className="login-input-wrap">
                <span className="input-icon">@</span>
                <input
                  className="field login-field"
                  autoComplete="email"
                  required
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="login-field-group">
              <label className="field-label" htmlFor="password">
                Password
              </label>

              <div className="login-input-wrap">
                <span className="input-icon">⌑</span>

                <input
                  className="field login-field"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                'Signing you in...'
              ) : (
                <>
                  Sign in to your workspace <span>↗</span>
                </>
              )}
            </button>

          </form>

          <div className="auth-bottom auth-bottom-v2">
            Don't have an account?
            <Link className="text-link" to="/register">
              Create account ↗
            </Link>
          </div>

          <div className="login-security-note">
            <span>⌑</span>
            Your workspace is private and secure.
          </div>

        </div>
      </section>

    </main>
  )
}
