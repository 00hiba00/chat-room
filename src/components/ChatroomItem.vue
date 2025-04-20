<template>
    <div class="chatroom-item">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message" 
        :class="{ 'my-message': message.senderId === currentUserId }"
      >
        <div class="message-sender" v-if="showSender(message)">
          {{ senderNames[message.senderId] || 'Loading...' }}
        </div>
        <div class="message-content">
          {{ message.text }}
        </div>
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted, computed, watch } from 'vue'
  import { db } from '../firebase/firebase.js'
  import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore'
  import { useAuth } from '@/composables/useAuth'
  
  const props = defineProps({
    chatId: String
  })
  
  const { user } = useAuth()
  const currentUserId = computed(() => user.value?.uid)
  const messages = ref([])
  const senderNames = ref({}) // Stores cached sender names
  
  // Fetch sender names when messages change
  watch(messages, async (newMessages) => {
    for (const message of newMessages) {
      if (!senderNames.value[message.senderId] && message.senderId !== currentUserId.value) {
        try {
          const userDoc = await getDoc(doc(db, 'users', message.senderId))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            senderNames.value[message.senderId] = userData.displayName || userData.email || 'Unknown User'
            // Trigger reactivity by creating new object
            senderNames.value = {...senderNames.value}
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          senderNames.value[message.senderId] = 'Unknown User'
          senderNames.value = {...senderNames.value}
        }
      }
    }
  }, { deep: true })
  
  const messagesRef = collection(db, 'chatrooms', props.chatId, 'messages')
  const q = query(messagesRef, orderBy('timestamp', 'asc'))
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  })
  
  const showSender = (message) => {
    return message.senderId !== currentUserId.value
  }
  
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  onUnmounted(() => unsubscribe())
  </script>
  
  
  <style scoped>
.chatroom-item {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9f9fb;
  border-radius: 16px;
  max-height: 80vh;
  overflow-y: auto;
}

.message {
  margin: 0.4rem 0;
  padding: 0.9rem 1.1rem;
  border-radius: 18px;
  max-width: 70%;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.my-message {
  margin-left: auto;
  background: linear-gradient(135deg, #4a90e2, #3578e5);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-sender {
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  color: #444;
}

.my-message .message-sender {
  color: rgba(255, 255, 255, 0.9);
}

.message-content {
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.95rem;
}

.message-time {
  font-size: 0.7rem;
  text-align: right;
  margin-top: 0.4rem;
  opacity: 0.75;
}

.my-message .message-time {
  color: rgba(255, 255, 255, 0.85);
}
  </style>