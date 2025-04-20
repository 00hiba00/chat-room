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