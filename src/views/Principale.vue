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
            required
          />
  
          <b-form-tags
            v-model="participants"
            placeholder="Add participants by email"
            class="mb-3"
            :state="participantsValid"
          />
          <b-form-invalid-feedback :state="participantsValid">
            {{ participantsError }}
          </b-form-invalid-feedback>
  
          <b-button type="submit" variant="primary" :disabled="!formValid">Create</b-button>
        </b-form>
      </b-modal>
  
      <ChatRoomList :chatrooms="chatrooms" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useChat } from '@/composables/useChat';
  import { useAuth } from '@/composables/useAuth';
  import ChatRoomList from '@/components/ChatRoomList.vue';
  
  export default {
    components: { ChatRoomList },
    setup() {
      const { 
        chatrooms,
        createChatroom,
        fetchUserChatrooms 
      } = useChat();
      
      const { user: currentUser } = useAuth();
      
      const showModal = ref(false);
      const chatroomType = ref('single');
      const chatroomName = ref('');
      const participants = ref([]);
      
      const chatroomTypes = [
        { value: 'single', text: 'Single Chat' },
        { value: 'group', text: 'Group Chat' }
      ];

      const participantsValid = computed(() => {
        if (participants.value.length === 0) return false;
        if (participants.value.length === 1 && participants.value[0] === currentUser.value?.email) return false;
        return true;
      });

      const participantsError = computed(() => {
        if (participants.value.length === 0) return 'Please add at least one participant';
        if (participants.value.length === 1 && participants.value[0] === currentUser.value?.email) {
          return 'You cannot create a chat with just yourself';
        }
        return '';
      });

      const formValid = computed(() => {
        if (chatroomType.value === 'group' && !chatroomName.value.trim()) return false;
        return participantsValid.value;
      });
  
      const handleSubmit = async () => {
        if (!currentUser.value || !formValid.value) {
          return;
        }
        
        const otherParticipants = participants.value.filter(
          email => email !== currentUser.value.email
        );
        
        const allParticipants = [
          currentUser.value.email,
          ...otherParticipants
        ];
        
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
        handleSubmit,
        participantsValid,
        participantsError,
        formValid
      };
    }
  };
  </script>