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
}
