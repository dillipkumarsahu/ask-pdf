import { useState } from 'react'
import UploadScreen from './components/UploadScreen'
import ChatScreen from './components/ChatScreen'
import type { AppStage } from './types'
import './App.css'

export default function App() {
  const [stage, setStage] = useState<AppStage>('upload')
  const [filename, setFilename] = useState('')

  return (
    <div className="page">
      <div className="page__sheet">
        {stage === 'upload' ? (
          <UploadScreen
            onUploaded={(name) => {
              setFilename(name)
              setStage('chat')
            }}
          />
        ) : (
          <ChatScreen
            filename={filename}
            onReset={() => {
              setFilename('')
              setStage('upload')
            }}
          />
        )}
      </div>
    </div>
  )
}
