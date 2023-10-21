import { Checkbox, FormControlLabel } from '@mui/material'

function CalendarListEntry(
  obj: gapi.client.calendar.CalendarListEntry,
  selected: boolean,
  cb: (id: string) => void,
) {
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            onChange={() => cb(obj.id)}
            size='small'
            checked={selected}
            style={{ color: obj.backgroundColor ?? 'white' }}
          />
        }
        key={obj.id}
        label={obj.summary}
      />
    </div>
  )
}

export default CalendarListEntry
