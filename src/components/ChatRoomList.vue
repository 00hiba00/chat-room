<template>
    <div>
      <b-list-group>
        <b-list-group-item 
          v-for="chatroom in chatrooms" 
          :key="chatroom.id"
          @click="enterChatroom(chatroom.id)"
          class="d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{{ chatroom.displayName }}</strong>
            <div class="text-muted small">
              {{ formatLastActive(chatroom.lastActive) }}
            </div>
          </div>
          <b-badge v-if="hasUnreadMessages(chatroom)" variant="primary">New</b-badge>
        </b-list-group-item>
      </b-list-group>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '@/composables/useAuth';
  import { useChat } from '@/composables/useChat';
  
  export default {
    setup() {
      const router = useRouter();
      const { user } = useAuth();
      const { chatrooms, fetchUserChatrooms } = useChat();
  
      // Fetch user's chatrooms when component mounts
      onMounted(() => {
        if (user.value) {
          fetchUserChatrooms(user.value.email);
        }
      });
  
      const enterChatroom = (chatId) => {
        router.push({ name: 'chatroom', params: { id: chatId } });
      };
  
      const formatLastActive = (timestamp) => {
        if (!timestamp) return 'No activity';
        return timestamp.toDate().toLocaleString();
      };
  
      const hasUnreadMessages = (chatroom) => {
        // Implement your unread messages logic here
        return false;
      };
  
      return {
        chatrooms,
        enterChatroom,
        formatLastActive,
        hasUnreadMessages
      };
    }
  };
  </script>
  <style scoped>
.chatroom-list {
  max-width: 650px;
  margin: 2rem auto;
  padding: 1.2rem;
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.chatroom-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  margin-bottom: 0.8rem;
  border-radius: 10px;
  border: 1px solid #dcdfe1;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chatroom-item:hover {
  background-color: #f1f3f5;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.chatroom-item div {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.chatroom-item .text-muted {
  font-size: 0.85rem;
  color: #6c757d;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
  border-radius: 12px;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.badge:hover {
  background-color: #0056b3;
}
</style>