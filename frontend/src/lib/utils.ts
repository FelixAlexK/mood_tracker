export const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function formattedDate(createdAt: string | null) {
  if (!createdAt)
    return "";

  const d = new Date(Date.parse(createdAt));
  const localizedTime = new Intl.DateTimeFormat(navigator.language, {
    timeZone: userTimezone,
    dateStyle: "medium",
    timeStyle: "short",

  }).format(d);

  return localizedTime;
}

export function getDayName(dateString: string, short: boolean = false) {
  const date = new Date(dateString);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (short)
    return shortDays[date.getDay()];

  return days[date.getDay()];
}
