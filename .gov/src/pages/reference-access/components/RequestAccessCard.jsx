import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import ProgressStepper from './ProgressStepper.jsx'
import BasicInformation from './BasicInformation.jsx'
import AccessRole from './AccessRole.jsx'
import PurposeOfAccess from './PurposeOfAccess.jsx'
import DocumentUpload from './DocumentUpload.jsx'
import FormActions from './FormActions.jsx'
import { signUpRequestAccess } from '../../../services/authClient.js'

const EMPTY = {
  name: '', email: '', code: '+91', phone: '',
  ministry: '', designation: '', state: ''
}

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem('pragati-access-draft')) || {}
  } catch {
    return {}
  }
}

export default function RequestAccessCard() {
  const [draft] = useState(readDraft)
  const [values, setValues] = useState(draft.values || EMPTY)
  const [role, setRole] = useState(draft.role || 'gov')
  const [purpose, setPurpose] = useState(draft.purpose || '')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    const missing = ['name', 'email', 'phone', 'ministry', 'designation']
      .filter((k) => !values[k].trim())
    if (missing.length) {
      e.currentTarget.querySelector(`[name="${missing[0]}"], input, select`)?.focus()
      setError('Please complete all required fields in Basic Information.')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      setError('Enter a valid official email address.')
      return
    }
    if (values.phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid phone number with at least 10 digits.')
      return
    }
    if (file && (file.size > 5 * 1024 * 1024 || !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type))) {
      setError('Choose a PDF, JPG, or PNG file no larger than 5 MB.')
      return
    }

    setBusy(true)
    try {
      const email = values.email.trim().toLowerCase()
      const password = `${crypto.randomUUID()}Aa1!`
      const result = await signUpRequestAccess({
        requestId: crypto.randomUUID(),
        fullName: values.name.trim(),
        email,
        phone: `${values.code} ${values.phone}`,
        designation: values.designation,
        organization: values.ministry,
        stateUt: values.state,
        role: { gov: 'Government Official', analyst: 'Ministry Analyst', nodal: 'State Nodal Officer', partner: 'Authorized Partner' }[role],
        purpose,
        document: file,
        password,
      })
      localStorage.removeItem('pragati-access-draft')
      setNotice(result.needsEmailConfirm
        ? 'Request submitted. Check your email to confirm your account.'
        : `Request submitted. Sign in with ${email} and temporary password: ${password}`)
    } catch (submitError) {
      setError(submitError.message || 'We could not submit your request. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const saveDraft = () => {
    try {
      localStorage.setItem('pragati-access-draft', JSON.stringify({ values, role, purpose }))
      setNotice('Draft saved on this device.')
      setError('')
    } catch {
      setError('Draft could not be saved in this browser.')
    }
  }

  return (
    <main className="center">
      <form className="card" onSubmit={submit} noValidate>
        <div className="card__head">
          <div>
            <h2>Request Access</h2>
            <p className="card__sub">
              Fill in your details to request access. Your request will be reviewed by the PRAGATI team.
            </p>
          </div>
          <div className="signin">
            <span>Already have an account?</span>
            <button type="button" className="signin__link" onClick={() => { window.location.hash = '#/signin' }}>
              Sign In <ArrowRight size={13} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <ProgressStepper current={1} />

        <BasicInformation values={values} set={set} />
        <AccessRole value={role} onChange={setRole} />
        <PurposeOfAccess value={purpose} onChange={setPurpose} />
        <DocumentUpload file={file} onFile={setFile} />

        {error && <p className="access-message access-message--error" role="alert">{error}</p>}
        {notice && <p className="access-message access-message--success" role="status">{notice}</p>}

        <FormActions onDraft={saveDraft} onContinue={() => {}} busy={busy} />
      </form>
    </main>
  )
}
