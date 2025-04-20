<template>
    <form @submit.prevent="handleSend" class="flex gap-2 p-2 border-t">
      <input
        v-model="text"
        placeholder="Type a message..."
        class="flex-1 p-2 rounded border"
      />
      <button class="px-4 py-2 bg-blue-500 text-white rounded" type="submit">Send</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useChat } from '@/composables/useChat'
  
  // Define props to receive chatId (unique identifier for the chatroom)
  const props = defineProps({
    chatId: String
  })
  
  const text = ref('')  // User input message
  const { sendMessage } = useChat()  // Function to send message to Firestore
  
  function handleSend() {
    if (text.value.trim()) {
      sendMessage(text.value, props.chatId)  // Send message to Firestore with chatId
      text.value = ''  // Clear the input field
    }
  }
  </script>