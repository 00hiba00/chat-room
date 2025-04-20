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
  import { useAuth } from '@/composables/useAuth'
  
  const props = defineProps({
    chatId: String
  })
  
  const { user } = useAuth()
  const text = ref('')
  const { sendMessage } = useChat()
  
  function handleSend() {
    if (text.value.trim() && user.value) {
      sendMessage(text.value, props.chatId, user.value.uid)
      text.value = ''
    }
  }
  </script>