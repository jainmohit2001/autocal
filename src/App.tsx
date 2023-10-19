import { Button } from '@mui/material'
import { GoogleCalendar } from './utils/google-calendar'
import { useRef } from 'react'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const calendar = new GoogleCalendar(GOOGLE_API_KEY, GOOGLE_CLIENT_ID)

function App() {
  const authorizeRef = useRef(null as HTMLButtonElement | null)
  const signOutRef = useRef(null as HTMLButtonElement | null)

  async function onSignOut() {
    await calendar.singOut()
    signOutRef.current!.style.display = 'none'
    authorizeRef.current!.innerText = 'Authorize'
  }

  function onAuthorize() {
    calendar
      .authorize()
      .then(() => {
        authorizeRef.current!.innerText = 'Refresh'
        signOutRef.current!.style.display = 'inline-flex'
      })
      .catch(() => {
        authorizeRef.current!.disabled = true
        signOutRef.current!.style.display = 'none'
      })
  }

  return (
    <div className='flex gap-4'>
      <Button variant='contained' ref={authorizeRef} onClick={onAuthorize}>
        Authorize
      </Button>
      <Button
        style={{ display: 'none' }}
        variant='contained'
        color='error'
        ref={signOutRef}
        onClick={onSignOut}
      >
        Sign Out
      </Button>
    </div>
  )
}

export default App
