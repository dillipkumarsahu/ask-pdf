import { useCallback, useRef, useState } from 'react'
import { ApiError, uploadPdf } from '../api/client'

interface UploadScreenProps {
  onUploaded: (filename: string) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function UploadScreen({ onUploaded }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const rejectFile = (message: string) => {
    setError(message)
    setPendingFile(null)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleFile = useCallback(
    async (file: File) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        rejectFile('That file is not a PDF. Choose a .pdf file to continue.')
        return
      }
      if (file.size > 25 * 1024 * 1024) {
        rejectFile('That PDF is over 25 MB. Try a smaller file.')
        return
      }

      setError(null)
      setPendingFile(file)
      setIsUploading(true)
      try {
        const result = await uploadPdf(file)
        const label = typeof result.filename === 'string' ? result.filename : file.name
        onUploaded(label)
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Upload failed. Try again.')
        setPendingFile(null)
      } finally {
        setIsUploading(false)
      }
    },
    [onUploaded]
  )

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div className="upload-stage">
      <div className="upload-stage__intro">
        <span className="eyebrow">ask-pdf</span>
        <h1>Put a document on the desk.</h1>
        <p>Upload a PDF, then ask it anything. Answers are drawn only from what's on the page.</p>
      </div>

      <div
        className={`dropzone${isDragging ? ' dropzone--active' : ''}${
          isUploading ? ' dropzone--busy' : ''
        }${shake ? ' dropzone--shake' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={onFileChange}
          hidden
        />

        <div className={`dropzone__glyph${isUploading ? ' dropzone__glyph--pulse' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 48 56" width="42" height="48">
            <path
              d="M6 2h26l10 10v40a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
              fill="var(--surface)"
              stroke="var(--ink-3)"
              strokeWidth="1.5"
            />
            <path d="M32 2v10h10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
            <rect x="12" y="30" width="24" height="6" rx="1.5" fill="var(--accent)" opacity="0.85" />
            <text x="24" y="34.5" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="var(--accent-ink)" fontWeight="700">
              PDF
            </text>
          </svg>
        </div>

        {isUploading && pendingFile ? (
          <>
            <p className="dropzone__title">Reading {pendingFile.name}&hellip;</p>
            <p className="dropzone__hint">{formatBytes(pendingFile.size)} · this can take a moment</p>
            <div className="progress-bar" aria-hidden="true">
              <div className="progress-bar__fill" />
            </div>
          </>
        ) : (
          <>
            <p className="dropzone__title">
              Drop a PDF here, or <span className="dropzone__link">browse</span>
            </p>
            <p className="dropzone__hint">PDF only · up to 25 MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="upload-stage__error">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  )
}