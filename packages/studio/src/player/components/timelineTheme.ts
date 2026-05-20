import type { TimelineElement } from "../store/playerStore";

export interface TimelineTrackStyle {
  clip: string;
  accent: string;
  label: string;
  iconBackground: string;
}

export interface TimelineTheme {
  shellBackground: string;
  shellBorder: string;
  rulerBorder: string;
  rowBackground: string;
  rowBorder: string;
  gutterBackground: string;
  gutterBorder: string;
  textPrimary: string;
  textSecondary: string;
  tickText: string;
  tickMajor: string;
  tickMinor: string;
  clipBackground: string;
  clipBackgroundActive: string;
  clipBorder: string;
  clipBorderHover: string;
  clipBorderActive: string;
  clipShadow: string;
  clipShadowHover: string;
  clipShadowActive: string;
  clipShadowDragging: string;
  handleColor: string;
  panelResizeSeam: string;
  panelResizeActive: string;
  clipRadius: string;
}

const TIMELINE_TEAL = "#3CE6AC";
const TIMELINE_TEAL_LABEL = "var(--hf-timeline-label, #E9FFF6)";
const TIMELINE_TEAL_ICON_BACKGROUND = "rgba(60,230,172,0.12)";

function createTrackStyle(): TimelineTrackStyle {
  return {
    clip: TIMELINE_TEAL,
    accent: TIMELINE_TEAL,
    label: TIMELINE_TEAL_LABEL,
    iconBackground: TIMELINE_TEAL_ICON_BACKGROUND,
  };
}

const TRACK_STYLES: Record<string, TimelineTrackStyle> = {
  video: createTrackStyle(),
  audio: createTrackStyle(),
  img: createTrackStyle(),
  div: createTrackStyle(),
  span: createTrackStyle(),
  p: createTrackStyle(),
  h1: createTrackStyle(),
  section: createTrackStyle(),
  sfx: createTrackStyle(),
};

const DEFAULT_TRACK_STYLE: TimelineTrackStyle = createTrackStyle();

export const defaultTimelineTheme: TimelineTheme = {
  shellBackground: "#0A0A0B",
  shellBorder: "rgba(255,255,255,0.05)",
  rulerBorder: "rgba(255,255,255,0.045)",
  rowBackground: "#0A0A0B",
  rowBorder: "rgba(255,255,255,0.05)",
  gutterBackground: "#0A0A0B",
  gutterBorder: "rgba(255,255,255,0.05)",
  textPrimary: "#E8EDF5",
  textSecondary: "#8391A8",
  tickText: "rgba(131,145,168,0.92)",
  tickMajor: "rgba(255,255,255,0.13)",
  tickMinor: "rgba(255,255,255,0.08)",
  clipBackground: "linear-gradient(180deg, rgba(20,25,34,0.98), rgba(14,18,27,0.98))",
  clipBackgroundActive: "linear-gradient(180deg, rgba(24,30,40,0.99), rgba(15,20,29,0.99))",
  clipBorder: "rgba(255,255,255,0.07)",
  clipBorderHover: "rgba(255,255,255,0.11)",
  clipBorderActive: "rgba(255,255,255,0.14)",
  clipShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 18px rgba(0,0,0,0.18)",
  clipShadowHover: "inset 0 1px 0 rgba(255,255,255,0.035), 0 8px 20px rgba(0,0,0,0.2)",
  clipShadowActive:
    "inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 24px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.035)",
  clipShadowDragging:
    "inset 0 1px 0 rgba(255,255,255,0.04), 0 18px 36px rgba(0,0,0,0.34), 0 8px 16px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.04)",
  handleColor: "rgba(255,255,255,0.11)",
  panelResizeSeam: "rgba(255,255,255,0.12)",
  panelResizeActive: "rgba(255,255,255,0.24)",
  clipRadius: "11px 15px 13px 9px / 10px 14px 12px 10px",
};

export const lightTimelineTheme: TimelineTheme = {
  shellBackground: "#F8FAFC",
  shellBorder: "#DCE5F0",
  rulerBorder: "#E2E8F0",
  rowBackground: "#FFFFFF",
  rowBorder: "#E2E8F0",
  gutterBackground: "#F8FAFC",
  gutterBorder: "#DCE5F0",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  tickText: "rgba(71,85,105,0.92)",
  tickMajor: "rgba(15,23,42,0.16)",
  tickMinor: "rgba(15,23,42,0.08)",
  clipBackground: "linear-gradient(180deg, rgba(240,253,250,0.98), rgba(220,252,231,0.98))",
  clipBackgroundActive:
    "linear-gradient(180deg, rgba(209,250,229,0.99), rgba(187,247,208,0.99))",
  clipBorder: "rgba(5,150,105,0.32)",
  clipBorderHover: "rgba(5,150,105,0.52)",
  clipBorderActive: "rgba(5,150,105,0.72)",
  clipShadow: "inset 0 1px 0 rgba(255,255,255,0.86), 0 6px 18px rgba(15,23,42,0.08)",
  clipShadowHover: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 20px rgba(15,23,42,0.1)",
  clipShadowActive:
    "inset 0 1px 0 rgba(255,255,255,0.92), 0 10px 24px rgba(15,23,42,0.12), 0 0 0 1px rgba(5,150,105,0.18)",
  clipShadowDragging:
    "inset 0 1px 0 rgba(255,255,255,0.92), 0 18px 36px rgba(15,23,42,0.16), 0 8px 16px rgba(15,23,42,0.1), 0 0 0 1px rgba(5,150,105,0.22)",
  handleColor: "rgba(15,23,42,0.22)",
  panelResizeSeam: "rgba(15,23,42,0.12)",
  panelResizeActive: "rgba(15,23,42,0.24)",
  clipRadius: defaultTimelineTheme.clipRadius,
};

export function getTimelineTrackStyle(tag: string): TimelineTrackStyle {
  const normalized = tag.toLowerCase();
  if (
    normalized.startsWith("h") &&
    normalized.length === 2 &&
    "123456".includes(normalized[1] ?? "")
  ) {
    return TRACK_STYLES.h1;
  }
  return TRACK_STYLES[normalized] ?? DEFAULT_TRACK_STYLE;
}

export function getClipHandleOpacity({
  isHovered,
  isSelected,
  isDragging,
}: {
  isHovered: boolean;
  isSelected: boolean;
  isDragging: boolean;
}): number {
  if (isDragging) return 0.95;
  if (isSelected) return 0.82;
  if (isHovered) return 0.76;
  return 0;
}

export function getRenderedTimelineElement({
  element,
  draggedElementId,
  previewStart,
  previewTrack,
}: {
  element: TimelineElement;
  draggedElementId: string | null;
  previewStart: number | null;
  previewTrack: number | null;
}): TimelineElement {
  if (
    (element.key ?? element.id) !== draggedElementId ||
    previewStart === null ||
    previewTrack === null
  ) {
    return element;
  }
  return {
    ...element,
    start: previewStart,
    track: previewTrack,
  };
}
