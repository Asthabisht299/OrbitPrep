
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const result = await handleRegister({
      username,
      email,
      password
    })

    if (result.ok) {
      navigate('/')
    } else {
      setFormError(
        result.error || 'Unable to create your account. Please check your details.'
      )
    }
  }

  return (
    <main className="auth-page auth-page-v2">

      {/* LEFT BRAND PANEL */}
      <section className="auth-story auth-story-v2">

        <Link to="/register" className="brand brand-v2">
          <span className="brand-mark">✳</span>
          <span>orbit<em>prep</em></span>
        </Link>

        <div className="story-copy story-copy-v2">

          <span className="eyebrow">
            YOUR AI CAREER COMPANION
          </span>

          <h1>
            Your future
            <br />
            starts with
            <br />
            <span className="gradient-text">one decision.</span>
          </h1>

          <p>
            Build confidence before your next interview.
            Turn your resume into insights, identify skill gaps,
            and follow a personalized preparation roadmap.
          </p>

          <div className="login-visual-card">

            <div className="visual-card-top">
              <span className="visual-status">
                <span className="status-dot"></span>
                YOUR CAREER JOURNEY
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
                <strong>Your next opportunity awaits</strong>
                <span>Start preparing for the role you want</span>
              </div>
              <span className="visual-arrow">↗</span>
            </div>

          </div>
        </div>

        <div className="story-footer-v2">
          <span>✳</span>
          Small steps. Stronger preparation. Bigger possibilities.
        </div>

      </section>

      {/* RIGHT REGISTER PANEL */}
      <section className="auth-side auth-side-v2">

        <div className="auth-card auth-card-v2">

          <div className="login-mobile-brand">
            <span className="brand-mark">✳</span>
            orbit<em>prep</em>
          </div>

          <div className="login-heading">

            <span className="eyebrow">GET STARTED</span>

            <h2>
              Create your
              <br />
              <span>workspace.</span>
            </h2>

            <p>
              Join orbitprep and start building your personalized
              interview preparation strategy.
            </p>

          </div>

          <form className="auth-form auth-form-v2" onSubmit={handleSubmit}>

            {formError && (
              <div className="notice-error" role="alert">
                {formError}
              </div>
            )}

            {/* USERNAME */}
            <div className="login-field-group">

              <label className="field-label" htmlFor="username">
                Full name
              </label>

              <div className="login-input-wrap">

                <span className="input-icon">◎</span>

                <input
                  className="field login-field"
                  autoComplete="name"
                  required
                  minLength={2}
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                />

              </div>
            </div>

            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div className="login-field-group">

              <label className="field-label" htmlFor="password">
                Create password
              </label>

              <div className="login-input-wrap">

                <span className="input-icon">⌑</span>

                <input
                  className="field login-field"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                'Creating your account...'
              ) : (
                <>
                  Create my account <span>↗</span>
                </>
              )}
            </button>

          </form>

          <div className="auth-bottom auth-bottom-v2">
            Already have an account?
            <Link className="text-link" to="/login">
              Sign in ↗
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
