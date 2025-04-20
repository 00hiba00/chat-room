<template>
    <div>
      <b-button @click="showModal = true">Create New Chatroom</b-button>
  
      <b-modal v-model="showModal" title="Create Chatroom">
        <b-form @submit.prevent="handleSubmit">
          <b-form-select v-model="chatroomType" :options="chatroomTypes" class="mb-3" />
          
          <b-form-input
            v-if="chatroomType === 'group'"
            v-model="chatroomName"
            placeholder="Group name"
            class="mb-3"
          />
  
          <b-form-tags
            v-model="participants"
            placeholder="Add participants by email"
            class="mb-3"
          />
  
          <b-button type="submit" variant="primary">Create</b-button>
        </b-form>
      </b-modal>
  
      <ChatRoomList :chatrooms="chatrooms" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useChat } from '@/composables/useChat';
  import { useAuth } from '@/composables/useAuth'; // Import useAuth
  import ChatRoomList from '@/components/ChatRoomList.vue';
  
  export default {
    components: { ChatRoomList },
    setup() {
      const { 
        chatrooms,
        createChatroom,
        fetchUserChatrooms 
      } = useChat();
      
      const { user: currentUser } = useAuth(); // Get current user from auth
      
      const showModal = ref(false);
      const chatroomType = ref('single');
      const chatroomName = ref('');
      const participants = ref([]);
      
      const chatroomTypes = [
        { value: 'single', text: 'Single Chat' },
        { value: 'group', text: 'Group Chat' }
      ];
  
      const handleSubmit = async () => {
        if (!currentUser.value) {
          console.error('No user logged in');
          return;
        }
        
        // Include current user in participants if not already included
        const allParticipants = [...new Set([
          currentUser.value.email,
          ...participants.value
        ])];
        
        await createChatroom(
          chatroomType.value,
          allParticipants,
          chatroomName.value
        );
        showModal.value = false;
        resetForm();
      };
  
      const resetForm = () => {
        chatroomType.value = 'single';
        chatroomName.value = '';
        participants.value = [];
      };
  
      onMounted(async () => {
        if (currentUser.value) {
          await fetchUserChatrooms(currentUser.value.uid);
        }
      });
  
      return {
        showModal,
        chatroomType,
        chatroomName,
        participants,
        chatroomTypes,
        chatrooms,
        handleSubmit
      };
    }
  };
  </script>