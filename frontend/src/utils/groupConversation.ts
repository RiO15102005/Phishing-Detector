import type { Conversation } from "../types/conversation";

interface ConversationGroups {
  today: Conversation[];
  yesterday: Conversation[];
  week: Conversation[];
  older: Conversation[];
}

export function groupConversation(
  conversations: Conversation[]
): ConversationGroups {
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const week: Conversation[] = [];
  const older: Conversation[] = [];

  const now = new Date();

  conversations.forEach((conversation) => {
    const created = new Date(conversation.createdAt);

    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      today.push(conversation);
    } else if (diffDays === 1) {
      yesterday.push(conversation);
    } else if (diffDays < 7) {
      week.push(conversation);
    } else {
      older.push(conversation);
    }
  });

  return {
    today,
    yesterday,
    week,
    older,
  };
}