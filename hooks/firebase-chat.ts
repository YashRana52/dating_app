import { db } from "@/lib/firebase";
import { ChatMessage, Conversation } from "@/lib/types";
import { UserProfile } from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type { ChatMessage, Conversation };

//create new conversation or existing conversation do

export const getOrCreateConversation = async (
  userId1: string,
  userId2: string
): Promise<string> => {
  const conversationRef = collection(db, "conversations");

  const q = query(
    conversationRef,
    where("participants", "array-contains", userId1)
  );

  const querySnapshot = await getDocs(q);

  let existingConversationId: string | null = null;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.participants.includes(userId2)) {
      existingConversationId = doc.id;
    }
  });

  if (existingConversationId) {
    return existingConversationId;
  }

  const newConversation = await addDoc(conversationRef, {
    participants: [userId1, userId2],
    createdAt: serverTimestamp(),
    lastMessage: null,
    lastMessageTime: null,
    lastMessageType: null,
  });

  return newConversation.id;
};

//send message
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
  type: "text" | "audio",
  audioUrl?: string,
  audioDuration?: number
) => {
  const messageRef = collection(db, "messages");
  const messageData = {
    conversationId,
    senderId,
    receiverId,
    content,
    type,
    timestamp: serverTimestamp(),
    read: false,
    ...(audioUrl && { audioUrl }),
    ...(audioDuration && { audioDuration }),
  };

  await addDoc(messageRef, messageData);

  const conversationRef = doc(db, "conversations", conversationId);
  await updateDoc(conversationRef, {
    lastMessage: type === "audio" ? "♫ Voice message" : content,
    lastMessageTime: serverTimestamp(),
    lastMessageType: type,
  });
};

// subscribe to message

export const subscribeToMessage = (
  conversationId: string,
  callback: (message: ChatMessage[]) => void
) => {
  const messageRef = collection(db, "messages");
  const q = query(
    messageRef,
    where("conversationId", "==", conversationId),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const message = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];

    callback(message);
  });
};

export const subscribeToConversation = (
  userId: string,
  callback: (conversations: Conversation[]) => void
) => {
  const conversationRef = collection(db, "conversations");
  const q = query(
    conversationRef,
    where("participants", "array-contains", userId),
    orderBy("lastMessageTime", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const conversation = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[];

    callback(conversation);
  });
};

// get user profile

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return { uid: userId, ...userDoc.data() } as UserProfile;
  }

  return null;
};

//mark message read

export const markMessageAsRead = async (
  conversationId: string,
  userId: string
) => {
  const messageRef = collection(db, "messages");

  const q = query(
    messageRef,
    where("conversationId", "==", conversationId),
    where("receiverId", "==", userId),
    where("read", "==", false)
  );

  const querySnapshot = await getDocs(q);
  const updatePromise = querySnapshot.docs.map((doc) =>
    updateDoc(doc.ref, { read: true })
  );

  await Promise.all(updatePromise);
};

//delete message

export const deleteMessage = async (messageId: string) => {
  const messageRef = doc(db, "messages", messageId);

  await deleteDoc(messageRef);
};

//react on messages

export const reactMessage = async (
  messageId: string,
  userId: string,
  emoji: string
) => {
  const messageRef = doc(db, "messages", messageId);
  const messageDoc = await getDoc(messageRef);

  if (!messageDoc.exists()) return;

  const messageData = messageDoc.data();
  const reactions = messageData.reaction || {};

  // Agar emoji key nahi hai to create karo
  if (!reactions[emoji]) {
    reactions[emoji] = [];
  }

  const userIndex = reactions[emoji].indexOf(userId);

  if (userIndex > -1) {
    // User already reacted → remove
    reactions[emoji].splice(userIndex, 1);

    // Agar koi reaction nahi bacha → emoji hata do
    if (reactions[emoji].length === 0) {
      delete reactions[emoji];
    }
  } else {
    //  User ne react nahi kiya → add
    reactions[emoji].push(userId);
  }

  // Firestore update
  await updateDoc(messageRef, {
    reaction: reactions,
  });
};
