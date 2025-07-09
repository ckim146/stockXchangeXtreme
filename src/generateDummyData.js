export function generateDummyCandleData(startDateStr, numDays) {
  const data = [];
  const startDate = new Date(startDateStr);

  for (let i = 0; i < numDays; i++) {
    const timestamp = new Date(startDate);
    timestamp.setDate(startDate.getDate() + i);
    const time = timestamp.getTime();

    const open = getRandom(240, 270);
    const close = getRandom(240, 270);
    const high = Math.max(open, close) + getRandom(0, 2);
    const low = Math.min(open, close) - getRandom(0, 2);

    data.push([time, round(open), round(high), round(low), round(close)]);
  }
  return data;

  // Helpers
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function round(value) {
    return Math.round(value * 100) / 100; // 2 decimal places
  }
}
