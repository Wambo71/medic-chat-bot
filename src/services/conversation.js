// Simple in-memory conversation state management
const conversationStates = new Map();

export function getConversationState(phone) {
  return conversationStates.get(phone) || { step: 'menu', data: {} };
}

export function setConversationState(phone, state) {
  conversationStates.set(phone, state);
}

export function clearConversationState(phone) {
  conversationStates.delete(phone);
}