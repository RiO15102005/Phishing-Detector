import type { Conversation } from "../types/conversation";

const STORAGE_KEY = "shield-conversations";

export function saveConversation(
  conversations: Conversation[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversations)
  );
}

export function loadConversation(): Conversation[] | null {
  const value = localStorage.getItem(STORAGE_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as Conversation[];
  } catch {
    return null;
  }
}