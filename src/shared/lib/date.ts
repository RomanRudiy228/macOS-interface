export const formatMacOSTime = (date: Date): string => {
  const timeString = date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return timeString.replace(/,/g, "");
};
