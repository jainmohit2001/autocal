declare module 'gapi.calendar' {
  export class Event extends gapi.client.calendar.Event {
    backgroundColor?: string
  }
}
