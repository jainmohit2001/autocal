const GOOGLE_CLIENT_URL = 'https://accounts.google.com/gsi/client'
const GOOGLE_API_URL = 'https://apis.google.com/js/api.js'

// Authorization scopes required by the API;
// multiple scopes can be included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar'
const DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'

interface TokenClient extends google.accounts.oauth2.TokenClient {
  callback?: (resp: google.accounts.oauth2.TokenResponse) => void
}

export class GoogleCalendar {
  tokenClient?: TokenClient
  apiKey: string
  clientId: string

  constructor(apiKey: string, clientId: string) {
    this.apiKey = apiKey
    this.clientId = clientId
    this.initializeGoogle()
  }

  initializeGoogle() {
    const scriptGapi = document.createElement('script')
    scriptGapi.src = GOOGLE_API_URL
    scriptGapi.async = true
    scriptGapi.defer = true
    scriptGapi.onload = () => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: this.apiKey,
          discoveryDocs: [DISCOVERY_DOC],
        })
      })
    }

    const scriptGoogleClient = document.createElement('script')
    scriptGoogleClient.src = GOOGLE_CLIENT_URL
    scriptGoogleClient.async = true
    scriptGoogleClient.defer = true
    scriptGoogleClient.onload = () => {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: SCOPES,
        callback: () => {},
      })
    }

    document.body.appendChild(scriptGapi)
    document.body.appendChild(scriptGoogleClient)
  }

  async authorize(): Promise<google.accounts.oauth2.TokenResponse> {
    return new Promise<google.accounts.oauth2.TokenResponse>((res, rej) => {
      const tokenClient = this.tokenClient
      if (!tokenClient) {
        rej('Invalid token client')
        gapi.client.setToken(null)
        return
      }

      // Callback when the user provides access
      tokenClient.callback = (resp) => {
        if (resp.error !== undefined) {
          console.error(resp.error)
          rej(resp.error)
          gapi.client.setToken(null)
          return
        }
        gapi.client.setToken(resp)
        res(resp)
      }

      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' })
      } else {
        tokenClient.requestAccessToken({ prompt: '' })
      }
    })
  }

  async signOut(): Promise<void> {
    return new Promise<void>((res) => {
      const token = gapi.client.getToken()
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
          res()
        })
        gapi.client.setToken(null)
        return
      }
      res()
    })
  }

  async listEvents(): Promise<gapi.client.calendar.Event[]> {
    return new Promise<gapi.client.calendar.Event[]>((res, rej) => {
      const params: gapi.client.calendar.EventsListParameters = {
        calendarId: 'primary',
        maxResults: 20,
        showDeleted: false,
        maxAttendees: 4,
        timeMin: new Date().toISOString(),
      }
      gapi.client.calendar.events
        .list(params)
        .then((resp) => {
          res(resp.result.items)
        })
        .catch((e) => {
          rej(e)
        })
    })
  }
}
