export type OpenWindow = {
  id: string;
  title: string;
  isMinimized: boolean;
};

export type WindowsContextValue = {
  openWindows: OpenWindow[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  setActiveWindow: (id: string | null) => void;
  isOpen: (id: string) => boolean;
  isActive: (id: string) => boolean;
  isMinimized: (id: string) => boolean;
};
