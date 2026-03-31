import { currentUser, getUserById } from "@/lib/mock-auth";
import { getMarketplaceListingById } from "@/lib/marketplace-storage";

export type MarketplaceConversation = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
};

export type MarketplaceMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

const CONVERSATIONS_KEY = "smart-baby-marketplace-conversations";
const MESSAGES_KEY = "smart-baby-marketplace-messages";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredConversations(): MarketplaceConversation[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MarketplaceConversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredConversations(
  conversations: MarketplaceConversation[]
) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function getStoredMessages(): MarketplaceMessage[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MarketplaceMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredMessages(messages: MarketplaceMessage[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function getConversationById(
  conversationId: string
): MarketplaceConversation | null {
  const conversations = getStoredConversations();
  return conversations.find((item) => item.id === conversationId) ?? null;
}

export function getMessagesForConversation(
  conversationId: string
): MarketplaceMessage[] {
  return getStoredMessages()
    .filter((message) => message.conversationId === conversationId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function addMessageToConversation(params: {
  conversationId: string;
  senderId: string;
  text: string;
}) {
  const { conversationId, senderId, text } = params;

  const cleanText = text.trim();
  if (!cleanText) return null;

  const messages = getStoredMessages();
  const conversations = getStoredConversations();
  const now = new Date().toISOString();

  const newMessage: MarketplaceMessage = {
    id: crypto.randomUUID(),
    conversationId,
    senderId,
    text: cleanText,
    createdAt: now,
  };

  saveStoredMessages([...messages, newMessage]);

  const updatedConversations = conversations.map((conversation) =>
    conversation.id === conversationId
      ? {
          ...conversation,
          updatedAt: now,
        }
      : conversation
  );

  saveStoredConversations(updatedConversations);

  return newMessage;
}

export function createOrGetConversationForListing(params: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}) {
  const { listingId, buyerId, sellerId } = params;
  const conversations = getStoredConversations();

  const existing = conversations.find(
    (conversation) =>
      conversation.listingId === listingId &&
      conversation.buyerId === buyerId &&
      conversation.sellerId === sellerId
  );

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();

  const newConversation: MarketplaceConversation = {
    id: crypto.randomUUID(),
    listingId,
    buyerId,
    sellerId,
    createdAt: now,
    updatedAt: now,
  };

  saveStoredConversations([newConversation, ...conversations]);

  return newConversation;
}

export function createConversationWithFirstMessage(params: {
  listingId: string;
  buyerId: string;
  sellerId: string;
  text: string;
}) {
  const { listingId, buyerId, sellerId, text } = params;

  const conversation = createOrGetConversationForListing({
    listingId,
    buyerId,
    sellerId,
  });

  addMessageToConversation({
    conversationId: conversation.id,
    senderId: buyerId,
    text,
  });

  return conversation;
}

export function getUserConversations(userId: string) {
  const conversations = getStoredConversations()
    .filter(
      (conversation) =>
        conversation.buyerId === userId || conversation.sellerId === userId
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const messages = getStoredMessages();

  return conversations.map((conversation) => {
    const listing = getMarketplaceListingById(conversation.listingId);
    const lastMessage = messages
      .filter((message) => message.conversationId === conversation.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    const otherUserId =
      conversation.buyerId === userId
        ? conversation.sellerId
        : conversation.buyerId;

    const otherUser = getUserById(otherUserId);

    return {
      conversation,
      listing,
      lastMessage: lastMessage ?? null,
      otherUser,
    };
  });
}

export function seedAutoReplyIfNeeded(conversationId: string) {
  const conversation = getConversationById(conversationId);
  if (!conversation) return;

  const messages = getMessagesForConversation(conversationId);
  const hasSellerReply = messages.some(
    (message) => message.senderId === conversation.sellerId
  );

  if (hasSellerReply) return;

  const listing = getMarketplaceListingById(conversation.listingId);
  const seller = getUserById(conversation.sellerId);

  addMessageToConversation({
    conversationId,
    senderId: conversation.sellerId,
    text: `Hi, this is ${seller?.name ?? "the seller"}. ${
      listing?.isDonation
        ? "Yes, the donation is still available."
        : "Yes, the item is still available."
    }`,
  });
}

export function getConversationViewModel(conversationId: string) {
  const conversation = getConversationById(conversationId);
  if (!conversation) return null;

  const listing = getMarketplaceListingById(conversation.listingId);
  const buyer = getUserById(conversation.buyerId);
  const seller = getUserById(conversation.sellerId);
  const messages = getMessagesForConversation(conversationId);

  return {
    conversation,
    listing,
    buyer,
    seller,
    messages,
    currentUser,
  };
}