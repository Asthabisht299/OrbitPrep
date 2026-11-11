
import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import OrbitPrepLogo, { OrbitMark } from '../components/OrbitPrepLogo.jsx'

export default function Home() {
  const {
    loading,
    generateReport,
    reports,
    error: interviewError
  } = useInterview()

  const { user, handleLogout } = useAuth()

  const [targetRole, setTargetRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [formError, setFormError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const resumeInputRef = useRef(null)
  const navigate = useNavigate()

  const name =
    user?.username ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'there'

  const canGenerate =
    jobDescription.trim().length > 0 &&
    (selectedFile || selfDescription.trim().length > 0) &&
    !loading

  const recentReports = useMemo(
    () => [...(reports || [])].slice(0, 6),
    [reports]
  )

  const handleFile = (file) => {
    setFormError('')

    if (!file) {
      setSelectedFile(null)
      return
    }

    const validType =
      file.type === 'application/pdf' || /\.pdf$/i.test(file.name)

    if (!validType) {
      setSelectedFile(null)
      setFormError('Please choose a PDF file. DOCX uploads are not supported yet.')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setSelectedFile(null)
      setFormError('Your PDF must be smaller than 3 MB.')
      return
    }

    setSelectedFile(file)
  }

  const handleGenerateReport = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!jobDescription.trim()) {
      setFormError('Add the job description first.')
      return
    }

    if (!selectedFile && !selfDescription.trim()) {
      setFormError('Upload your resume or add a self-description.')
      return
    }

    const result = await generateReport({
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim(),
      selfDescription: selfDescription.trim(),
      resumeFile: selectedFile
    })

    if (result?._id) {
      navigate(`/interview/${result._id}`)
    } else {
      setFormError(
        interviewError ||
        'We could not generate your report. Please try again.'
      )
    }
  }

  const logout = async () => {
    await handleLogout()
    navigate('/login')
  }

  return (
    <div className="app-shell dashboard-v2">

      {/* NAVIGATION */}
      <header className="topbar dashboard-topbar">

        <Link className="brand brand-v2" to="/">
          <OrbitPrepLogo />
        </Link>

        <div className="topbar-right">
          <span className="pill">AI CAREER WORKSPACE</span>

          <span className="user-greeting">
            Welcome, {name}
          </span>

          <button
            className="btn btn-ghost"
            onClick={logout}
          >
            Log out ↗
          </button>
        </div>

      </header>

      <main className="page-wrap dashboard-wrap">

        {/* WELCOME SECTION */}
        <section className="dashboard-hero">

          <div>
            <span className="eyebrow">
              YOUR PERSONAL AI INTERVIEW LAB
            </span>

            <h1 className="page-title">
              Turn preparation
              <br />
              into <span className="gradient-text">confidence.</span>
            </h1>

            <p className="subhead">
              Upload your resume, choose your target role, and let AI
              create a personalized interview preparation strategy.
            </p>
          </div>

          <div className="dashboard-hero-badge">
            <span className="hero-status-dot" aria-hidden="true" />
            <div>
              <strong>Ready for your next role?</strong>
              <small>Your AI workspace is waiting.</small>
            </div>
          </div>

        </section>

        {/* MAIN WORKSPACE */}
        <form onSubmit={handleGenerateReport}>

          <div className="workspace-grid">

            <section className="card form-card dashboard-form-card">

              <div className="card-heading">
                <div className="icon-tile"><OrbitMark className="ui-mark" /></div>

                <div>
                  <span className="section-kicker">
                    CREATE NEW ANALYSIS
                  </span>

                  <h2>Build your interview strategy</h2>

                  <p>
                    Give us a little information about your target role.
                  </p>
                </div>
              </div>

              <div className="form-stack">

                {/* TARGET ROLE */}
                <div>
                  <label className="field-label" htmlFor="targetRole">
                    <span><span className="dashboard-step">01</span> Target role</span>
                    <small>OPTIONAL</small>
                  </label>
                  <input
                    className="field"
                    id="targetRole"
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value.slice(0, 100))}
                    maxLength={100}
                    placeholder="e.g. Graduate Software Engineer"
                  />
                  <div className="form-meta"><span>Helps AI tailor your questions and report title.</span><span>{targetRole.length}/100</span></div>
                </div>

                {/* JOB DESCRIPTION */}
                <div>

                  <label
                    className="field-label"
                    htmlFor="jobDescription"
                  >
                    <span>
                      <span className="dashboard-step">02</span>
                      Target job description
                    </span>

                    <small>REQUIRED</small>
                  </label>

                  <textarea
                    className="field"
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) =>
                      setJobDescription(e.target.value.slice(0, 5000))
                    }
                    maxLength={5000}
                    required
                    placeholder={
                      'Paste the job description here...\n\nInclude responsibilities, required skills, and qualifications.'
                    }
                  />

                  <div className="form-meta">
                    <span>More detail helps AI personalize your plan.</span>
                    <span>
                      {jobDescription.length.toLocaleString()} / 5,000
                    </span>
                  </div>

                </div>

                {/* RESUME UPLOAD */}
                <div>

                  <label className="field-label">
                    <span>
                      <span className="dashboard-step">03</span>
                      Upload your resume
                    </span>

                    <small>PDF ONLY</small>
                  </label>

                  <label
                    className={`dropzone dashboard-dropzone ${isDragging ? 'is-dragging' : ''}`}
                    htmlFor="resume"
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      handleFile(e.dataTransfer.files?.[0])
                    }}
                  >

                    <span className="drop-icon">↥</span>

                    <strong>
                      {selectedFile
                        ? 'Your resume is ready!'
                        : 'Upload your resume'}
                    </strong>

                    <span>
                      {selectedFile
                        ? selectedFile.name
                        : 'Click to browse or drag your file here'}
                    </span>

                    <span className="upload-format">
                      PDF only · Maximum 3 MB
                    </span>

                    {selectedFile && (
                      <span className="upload-name">
                        {(selectedFile.size / 1024).toFixed(0)} KB ·
                        {' '}Click to replace
                      </span>
                    )}

                    <input
                      ref={resumeInputRef}
                      hidden
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,application/pdf"
                      onChange={(e) =>
                        handleFile(e.target.files?.[0])
                      }
                    />

                  </label>

                  {selectedFile && (
                    <button
                      type="button"
                      className="upload-remove"
                      onClick={() => {
                        setSelectedFile(null)
                        if (resumeInputRef.current) resumeInputRef.current.value = ''
                      }}
                    >
                      Remove selected resume
                    </button>
                  )}

                  <div className="or-line">
                    OR ADD YOUR EXPERIENCE MANUALLY
                  </div>

                  <textarea
                    className="field"
                    style={{ minHeight: 110 }}
                    id="selfDescription"
                    value={selfDescription}
                    onChange={(e) =>
                      setSelfDescription(e.target.value)
                    }
                    placeholder="Tell us about your education, skills, projects, internships and experience..."
                  />

                  <div className="form-meta">
                    <span>You can provide both for richer context.</span>
                    <span>{selfDescription.length} characters</span>
                  </div>

                </div>

                {formError && (
                  <div className="notice-error" role="alert">
                    {formError}
                  </div>
                )}

                {/* GENERATE BUTTON */}
                <div className="submit-row dashboard-submit">

                  <p>
                    <span className="ai-status-dot" aria-hidden="true" /> AI-powered personalized analysis
                    <br />
                    Your report will be saved to your account.
                  </p>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!canGenerate}
                  >
                    {loading ? (
                      <>
                        <span className="loading-dot" />
                        Generating report...
                      </>
                    ) : (
                      <>
                        Generate AI report <span>↗</span>
                      </>
                    )}
                  </button>

                </div>

              </div>

            </section>

            {/* RIGHT SIDEBAR */}
            <aside className="side-stack">

              <section className="card tip-card dashboard-info-card">

                <span className="eyebrow">
                  HOW IT WORKS
                </span>

                <h3>Your preparation journey.</h3>

                <p>
                  Orbitprep connects your current skills with the
                  requirements of your dream role.
                </p>

                <div className="mini-steps">

                  <div className="mini-step">
                    <span className="step-number">01</span>
                    <span>
                      <strong>Analyze your profile</strong>
                      <br />
                      Understand your skills and match score.
                    </span>
                  </div>

                  <div className="mini-step">
                    <span className="step-number">02</span>
                    <span>
                      <strong>Practice interviews</strong>
                      <br />
                      Prepare technical and behavioral questions.
                    </span>
                  </div>

                  <div className="mini-step">
                    <span className="step-number">03</span>
                    <span>
                      <strong>Follow your roadmap</strong>
                      <br />
                      Improve with a personalized preparation plan.
                    </span>
                  </div>

                </div>

              </section>

              <section className="card tip-card dashboard-tip-card">

                <span className="eyebrow">
                  PRO TIP
                </span>

                <h3>Give AI the real picture.</h3>

                <p>
                  Add your actual job description and mention your
                  projects, technical skills and internships.
                  Accurate details lead to more useful suggestions.
                </p>

                <div className="tip-decoration" aria-hidden="true"><OrbitMark className="ui-mark" /></div>

              </section>

            </aside>

          </div>

        </form>

        {/* REPORT HISTORY */}
        <section className="reports-section dashboard-reports">

          <div className="section-head">

            <div>
              <span className="eyebrow">
                YOUR SAVED WORKSPACE
              </span>

              <h2>Recent interview reports</h2>

              <p className="report-subtitle">
                Continue where your preparation journey left off.
              </p>
            </div>

            {recentReports.length > 0 && (
              <span className="count-pill">
                {recentReports.length} recent reports
              </span>
            )}

          </div>

          {recentReports.length > 0 ? (

            <div className="report-grid">

              {recentReports.map((report) => (

                <article
                  key={report._id}
                  className="card report-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    navigate(`/interview/${report._id}`)
                  }
                  role="button"
                  tabIndex={0}
                >

                  <div className="report-card-top">
                    <span className="report-symbol"><OrbitMark className="ui-mark" /></span>

                    <span className="report-score">
                      {Number.isFinite(Number(report.matchScore))
                        ? `${report.matchScore}% match`
                        : 'AI REPORT'}
                    </span>
                  </div>

                  <h3>
                    {report.title || 'Interview preparation'}
                  </h3>

                  <p>
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }
                        )
                      : 'Saved interview report'}
                  </p>

                  <div className="report-open">
                    <span>View report</span>
                    <span>↗</span>
                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="empty-state dashboard-empty">

              <span className="empty-icon"><OrbitMark className="ui-mark" /></span>

              <h3>Your workspace starts here.</h3>

              <p>
                Generate your first AI interview report and it will
                appear here automatically.
              </p>

            </div>

          )}

        </section>

      </main>

      <footer className="footer-note">
        Built for your next big opportunity.
      </footer>

    </div>
  )
}
