import { ref } from 'vue';
import { db } from '../firebase/firebase.js';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  doc, 
  updateDoc,
  where, getDocs
} from 'firebase/firestore';

export function useChat() {
  const chatrooms = ref([]);
  const messages = ref([]);
  const error = ref(null);




  const createChatroom = async (type, participants = [], name = '') => {
  try {
    if (!participants || participants.length === 0) {
      throw new Error('At least one participant is required');
    }

    const chatroomData = {
      type,
      participants: Array.isArray(participants) ? participants : [participants],
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };

    if (type === 'group') {
      chatroomData.name = name || 'New Group Chat';
    } else {
      if (chatroomData.participants.length !== 2) {
        throw new Error('Single chat must have exactly 2 participants');
      }

      const sortedParticipants = [...chatroomData.participants].sort();

      const q = query(
        collection(db, 'chatrooms'),
        where('participants', 'array-contains', sortedParticipants[0])
      );

      const querySnapshot = await getDocs(q);

      for (let docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (
          data.type === 'single' &&
          Array.isArray(data.participants) &&
          data.participants.length === 2 &&
          data.participants.includes(sortedParticipants[0]) &&
          data.participants.includes(sortedParticipants[1])
        ) {
          // Chatroom déjà existante
          alert("Chatroom already exists");
          console.log('Chatroom already exists:', docSnap.id);
          return docSnap.id;
        }
      }

      chatroomData.participants = sortedParticipants;

      const chatroomRef = await addDoc(collection(db, 'chatrooms'), chatroomData);
      return chatroomRef.id;
    }

    const chatroomRef = await addDoc(collection(db, 'chatrooms'), chatroomData);
    return chatroomRef.id;

  } catch (e) {
    error.value = e.message;
    console.error('Error creating chatroom:', e);
    return null;
  }
};






  const sendMessage = async (text, chatId, senderId) => {
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'chatrooms', chatId, 'messages'), {
        text,
        senderId,
        timestamp: serverTimestamp(),
      });
      
      await updateDoc(doc(db, 'chatrooms', chatId), {
        lastActive: serverTimestamp()
      });
    } catch (e) {
      error.value = e.message;
      console.error('Error sending message:', e);
    }
  };

  const fetchUserChatrooms = async (userEmail) => {
    try {
      const q = query(
        collection(db, 'chatrooms'),
        where('participants', 'array-contains', userEmail),
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        chatrooms.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          displayName: doc.data().name || 
            doc.data().participants.filter(p => p !== userEmail).join(', ') || 
            'Private Chat'
        }));
      });

      return unsubscribe;
    } catch (e) {
      error.value = e.message;
      console.error('Error fetching chatrooms:', e);
      return () => {}; 
    }
  };

  const fetchMessages = (chatId) => {
    try {
      const q = query(
        collection(db, 'chatrooms', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
      });

      return unsubscribe;
    } catch (e) {
      error.value = e.message;
      console.error('Error fetching messages:', e);
      return () => {};
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