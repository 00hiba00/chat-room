import { ref } from 'vue';
import { db } from '../firebase/firebase.js';
import { 
  collection, addDoc, serverTimestamp, 
  query, orderBy, onSnapshot,
  doc, setDoc, arrayUnion
} from 'firebase/firestore';

export function useChat() {
  const chatrooms = ref([]);
  const messages = ref([]);
  const error = ref(null);

  // Create different types of chatrooms
  const createChatroom = async (type, participants = [], name = '') => {
    try {
      const chatroomData = {
        type,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      };

      if (type === 'group') {
        chatroomData.name = name || 'New Group Chat';
        chatroomData.participants = participants;
      } else if (type === 'single') {
        chatroomData.participants = participants.sort().join('_'); // Create unique ID for 1:1 chats
      }

      const chatroomRef = await addDoc(collection(db, 'chatrooms'), chatroomData);
      return chatroomRef.id;
    } catch (e) {
      error.value = e.message;
      console.error('Error creating chatroom:', e);
      return null;
    }
  };

  // Send message to chatroom
  const sendMessage = async (chatId, text, senderId) => {
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'chatrooms', chatId, 'messages'), {
        text,
        senderId,
        timestamp: serverTimestamp(),
      });
      
      // Update lastActive timestamp
      await updateDoc(doc(db, 'chatrooms', chatId), {
        lastActive: serverTimestamp()
      });
    } catch (e) {
      error.value = e.message;
      console.error('Error sending message:', e);
    }
  };

  // Fetch chatrooms for a user
  const fetchUserChatrooms = async (userId) => {
    try {
      const q = query(
        collection(db, 'chatrooms'),
        orderBy('lastActive', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        chatrooms.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });

      return unsubscribe;
    } catch (e) {
      error.value = e.message;
      console.error('Error fetching chatrooms:', e);
    }
  };

  // Fetch messages for a chatroom
  const fetchMessages = (chatId) => {
    try {
      const q = query(
        collection(db, 'chatrooms', chatId, 'messages'),
        orderBy('timestamp')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });

      return unsubscribe;
    } catch (e) {
      error.value = e.message;
      console.error('Error fetching messages:', e);
    }
  };

  return {
    chatrooms,
    messages,
    error,
    createChatroom,
    sendMessage,
    fetchUserChatrooms,
    fetchMessages
  };
}