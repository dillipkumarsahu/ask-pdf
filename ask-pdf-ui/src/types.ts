export type AppStage = 'upload' | 'chat'

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  isError?: boolean
}

export interface UploadResponse {
  message?: string
  filename?: string
  [key: string]: unknown
}

export interface AskResponse {
  answer?: string
  response?: string
  result?: string
  message?: string
  [key: string]: unknown
}
