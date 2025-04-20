<template>
    <div class="chatroom-view">
      <div class="header">
        <h2>{{ chatroomName }}</h2>
        <p class="participants">{{ participantsText }}</p>
      </div>
      
      <div class="messages-container">
        <ChatroomItem :chatId="$route.params.id" />
      </div>
      
      <MessageInput :chatId="$route.params.id" />
    </div>
  </template>
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { db } from '../firebase/firebase.js';
  import { doc, onSnapshot } from 'firebase/firestore';
  import { useAuth } from '@/composables/useAuth';
  import ChatroomItem from '@/components/ChatroomItem.vue';
  import MessageInput from '@/components/MessageInput.vue';
  
  export default {
    components: { ChatroomItem, MessageInput },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const { user: currentUser } = useAuth();
      const chatroomData = ref(null);
  
      const chatroomName = computed(() => {
        return chatroomData.value?.name || 'Private Chat';
      });
  
      const participantsText = computed(() => {
        if (!chatroomData.value?.participants) return '';
        return `Participants: ${chatroomData.value.participants.join(', ')}`;
      });
  
      onMounted(() => {
        const unsubscribe = onSnapshot(doc(db, 'chatrooms', route.params.id), (doc) => {
          if (!doc.exists()) {
            router.push('/');
            return;
          }
          
          const data = doc.data();
          if (!data.participants.includes(currentUser.value.email)) {
            router.push('/');
            return;
          }
          
          chatroomData.value = data;
        });
        
        return () => unsubscribe();
      });
  
      return {
        chatroomName,
        participantsText
      };
    }
  };
  </script>
  <style scoped>
  .chatroom-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .participants {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  </style>