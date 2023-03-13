export function processOverlappingEvents(events) {
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];
      const startTime1 = convertToMinutes(event1.startTime);
      const endTime1 = startTime1 + 60 // convertToMinutes(event1.endTime);
      const startTime2 = convertToMinutes(event2.startTime);
      const endTime2 = startTime2 + 60 // convertToMinutes(event2.endTime);

      if ( // Events overlap
        !(event1.overlap && event1.overlap.includes(event2.id)) && // aren't set as overlapping eachother alr
        (startTime1 >= startTime2 && startTime1 < endTime2) || // startTime1 in between startTime2 and endTime2
        (endTime1 > startTime2 && endTime1 <= endTime2) // endTime1 in between startTime2 and endTime2
      ) {

        // mark that the events are overlapping each other
        event1.overlap = event1.overlap ?? [];
        event1.push(event2.id);
        event2.overlap = event2.overlap ?? [];
        event2.push(event1.id);
      }
    }
  }
}
