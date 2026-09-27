import { useRef } from 'react'
import { Upload } from 'lucide-react'

export default function DocumentUpload({ file, onFile }) {
  const input = useRef(null)

  const drop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0])
  }

  return (
    <section className="sec sec--tight">
      <h3>4. Supporting Documents</h3>
      <p className="sec__hint">
        Upload an official authorization letter or identity document (if required).
      </p>

      <button
        type="button"
        className="upload"
        onClick={() => input.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={drop}
      >
        <Upload size={22} strokeWidth={1.7} />
        <span>
          <b>{file ? file.name : 'Drag and drop file here or click to upload'}</b>
          <span>Accepted formats: PDF, JPG, PNG&nbsp; |&nbsp; Max size: 5 MB</span>
        </span>
      </button>

      <input
        ref={input}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        hidden
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </section>
  )
}
