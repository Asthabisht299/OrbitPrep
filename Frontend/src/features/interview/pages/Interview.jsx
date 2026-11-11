
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical questions', icon: '⌘' },
  { id: 'behavioral', label: 'Behavioral questions', icon: '◎' },
  { id: 'roadmap', label: 'Preparation roadmap', icon: '✳' },
]

function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <article className={`question-card report-question ${open ? 'question-open' : ''}`}>
      <button
        className="question-toggle"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="question-index">
          Q{String(index + 1).padStart(2, '0')}
        </span>

        <span className="question-text">
          {item?.question || 'Interview question'}
        </span>

        <span className="question-chevron">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="question-answer">

          {item?.intention && (
            <>
              <span className="answer-label">
                WHAT THE INTERVIEWER WANTS TO KNOW
              </span>
              <p>{item.intention}</p>
            </>
          )}

          <span className="answer-label">
            SUGGESTED ANSWER
          </span>

          <p>
            {item?.answer ||
              'Use a specific example, explain your approach, and share the result.'}
          </p>

        </div>
      )}
    </article>
  )
}

function RoadMapDay({ day }) {
  return (
    <article className="roadmap-day report-roadmap-day">

      <div className="roadmap-day-top">
        <span className="count-pill">
          DAY {day?.day ?? '—'}
        </span>
        <span className="roadmap-day-icon">✦</span>
      </div>

      <h3>{day?.focus || 'Preparation focus'}</h3>

      {Array.isArray(day?.tasks) && day.tasks.length > 0 ? (
        <ul>
          {day.tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      ) : (
        <p className="score-caption">No tasks listed for this day.</p>
      )}

    </article>
  )
}

export default function Interview() {
  const [activeNav, setActiveNav] = useState('technical')
  const [downloadError, setDownloadError] = useState('')

  const {
    report,
    loading,
    getResumePdf,
    error
  } = useInterview()

  const { interviewId } = useParams()
  const navigate = useNavigate()

  if (loading && !report) {
    return (
      <main className="loading-screen report-loading">
        <div>
          <span className="loading-dot" />
          Preparing your AI report...
        </div>
      </main>
    )
  }

  if (!report) {
    return (
      <div className="app-shell">

        <header className="topbar dashboard-topbar">
          <Link className="brand brand-v2" to="/">
            <span className="brand-mark">✳</span>
            <span>orbit<em>prep</em></span>
          </Link>
        </header>

        <main className="page-wrap">
          <div className="card form-card report-not-found">

            <span className="eyebrow">REPORT NOT AVAILABLE</span>

            <h1 className="page-title">
              We couldn't find this plan.
            </h1>

            <p className="subhead">
              {error ||
                'The report may have been removed or the server could not load it.'}
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
              style={{ marginTop: 22 }}
            >
              Back to dashboard ↗
            </button>

          </div>
        </main>
      </div>
    )
  }

  const technical = Array.isArray(report.technicalQuestions)
    ? report.technicalQuestions
    : []

  const behavioral = Array.isArray(report.behavioralQuestions)
    ? report.behavioralQuestions
    : []

  const roadmap = Array.isArray(report.preparationPlan)
    ? report.preparationPlan
    : []

  const gaps = Array.isArray(report.skillGaps)
    ? report.skillGaps
    : []

  const score = Math.max(
    0,
    Math.min(100, Number(report.matchScore) || 0)
  )

  const currentQuestions =
    activeNav === 'technical' ? technical : behavioral

  const download = async () => {
    setDownloadError('')

    const ok = await getResumePdf(interviewId)

    if (!ok) {
      setDownloadError(
        'PDF download failed. Please try again.'
      )
    }
  }

  return (
    <div className="app-shell report-page-v2">

      {/* TOP NAVIGATION */}
      <header className="topbar dashboard-topbar">

        <Link className="brand brand-v2" to="/">
          <span className="brand-mark">✳</span>
          <span>orbit<em>prep</em></span>
        </Link>

        <div className="topbar-right">
          <span className="pill">✦ AI REPORT</span>

          <button
            className="btn btn-ghost"
            onClick={() => navigate('/')}
          >
            ← Dashboard
          </button>
        </div>

      </header>

      <main className="page-wrap report-page-wrap">

        <Link className="report-back report-back-v2" to="/">
          ← All interview reports
        </Link>

        {/* REPORT INTRO */}
        <section className="report-intro-v2">

          <div>
            <span className="eyebrow">
              YOUR PERSONALIZED AI ANALYSIS
            </span>

            <h1 className="page-title">
              {report.title || 'Your interview strategy'}
            </h1>

            <p className="subhead">
              Your skills, role alignment, interview practice
              and personalized preparation roadmap.
            </p>
          </div>

          <div className="report-intro-status">
            <span className="status-dot" />
            REPORT GENERATED
          </div>

        </section>

        <div className="report-layout report-layout-v2">

          {/* LEFT NAVIGATION */}
          <nav className="card report-nav report-nav-v2">

            <div className="report-nav-brand">
              <span className="section-kicker">YOUR TOOLKIT</span>
              <p>Preparation sections</p>
            </div>

            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
                aria-current={activeNav === item.id ? 'page' : undefined}
              >
                <span className="report-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                <span className="nav-item-arrow">›</span>
              </button>
            ))}

            <div className="report-nav-divider" />

            <button
              className="btn btn-primary report-download-btn"
              onClick={download}
              disabled={loading}
            >
              ↓ Download resume
            </button>

            {downloadError && (
              <p className="download-error" role="alert">
                {downloadError}
              </p>
            )}

            <p className="report-nav-note">
              Your next opportunity starts with preparation.
            </p>

          </nav>

          {/* CENTER CONTENT */}
          <section className="report-main report-main-v2">

            <div className="card report-hero report-hero-v2">

              <span className="section-kicker">
                {activeNav === 'technical'
                  ? '01 / TECHNICAL PREPARATION'
                  : activeNav === 'behavioral'
                    ? '02 / PERSONAL & BEHAVIORAL'
                    : '03 / YOUR LEARNING PLAN'}
              </span>

              <h2>
                {activeNav === 'technical'
                  ? 'Technical interview practice'
                  : activeNav === 'behavioral'
                    ? 'Show them who you are'
                    : 'Your preparation roadmap'}
              </h2>

              <p>
                {activeNav === 'technical'
                  ? 'Strengthen your technical understanding with questions tailored to your target role.'
                  : activeNav === 'behavioral'
                    ? 'Practice explaining your experiences, decisions, teamwork and problem-solving.'
                    : 'Follow your personalized preparation schedule one day at a time.'}
              </p>

            </div>

            <div className="card report-section report-section-v2">

              {activeNav === 'roadmap' ? (

                <>
                  <div className="report-section-head">
                    <div>
                      <span className="section-kicker">
                        YOUR ACTION PLAN
                      </span>
                      <h2>Preparation roadmap</h2>
                    </div>

                    <span className="count-pill">
                      {roadmap.length} days
                    </span>
                  </div>

                  {roadmap.length ? (
                    <div className="roadmap-list">
                      {roadmap.map((day, index) => (
                        <RoadMapDay
                          key={day.day ?? index}
                          day={day}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      No roadmap items were included in this report.
                    </div>
                  )}
                </>

              ) : (

                <>
                  <div className="report-section-head">

                    <div>
                      <span className="section-kicker">
                        PRACTICE & IMPROVE
                      </span>

                      <h2>
                        {activeNav === 'technical'
                          ? 'Technical questions'
                          : 'Behavioral questions'}
                      </h2>
                    </div>

                    <span className="count-pill">
                      {currentQuestions.length} questions
                    </span>

                  </div>

                  {currentQuestions.length ? (
                    <div className="question-list">
                      {currentQuestions.map((item, index) => (
                        <QuestionCard
                          key={index}
                          item={item}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      No questions were included in this section.
                    </div>
                  )}

                </>

              )}

            </div>

          </section>

          {/* RIGHT ANALYTICS SIDEBAR */}
          <aside className="card report-sidebar report-sidebar-v2">

            <div className="score-panel score-panel-v2">

              <span className="section-kicker">
                ROLE ALIGNMENT
              </span>

              <div
                className="score-circle score-circle-v2"
                style={{ '--score': `${score}%` }}
              >
                <div className="score-circle-inner">
                  <strong>{score}</strong>
                  <span>%</span>
                </div>
              </div>

              <h3>Profile match</h3>

              <p className="score-caption">
                Your current profile alignment for this target role.
              </p>

            </div>

            <div className="sidebar-divider" />

            <section className="report-skills-v2">

              <span className="section-kicker">
                SKILL GAP ANALYSIS
              </span>

              <h3>Skills to improve</h3>

              <div className="skill-list">
                {gaps.length ? (
                  gaps.map((gap, index) => (
                    <span key={index} className="skill-tag">
                      {gap?.skill || 'Skill'}
                      {gap?.severity ? ` · ${gap.severity}` : ''}
                    </span>
                  ))
                ) : (
                  <span className="score-caption">
                    No skill gaps listed in this report.
                  </span>
                )}
              </div>

            </section>

            <div className="sidebar-divider" />

            <section className="report-reminder-v2">

              <span className="section-kicker">
                A QUICK REMINDER
              </span>

              <p>
                Don't memorize every answer. Understand the concepts,
                use your own real examples, and practice speaking
                confidently.
              </p>

            </section>

          </aside>

        </div>

      </main>

      <footer className="footer-note">
        Built for your next big opportunity · orbitprep ✳
      </footer>

    </div>
  )
}
