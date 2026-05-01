import { ScoreResponse } from "@/lib/api";

export const HISTORY_STORAGE_KEY = "axiom_score_history";

export type ScoreInputMethod = "consent_handle" | "upi_id" | "phone_number";

export type ScoreHistoryEntry = ScoreResponse & {
  user_id: string;
  input_method: ScoreInputMethod;
  requested_at: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveScoreHistory(entry: ScoreHistoryEntry) {
  if (!isBrowser()) {
    return;
  }

  const history = getScoreHistory();
  history.unshift(entry);
  window.localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(history.slice(0, 20))
  );
}

export function getScoreHistory(): ScoreHistoryEntry[] {
  if (!isBrowser()) {
    return [];
  }

  const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as ScoreHistoryEntry[];
  } catch {
    return [];
  }
}

export function getLatestScore(): ScoreHistoryEntry | null {
  const history = getScoreHistory();
  return history.length ? history[0] : null;
}
