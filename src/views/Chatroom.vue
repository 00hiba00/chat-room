<template>
    <div>
      
      <h2>{{ chatroom.name || 'Private Chat' }}</h2>
      
      <div class="message-container">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="{ 'my-message': message.senderId === currentUser.uid }"
        >
          <div class="message-content">{{ message.text }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
  
      <b-form @submit.prevent="send">
        <b-input-group>
          <b-form-input v-model="newMessage" placeholder="Type your message" />
          <b-input-group-append>
            <b-button type="submit" variant="primary">Send</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </div>
  </template>
  
  <script>
  import { ref, watch, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useChat } from '@/composables/useChat';
  import { useAuth } from '@/composables/useAuth';
  
  export default {
    setup() {
      const route = useRoute();
      const { user: currentUser } = useAuth();
      const { 
        messages, 
        sendMessage, 
        fetchMessages,
        error 
      } = useChat();
      
      const chatroom = ref({});
      const newMessage = ref('');
      let unsubscribe;
  
      onMounted(() => {
        unsubscribe = fetchMessages(route.params.id);
      });
  
      onUnmounted(() => {
        if (unsubscribe) unsubscribe();
      });
  
      const send = async () => {
        if (newMessage.value.trim()) {
          await sendMessage(
            route.params.id,
            newMessage.value,
            currentUser.value.uid
          );
          newMessage.value = '';
        }
      };
  
      const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return timestamp.toDate().toLocaleTimeString();
      };
  
      return {
        chatroom,
        messages,
        newMessage,
        currentUser,
        send,
        formatTime,
        error
      };
    }
  };
  </script>
  
  <style scoped>
  .message-container {
    height: 60vh;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  .message {
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: #f0f0f0;
  }
  .my-message {
    background: #d4edff;
    margin-left: auto;
    max-width: 70%;
  }
  .message-time {
    font-size: 0.8rem;
    color: #666;
  }
  </style>