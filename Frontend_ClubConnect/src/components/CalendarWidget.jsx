import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarWidget = ({ events }) => {
  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white shadow-lg rounded-lg overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day']}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarWidget;