import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types'

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const { role, content, isError } = message
  const isEmptyAssistant = role === 'assistant' && !isError && content === ''

  return (
    <div className={`message message--${role}`}>
      {role === 'assistant' && (
        <div className="message__mark" aria-hidden="true">
          ⟡
        </div>
      )}
      <div className={`message__bubble${isError ? ' message__bubble--error' : ''}`}>
        {isEmptyAssistant ? (
          <span className="typing">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </span>
        ) : role === 'assistant' && !isError ? (
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  )
}