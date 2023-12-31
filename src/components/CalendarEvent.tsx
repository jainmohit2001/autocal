import { GroupOutlined, EventOutlined } from '@mui/icons-material'
import { Event } from 'gapi.calendar'

const dateTimeFormat: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}

function CalendarEvent(obj: Event) {
  const start = obj.start.date ?? obj.start.dateTime
  const end = obj.end.date ?? obj.end.dateTime

  let startDate: Date | undefined = undefined
  let endDate: Date | undefined = undefined
  if (start) {
    startDate = new Date(start)
  }
  if (end) {
    endDate = new Date(end)
  }
  let dateTimeString: string | undefined = undefined
  if (startDate && endDate) {
    dateTimeString =
      startDate.toLocaleString(undefined, dateTimeFormat) +
      ' - ' +
      endDate.toLocaleString(undefined, dateTimeFormat)
  } else if (startDate) {
    dateTimeString = startDate.toLocaleString(undefined, dateTimeFormat)
  } else if (endDate) {
    dateTimeString = endDate.toLocaleString(undefined, dateTimeFormat)
  }

  return (
    <div className='w-full p-2 sm:w-6/12 lg:w-4/12 2xl:w-3/12' key={obj.id}>
      <a
        className='flex h-full flex-col gap-3 rounded-md bg-gray-100 p-2 text-black transition-all ease-in-out hover:scale-105'
        key={obj.id}
        href={obj.htmlLink}
        target='_blank'
      >
        <div className='flex items-center gap-3'>
          {obj.backgroundColor && (
            <div
              className='h-4 w-4 rounded-md'
              style={{ backgroundColor: obj.backgroundColor }}
            />
          )}
          <p className='line-clamp-1 text-lg font-medium'>
            {obj.summary && obj.summary.length > 0
              ? obj.summary
              : obj.description}
          </p>
        </div>
        {dateTimeString && <p className='text-xs'>{dateTimeString}</p>}

        {obj.attendees && obj.attendees.length > 0 && (
          <div className='flex flex-col gap-2'>
            <p className='inline-flex items-center text-sm'>
              <GroupOutlined fontSize='small' className='mr-2' />
              {obj.attendees.length} Guests
            </p>
            <div className='ml-2 flex flex-col'>
              {obj.attendees
                .slice(0, Math.min(3, obj.attendees.length))
                .map((attendee, index) => (
                  <div className='flex flex-col gap-1' key={index}>
                    <p className='text-xs'>{attendee.email}</p>
                  </div>
                ))}
              {obj.attendees.length >= 4 && <p className='text-xs'>...</p>}
            </div>
          </div>
        )}
        {obj.organizer.email &&
          obj.organizer.email !== 'unknownorganizer@calendar.google.com' && (
            <div className='inline-flex items-center'>
              <EventOutlined fontSize='small' className='mr-2' />
              <div className='flex flex-col gap-1 overflow-hidden'>
                <p
                  className='overflow-hidden text-ellipsis text-xs'
                  aria-label={obj.organizer.email}
                >
                  {obj.organizer.email}
                </p>
              </div>
            </div>
          )}
      </a>
    </div>
  )
}

export default CalendarEvent
