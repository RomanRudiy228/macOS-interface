export const APP_CATALOG: Record<string, { name: string; src: string }> = {
  finder: { name: "Finder", src: "/images/finder.webp" },
  safari: { name: "Safari", src: "/images/safari.webp" },
  notes: { name: "Notes", src: "/images/notes.webp" },
  messages: { name: "Messages", src: "/images/messages.webp" },
  calendar: { name: "Calendar", src: "/images/calendar.webp" },
  facetime: { name: "FaceTime", src: "/images/facetime.webp" },
  "app-store": { name: "App Store", src: "/images/app-store.webp" },
  bluetooth: { name: "Bluetooth", src: "/images/bluetooth.webp" },
  calculator: { name: "Calculator", src: "/images/calculator.webp" },
  settings: { name: "Settings", src: "/images/settings.webp" },
  siri: { name: "Siri", src: "/images/siri.webp" },
  terminal: { name: "Terminal", src: "/images/terminal.webp" },
  "voice-memos": { name: "Voice Memos", src: "/images/voice-memos.webp" },
  weather: { name: "Weather", src: "/images/weather.webp" },
  trash: { name: "Trash", src: "/images/trash.png" },
};

export const DEFAULT_DOCK_ORDER = [
  "finder",
  "safari",
  "notes",
  "messages",
  "calendar",
  "facetime",
  "app-store",
  "bluetooth",
  "calculator",
  "settings",
  "siri",
  "terminal",
  "voice-memos",
  "weather",
  "trash",
] as const;

export const ICON_SIZE = 70;
export const SCALES = [1.55, 1.3, 1.1, 1] as const;
export const SLOT_HEIGHT = ICON_SIZE;
