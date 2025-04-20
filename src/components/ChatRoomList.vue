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
            <strong>{{ chatroom.name || 'Private Chat' }}</strong>
            <div class="text-muted small">
              {{ formatLastActive(chatroom.lastActive) }}
            </div>
          </div>
          <b-badge variant="primary">New</b-badge>
        </b-list-group-item>
      </b-list-group>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    props: {
      chatrooms: {
        type: Array,
        required: true
      }
    },
    setup() {
      const router = useRouter();
  
      const enterChatroom = (chatId) => {
        router.push({ name: 'chatroom', params: { id: chatId } });
      };
  
      const formatLastActive = (timestamp) => {
        if (!timestamp) return 'No activity';
        const date = timestamp.toDate();
        return date.toLocaleString();
      };
  
      return {
        enterChatroom,
        formatLastActive
      };
    }
  };
  </script>