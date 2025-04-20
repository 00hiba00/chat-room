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
  .message {
    margin: 10px;
    padding: 10px;
    border-radius: 8px;
    max-width: 70%;
  }
  
  .my-message {
    margin-left: auto;
    background-color: #dcf8c6;
  }
  
  .other-message {
    margin-right: auto;
    background-color: #ffffff;
  }
  
  .message-sender {
    font-weight: bold;
    font-size: 0.8rem;
    margin-bottom: 4px;
  }
  
  .message-content {
    word-wrap: break-word;
  }
  
  .message-time {
    font-size: 0.7rem;
    color: #666;
    text-align: right;
    margin-top: 4px;
  }
  </style>