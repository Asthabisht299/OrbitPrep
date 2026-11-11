import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from '../services/interview.api'
import { useContext, useEffect, useState } from 'react'
import { InterviewContext } from '../interview.context'
import { useParams } from 'react-router'

export const useInterview = () => {
  const context = useContext(InterviewContext)
  const { interviewId } = useParams()
  if (!context) throw new Error('useInterview must be used within an InterviewProvider')
  const { loading, setLoading, report, setReport, reports, setReports } = context
  const [error, setError] = useState('')

  const generateReport = async ({ targetRole, jobDescription, selfDescription, resumeFile }) => {
    setLoading(true); setError('')
    try { const response = await generateInterviewReport({ targetRole, jobDescription, selfDescription, resumeFile }); const next = response?.interviewReport; if (!next?._id) throw new Error('The server response did not include an interview report.'); setReport(next); return next }
    catch (err) { const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to generate report.'; setError(message); console.error('Generate interview report:', message); return null }
    finally { setLoading(false) }
  }
  const getReportById = async (id) => {
    setLoading(true); setError('')
    try { const response = await getInterviewReportById(id); const next = response?.interviewReport; if (!next) throw new Error('No interview report was returned.'); setReport(next); return next }
    catch (err) { const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to load this report.'; setError(message); console.error('Get interview report:', message); return null }
    finally { setLoading(false) }
  }
  const getReports = async () => {
    setLoading(true); setError('')
    try { const response = await getAllInterviewReports(); const items = response?.interviewReports || []; setReports(items); return items }
    catch (err) { const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to load your saved reports.'; setError(message); console.error('Get interview reports:', message); setReports([]); return [] }
    finally { setLoading(false) }
  }
  const getResumePdf = async (id) => {
    setLoading(true); setError('')
    try { const response = await generateResumePdf({ interviewReportId: id }); const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' })); const link = document.createElement('a'); link.href = url; link.download = `resume_${id}.pdf`; document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url); return true }
    catch (err) { const message = err.response?.data?.message || err.message || 'Unable to download the resume PDF.'; setError(message); console.error('Generate resume PDF:', message); return false }
    finally { setLoading(false) }
  }
  useEffect(() => { if (interviewId) getReportById(interviewId); else getReports() }, [interviewId])
  return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf }
}
