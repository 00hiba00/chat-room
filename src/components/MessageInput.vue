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
  <style scoped>
.message-input-form {
  display: flex;
  padding: 1.2rem;
  background: #f9f9fb;
  border-top: 1px solid #e2e6ea;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.1);
}

.message-input {
  flex: 1;
  padding: 0.85rem 1.2rem;
  border: 1px solid #dcdfe1;
  border-radius: 12px;
  outline: none;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.message-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

.send-button {
  margin-left: 1rem;
  padding: 0.75rem 1.8rem;
  background: linear-gradient(135deg, #007bff, #0069d9);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.2s ease;
}

.send-button:hover {
  background: linear-gradient(135deg, #0069d9, #0056b3);
  transform: translateY(-2px);
}

.send-button:active {
  transform: translateY(2px);
}
</style>
