import { getMarketplaceListingById } from "@/lib/marketplace-storage";
import { getUserById } from "@/lib/mock-auth";

export type MessageItem = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type ConversationItem = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageItem[];
};

export type InboxItem = {
  conversation: ConversationItem;
  listing: any;
  lastMessage: MessageItem | null;
  otherUser: any;
};

const STORAGE_KEY = "smart-baby-marketplace-conversations";

function readConversations(): ConversationItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveConversations(data: ConversationItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUserConversations(userId: string): InboxItem[] {
  const conversations = readConversations();

  return conversations
    .filter(
      (c) => c.buyerId === userId || c.sellerId === userId
    )
    .map((conversation) => {
      const listing = getMarketplaceListingById(conversation.listingId);
      const lastMessage =
        conversation.messages[conversation.messages.length - 1] ?? null;

      const otherUserId =
        conversation.buyerId === userId
          ? conversation.sellerId
          : conversation.buyerId;

      const otherUser = getUserById(otherUserId);

      return {
        conversation,
        listing,
        lastMessage,
        otherUser,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.conversation.updatedAt).getTime() -
        new Date(a.conversation.updatedAt).getTime()
    );
}

export function createConversationWithFirstMessage(params: {
  listingId: string;
  buyerId: string;
  sellerId: string;
  text: string;
}) {
  const conversations = readConversations();
  const now = new Date().toISOString();

  const newConversation: ConversationItem = {
    id: crypto.randomUUID(),
    listingId: params.listingId,
    buyerId: params.buyerId,
    sellerId: params.sellerId,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: crypto.randomUUID(),
        senderId: params.buyerId,
        text: params.text,
        createdAt: now,
      },
    ],
  };

  saveConversations([newConversation, ...conversations]);

  return newConversation;
}