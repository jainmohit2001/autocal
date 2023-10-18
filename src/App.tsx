import { Button } from '@mui/material'
import { GoogleCalendar } from './utils/google'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const calendar = new GoogleCalendar(GOOGLE_API_KEY, GOOGLE_CLIENT_ID)

function App() {
  function onAuthorize() {
    const tokenClient = calendar.tokenClient
    if (!tokenClient) {
      console.error('cannot retrieve token client')
      return
    }

    tokenClient.callback = (resp) => {
      if (resp.error !== undefined) {
        console.error(resp.error)
        return
      }
      console.log(resp)
    }

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' })
    } else {
      tokenClient.requestAccessToken({ prompt: '' })
    }
  }

  return (
    <div className='flex gap-4'>
      <Button variant='contained' onClick={onAuthorize}>
        Authorize
      </Button>
      <Button variant='contained' color='error'>
        Sign Out
      </Button>
    </div>
  )
}

export default App
