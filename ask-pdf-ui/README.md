# ask-pdf UI

React + TypeScript chat interface for the ask-pdf backend: upload a PDF, then ask
questions about it.

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend
npm run dev
```

## API assumptions

The client was written against this contract — adjust `src/api/client.ts` if your
backend differs:

- `POST {base_url}/upload` — multipart form-data, file field named `file`.
  Any JSON response is accepted; if it includes a `filename` field, that's shown
  in the chat header, otherwise the locally selected file's name is used.
- `GET {base_url}/ask?question=...` — the client reads `answer`, `response`,
  `result`, or `message` from the JSON response (first one present wins). If the
  backend returns plain text instead of JSON, that's shown as-is.

Both calls surface `detail` / `message` / `error` fields from non-2xx responses
as the error text shown in the UI.

## Project structure

```
src/
  api/client.ts        fetch wrappers for /upload and /ask
  components/
    UploadScreen.tsx   drag-and-drop / browse PDF upload
    ChatScreen.tsx      question input + message history
    MessageBubble.tsx   single chat message
  App.tsx               switches between upload and chat stages
  types.ts              shared TS types
```

## Notes

- No chat history is persisted — refreshing resets to the upload screen.
- "Upload a different PDF" just resets the UI state; it does not call any
  delete/reset endpoint (add one if your backend needs it to swap documents).
