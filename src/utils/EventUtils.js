import { convertToMinutes } from '../utils/DateUtils';

export function getEventById(events, id) {
  return events.find((e) => e.id === id);
}

export function getOverlap(events) {
  if (!events.length) return;

  const newEvents = events.map((event) => ({
    ...event,
    overlap: [event.id],
    order: 1,
  }));

  if (newEvents.length < 2) return newEvents;

  // set overlapping events
  for (let i = 0; i < newEvents.length; i++) {
    for (let j = i + 1; j < newEvents.length; j++) {
      const firstEvent = newEvents[i];
      const secondEvent = newEvents[j];

      const eventsAreOnDifferentDays = firstEvent.date !== secondEvent.date;
      if (eventsAreOnDifferentDays) continue;

      const firstEventStart = convertToMinutes(firstEvent.startTime);
      const firstEventEnd = firstEventStart + 60;
      const secondEventStart = convertToMinutes(secondEvent.startTime);
      const secondEventEnd = secondEventStart + 60;

      const firstEventStartsDuringSecondEvent = firstEventStart >= secondEventStart && firstEventStart < secondEventEnd;
      const firstEventEndsDuringSecondEvent = firstEventEnd > secondEventStart && firstEventEnd <= secondEventEnd;
      if (firstEventStartsDuringSecondEvent || firstEventEndsDuringSecondEvent) {
        firstEvent.overlap.push(secondEvent.id);
        secondEvent.overlap.push(firstEvent.id);
      }
    }
  }

  // set order of overlapping events
  for (const event of newEvents) {
    event.overlap.sort((id1, id2) => {
      const event1 = newEvents.find((e) => e.id === id1);
      const event2 = newEvents.find((e) => e.id === id2);
      const startTime1 = convertToMinutes(event1.startTime);
      const startTime2 = convertToMinutes(event2.startTime);
      if (startTime1 !== startTime2) return startTime1 - startTime2;

      // same start time => return whichever appears first in events
      const event1Ind = events.indexOf(event1);
      const event2Ind = events.indexOf(event2);
      return event1Ind - event2Ind;
    });
    event.order = event.overlap.indexOf(event.id) + 1;
  }
  return newEvents;
}
