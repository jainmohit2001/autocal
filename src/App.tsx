import { Button, CircularProgress } from '@mui/material'
import { GoogleCalendar } from './utils/google-calendar'
import { useRef, useState } from 'react'
import CalendarEvent from './components/CalendarEvent'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const calendar = new GoogleCalendar(GOOGLE_API_KEY, GOOGLE_CLIENT_ID)

function App() {
  const authorizeRef = useRef(null as HTMLButtonElement | null)
  const signOutRef = useRef(null as HTMLButtonElement | null)
  const listEventsRef = useRef(null as HTMLButtonElement | null)
  const [fetchingEvents, setFetchingEvents] = useState(false)

  const [events, setEvents] = useState([] as gapi.client.calendar.Event[])

  async function onSignOut() {
    await calendar.signOut()
    signOutRef.current!.style.display = 'none'
    authorizeRef.current!.innerText = 'Authorize'
    listEventsRef.current!.style.display = 'none'
  }

  function onListEvents() {
    if (fetchingEvents) {
      return
    }
    setFetchingEvents(true)
    calendar
      .listEvents()
      .then((res) => {
        setEvents(res)
      })
      .finally(() => {
        setFetchingEvents(false)
      })
  }

  function onAuthorize() {
    calendar
      .authorize()
      .then(() => {
        authorizeRef.current!.innerText = 'Refresh'
        signOutRef.current!.style.display = 'inline-flex'
        listEventsRef.current!.style.display = 'inline-flex'
      })
      .catch(() => {
        authorizeRef.current!.disabled = true
        signOutRef.current!.style.display = 'none'
        listEventsRef.current!.style.display = 'none'
      })
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex w-full gap-4'>
        <Button variant='contained' ref={authorizeRef} onClick={onAuthorize}>
          Authorize
        </Button>

        <Button
          className='mr-auto'
          variant='contained'
          onClick={onListEvents}
          ref={listEventsRef}
          style={{ display: 'none' }}
        >
          {fetchingEvents ? (
            <CircularProgress style={{ color: 'white' }} size={24} />
          ) : (
            'List events'
          )}
        </Button>
        <div className='ml-auto'>
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
      </div>

      {events.length > 0 && (
        <div className='flex flex-col gap-3'>
          <p className='text-lg font-bold'>{events.length} Events</p>
          <div className='flex w-full flex-wrap'>
            {events.map((obj) => {
              return CalendarEvent(obj)
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
