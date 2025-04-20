<template>
    <div class="chatroom-item">
      <!-- Display all messages for this chatroom -->
      <div v-for="message in messages" :key="message.id" class="message">
        <p>{{ message.text }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue'
  import { db } from '../firebase/firebase.js'
  import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
  
  // Define props to receive chatId for the chatroom
  const props = defineProps({
    chatId: String
  })
  
  const messages = ref([])  // Store messages for this specific chatroom
  
  // Listen for real-time changes to the messages in the chatroom
  const messagesRef = collection(db, 'chatrooms', props.chatId, 'messages')
  const q = query(messagesRef, orderBy('timestamp', 'asc'))
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  })
  
  // Clean up listener when component is unmounted
  onUnmounted(() => unsubscribe())
  </script>
  
  <style scoped>
  /* Style for individual messages */
  .message {
    padding: 10px;
    margin: 5px;
    border-bottom: 1px solid #ddd;
  }
  </style>