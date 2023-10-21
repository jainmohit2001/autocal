import { Button, CircularProgress } from '@mui/material'
import { GoogleCalendar } from './utils/google-calendar'
import { useEffect, useRef, useState } from 'react'
import CalendarEvent from './components/CalendarEvent'
import CalendarListEntry from './components/CalendarListEntry'
import { Event } from 'gapi.calendar'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const calendar = new GoogleCalendar(GOOGLE_API_KEY, GOOGLE_CLIENT_ID)

function App() {
  const authorizeRef = useRef(null as HTMLButtonElement | null)
  const signOutRef = useRef(null as HTMLButtonElement | null)
  const [fetchingEvents, setFetchingEvents] = useState(false)

  const [events, setEvents] = useState([] as Event[])
  const [calendarListEntries, setCalendarListEntries] = useState(
    [] as gapi.client.calendar.CalendarListEntry[],
  )

  async function onSignOut() {
    await calendar.signOut()
    signOutRef.current!.style.display = 'none'
    authorizeRef.current!.innerText = 'Authorize'
  }

  useEffect(() => {
    setFetchingEvents(true)
    let promises: Promise<Event[]>[] = []

    calendarListEntries
      .filter((value) => value.selected)
      .forEach(async (e) => {
        promises.push(calendar.listEvents(e.id, e.backgroundColor))
      })

    Promise.all(promises)
      .then((values) => {
        let newList: Event[] = []
        values.forEach((arr) => {
          newList = newList.concat(arr)
        })
        setEvents(newList)
      })
      .finally(() => {
        setFetchingEvents(false)
      })
  }, [calendarListEntries])

  async function getCalenderList() {
    calendar
      .getCalendars()
      .then((res) => {
        setCalendarListEntries(res.items)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  function onCalendarSelect(calendarId: string) {
    const newList = calendarListEntries.map((entry) => {
      if (entry.id === calendarId) {
        return { ...entry, selected: !entry.selected }
      }
      return entry
    })
    setCalendarListEntries(newList)
  }

  async function onAuthorize() {
    calendar
      .authorize()
      .then(() => {
        authorizeRef.current!.innerText = 'Refresh'
        signOutRef.current!.style.display = 'inline-flex'
        getCalenderList()
      })
      .catch(() => {
        authorizeRef.current!.disabled = true
        signOutRef.current!.style.display = 'none'
      })
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex w-full gap-4'>
        <Button variant='contained' ref={authorizeRef} onClick={onAuthorize}>
          Authorize
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

      {calendarListEntries.length > 0 && (
        <div className='flex flex-col'>
          <p className='mb-2 text-lg font-bold'>My Calendars</p>
          {calendarListEntries.map((obj) =>
            CalendarListEntry(obj, obj.selected ?? false, onCalendarSelect),
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3'>
            <p className='text-lg font-bold'>{events.length} Events</p>
            {fetchingEvents && (
              <CircularProgress size={28} style={{ color: 'white' }} />
            )}
          </div>
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
