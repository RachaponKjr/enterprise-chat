export function toTimestamp(date: Date) {
  const milliseconds = date.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  return { seconds, nanos: (milliseconds - seconds * 1000) * 1_000_000 };
}