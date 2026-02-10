import { MenuItem } from "../components/context-menu/context-menu";

// -----------------------------------------------------------
// Finder Menu
// -----------------------------------------------------------
export const finderMenuItems: MenuItem[] = [
  { label: "About Finder" },
  { label: "Preferences", shortcut: "⌘ ," },
  { isDivider: true, label: "" },
  { label: "Empty Trash" },
  { isDivider: true, label: "" },
  { label: "Hide Finder", shortcut: "⌘ H" },
  { label: "Hide Others", shortcut: "⌥ ⌘ H" },
  { label: "Show All", disabled: true },
];

// -----------------------------------------------------------
// File Menu
// -----------------------------------------------------------
export const fileMenuItems: MenuItem[] = [
  { label: "New Finder Window", shortcut: "⌘ N" },
  { label: "New Folder", shortcut: "⌥ ⌘ N" },
  { label: "New Smart Folder" },
  { label: "New Tab", shortcut: "⌘ T" },
  { isDivider: true, label: "" },
  { label: "Open", shortcut: "⌘ O" },
  { label: "Open With" },
  { isDivider: true, label: "" },
  { label: "Close Window", shortcut: "⌘ W" },
];

// -----------------------------------------------------------
// Edit Menu
// -----------------------------------------------------------
export const editMenuItems: MenuItem[] = [
  { label: "Undo", shortcut: "⌘ Z", disabled: true },
  { label: "Redo", shortcut: "⌥ ⌘ Z", disabled: true },
  { isDivider: true, label: "" },
  { label: "Cut", shortcut: "⌘ X" },
  { label: "Copy", shortcut: "⌘ C" },
  { label: "Paste", shortcut: "⌘ V" },
  { label: "Select All", shortcut: "⌘ A" },
  { isDivider: true, label: "" },
  { label: "Show Clipboard" },
];

// -----------------------------------------------------------
// View Menu
// -----------------------------------------------------------
export const viewMenuItems: MenuItem[] = [
  { label: "as Icons", shortcut: "⌘ 1" },
  { label: "as List", shortcut: "⌘ 2" },
  { label: "as Columns", shortcut: "⌘ 3" },
  { label: "as Gallery", shortcut: "⌘ 4" },
  { isDivider: true, label: "" },
  { label: "Show Tab Bar" },
  { label: "Show All Tabs" },
  { label: "Show Sidebar", shortcut: "⌥ ⌘ S" },
  { label: "Hide Toolbar" },
];

// -----------------------------------------------------------
// Go Menu
// -----------------------------------------------------------
export const goMenuItems: MenuItem[] = [
  { label: "Back", shortcut: "⌘ [" },
  { label: "Forward", shortcut: "⌘ ]" },
  { label: "Enclosing Folder", shortcut: "⌘ ↑" },
  { isDivider: true, label: "" },
  { label: "Documents", shortcut: "⌥ ⌘ D" },
  { label: "Desktop", shortcut: "⌥ ⌘ D" },
  { label: "Downloads", shortcut: "⌥ ⌘ L" },
  { label: "Home", shortcut: "⌥ ⌘ H" },
  { label: "Applications", shortcut: "⌥ ⌘ A" },
];

// -----------------------------------------------------------
// Window Menu
// -----------------------------------------------------------
export const windowMenuItems: MenuItem[] = [
  { label: "Minimize", shortcut: "⌘ M" },
  { label: "Zoom" },
  { isDivider: true, label: "" },
  { label: "Bring All to Front" },
  { isDivider: true, label: "" },
  { label: "Finder", disabled: true },
];

// -----------------------------------------------------------
// Help Menu
// -----------------------------------------------------------
export const helpMenuItems: MenuItem[] = [
  { label: "Search" },
  { isDivider: true, label: "" },
  { label: "macOS Help" },
];
